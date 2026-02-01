// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OTPService } from '@/lib/auth/otp';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db';

const verifyOTPSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  code: z.string().length(6, 'Code must be 6 digits'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, code } = verifyOTPSchema.parse(body);

    // Get OTP from database
    const otpRecord = await prisma.oTPCode.findFirst({
      where: {
        identifier,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        {
          success: false,
          error: 'Код не найден или истек срок действия',
        },
        { status: 400 }
      );
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await prisma.oTPCode.delete({
        where: { id: otpRecord.id },
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Превышено количество попыток. Запросите новый код',
        },
        { status: 400 }
      );
    }

    // Verify code
    if (otpRecord.code !== code) {
      await prisma.oTPCode.update({
        where: { id: otpRecord.id },
        data: {
          attempts: otpRecord.attempts + 1,
        },
      });
      return NextResponse.json(
        {
          success: false,
          error: `Неверный код. Осталось попыток: ${3 - (otpRecord.attempts + 1)}`,
        },
        { status: 400 }
      );
    }

    // Get user
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

    // Delete used OTP
    await prisma.oTPCode.delete({
      where: { id: otpRecord.id },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      tokenVersion: 0, // TODO: implement token versioning
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        studentId: user.studentId,
        faculty: user.faculty,
        department: user.department,
        course: user.course,
      },
      accessToken,
    });

    // Set refresh token as httpOnly cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Verify OTP error:', error);

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
