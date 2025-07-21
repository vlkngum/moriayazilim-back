import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        paragraphs: true,
      },
    });
    return NextResponse.json(blogs);
  } catch (e) {
    return NextResponse.json({ error: 'Veri çekilemedi', detail: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, image, categoryId, paragraphs } = await req.json();
    const blog = await prisma.blog.create({
      data: {
        title,
        image,
        category: { connect: { id: categoryId } },
        paragraphs: {
          create: Array.isArray(paragraphs)
            ? paragraphs.map((p: any) => ({
                title: p.title,
                desc1: p.desc1,
                image: p.image,
                desc2: p.desc2,
              }))
            : [],
        },
      },
      include: {
        category: true,
        paragraphs: true,
      },
    });
    return NextResponse.json({ success: true, blog });
  } catch (e) {
    return NextResponse.json({ error: 'Kayıt başarısız', detail: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
} 