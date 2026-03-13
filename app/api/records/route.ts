import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { DAILY_RECORD_LIMIT } from '@/lib/utils';

const createSchema = z.object({
  tagId: z.string().cuid(),
  note: z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const tagSlug = searchParams.get('tag');

  const where: { userId: string; tag?: { slug: string } } = { userId: session.user.id };
  if (tagSlug) where.tag = { slug: tagSlug };

  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where,
      include: { tag: true },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.record.count({ where }),
  ]);

  return NextResponse.json({ records, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT', details: parsed.error.flatten() }, { status: 400 });
  }

  const { tagId, note } = parsed.data;
  const userId = session.user.id;
  const today = new Date().toISOString().split('T')[0];

  // Check daily limit
  const dailyUsage = await prisma.dailyUsage.upsert({
    where: { userId_date: { userId, date: today } },
    update: {},
    create: { userId, date: today, count: 0 },
  });

  if (dailyUsage.count >= DAILY_RECORD_LIMIT) {
    return NextResponse.json({ error: 'DAILY_LIMIT_REACHED' }, { status: 429 });
  }

  // Verify tag exists
  const tag = await prisma.tag.findUnique({ where: { id: tagId } });
  if (!tag) {
    return NextResponse.json({ error: 'TAG_NOT_FOUND' }, { status: 404 });
  }

  const [record] = await prisma.$transaction([
    prisma.record.create({
      data: { userId, tagId, note },
      include: { tag: true },
    }),
    prisma.dailyUsage.update({
      where: { userId_date: { userId, date: today } },
      data: { count: { increment: 1 } },
    }),
  ]);

  return NextResponse.json({ record }, { status: 201 });
}
