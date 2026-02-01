import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { verifyAccessToken } from '@/lib/auth/jwt'

const createApplicationSchema = z.object({
  reason: z.enum([
    'LOW_INCOME',
    'MEDICAL',
    'EMERGENCY',
    'ORPHAN',
    'DISABILITY',
    'LARGE_FAMILY',
    'SINGLE_PARENT',
    'ACADEMIC_EXCELLENCE',
    'OTHER',
  ]),
  requestedAmount: z.number().positive(),
  description: z.string().min(10),
})

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyAccessToken(token)
    
    if (!payload || payload.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createApplicationSchema.parse(body)

    const application = await prisma.application.create({
      data: {
        userId: payload.userId,
        applicationNumber: `APP-${Date.now()}`,
        reason: validatedData.reason,
        amount: validatedData.requestedAmount,
        description: validatedData.description,
        status: 'DRAFT',
      },
    })

    // Create history entry
    await prisma.applicationHistory.create({
      data: {
        applicationId: application.id,
        action: 'CREATED',
        userId: payload.userId,
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Application creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyAccessToken(token)
    
    if (!payload) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const where =
      payload.role === 'STUDENT' ? { userId: payload.userId } : {}

    const applications = await prisma.application.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            middleName: true,
            studentId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Applications fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
