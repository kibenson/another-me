import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { DAILY_REQUEST_LIMIT } from '@/lib/utils';

const createSchema = z.object({
  receiverId: z.string().cuid(),
  message: z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const userId = session.user.id;

  const [sent, received] = await Promise.all([
    prisma.penpalRequest.findMany({
      where: { senderId: userId },
      include: { receiver: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.penpalRequest.findMany({
      where: { receiverId: userId },
      include: { sender: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return NextResponse.json({ sent, received });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 });
  }

  const { receiverId, message } = parsed.data;
  const senderId = session.user.id;

  if (senderId === receiverId) {
    return NextResponse.json({ error: 'CANNOT_REQUEST_SELF' }, { status: 400 });
  }

  // Check daily limit
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCount = await prisma.penpalRequest.count({
    where: {
      senderId,
      createdAt: { gte: today },
    },
  });

  if (todayCount >= DAILY_REQUEST_LIMIT) {
    return NextResponse.json({ error: 'DAILY_LIMIT_REACHED' }, { status: 429 });
  }

  // Check if already exists
  const existing = await prisma.penpalRequest.findUnique({
    where: { senderId_receiverId: { senderId, receiverId } },
  });

  if (existing) {
    return NextResponse.json({ error: 'ALREADY_SENT' }, { status: 409 });
  }

  const request = await prisma.penpalRequest.create({
    data: { senderId, receiverId, message },
  });

  return NextResponse.json({ request }, { status: 201 });
}
