import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { verifyAccessToken } from '@/lib/auth/jwt'

const updateStatusSchema = z.object({
  status: z.enum([
    'SUBMITTED',
    'UNDER_REVIEW',
    'ADDITIONAL_INFO',
    'APPROVED',
    'REJECTED',
    'COMPLETED',
  ]),
  comment: z.string().optional(),
  approvedAmount: z.number().positive().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyAccessToken(token)
    
    if (!payload) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            middleName: true,
            studentId: true,
            faculty: true,
            course: true,
            group: true,
          },
        },
        documents: true,
        history: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Check permissions
    if (
      payload.role === 'STUDENT' &&
      application.userId !== payload.userId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error('Application fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyAccessToken(token)
    
    if (!payload) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateStatusSchema.parse(body)

    const application = await prisma.application.findUnique({
      where: { id: params.id },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Students can only submit their own applications
    if (payload.role === 'STUDENT') {
      if (application.userId !== payload.userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      if (validatedData.status !== 'SUBMITTED') {
        return NextResponse.json(
          { error: 'Students can only submit applications' },
          { status: 403 }
        )
      }
    }

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        approvedAmount: validatedData.approvedAmount,
      },
    })

    // Create history entry
    await prisma.applicationHistory.create({
      data: {
        applicationId: params.id,
        action: 'STATUS_CHANGED',
        userId: payload.userId,
        comment: validatedData.comment,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Application update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
