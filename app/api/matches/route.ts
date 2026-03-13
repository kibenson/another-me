import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { computeMatches } from '@/lib/matching';
import { TAG_SLUGS } from '@/lib/tags';
import { RECORDS_REQUIRED_FOR_MATCH } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const userId = session.user.id;

  const totalRecords = await prisma.record.count({ where: { userId } });
  if (totalRecords < RECORDS_REQUIRED_FOR_MATCH) {
    return NextResponse.json({
      locked: true,
      remaining: RECORDS_REQUIRED_FOR_MATCH - totalRecords,
      matches: [],
    });
  }

  const myRecords = await prisma.record.findMany({
    where: { userId },
    include: { tag: true },
  });

  const myTagCounts: Record<string, number> = {};
  for (const rec of myRecords) {
    myTagCounts[rec.tag.slug] = (myTagCounts[rec.tag.slug] ?? 0) + 1;
  }

  const eligibleUsers = await prisma.user.findMany({
    where: { id: { not: userId } },
    include: { records: { include: { tag: true } } },
  });

  const othersData = eligibleUsers
    .filter((u) => u.records.length >= RECORDS_REQUIRED_FOR_MATCH)
    .map((u) => {
      const tagCounts: Record<string, number> = {};
      for (const rec of u.records) {
        tagCounts[rec.tag.slug] = (tagCounts[rec.tag.slug] ?? 0) + 1;
      }
      return { userId: u.id, name: u.name, email: u.email, tagCounts };
    });

  const matches = computeMatches(myTagCounts, othersData, TAG_SLUGS, 0.2);

  return NextResponse.json({ locked: false, matches });
}
