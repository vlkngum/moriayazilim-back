import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(blogs);
  } catch (e) {
    return NextResponse.json({ error: 'Veri çekilemedi', detail: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
