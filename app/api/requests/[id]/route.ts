import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const patchSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 });
  }

  const { status } = parsed.data;
  const userId = session.user.id;
  const requestId = params.id;

  const request = await prisma.penpalRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  if (request.receiverId !== userId) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  if (request.status !== 'PENDING') {
    return NextResponse.json({ error: 'ALREADY_PROCESSED' }, { status: 409 });
  }

  const updated = await prisma.penpalRequest.update({
    where: { id: requestId },
    data: { status },
  });

  return NextResponse.json({ request: updated });
}
