// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OTPService, EmailService, SMSService } from '@/lib/auth/otp';
import { prisma } from '@/lib/db';

const sendOTPSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  type: z.enum(['email', 'phone']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, type } = sendOTPSchema.parse(body);

    // Rate limiting check (TODO: implement proper rate limiting with Redis)
    // For now, just a simple check
    const recentOTPs = await prisma.oTPCode.count({
      where: {
        identifier,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
    });

    if (recentOTPs >= 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Слишком много попыток. Попробуйте позже.',
        },
        { status: 429 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Пользователь не найден',
        },
        { status: 404 }
      );
    }

    // Generate OTP
    const code = await OTPService.generateAndStore(identifier);

    // Store in database
    await prisma.oTPCode.create({
      data: {
        identifier,
        code,
        attempts: 0,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    // Send OTP
    if (type === 'email') {
      await EmailService.sendOTP(identifier, code);
    } else {
      await SMSService.sendOTP(identifier, code);
    }

    return NextResponse.json({
      success: true,
      message: `Код отправлен на ${type === 'email' ? 'email' : 'телефон'}`,
      expiresIn: 300, // 5 minutes in seconds
    });
  } catch (error) {
    console.error('Send OTP error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Неверные данные',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Внутренняя ошибка сервера',
      },
      { status: 500 }
    );
  }
}
