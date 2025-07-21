import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Blogları listele (GET)
// export async function GET() {
//   try {
//     const blogs = await prisma.blog.findMany({
//       orderBy: { createdAt: 'desc' },
//       include: {
//         category: true, // Kategori bilgisini de getir
//       },
//     });
//     return NextResponse.json({ blogs });
//   } catch (e) {
//     return NextResponse.json(
//       { error: 'Veri çekilemedi', detail: e instanceof Error ? e.message : String(e) },
//       { status: 500 }
//     );
//   }
// }

// Blog ekle (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, desc, image, categoryId, paragraphs } = body;

    if (!title?.trim() || !desc?.trim() || !categoryId) {
      return NextResponse.json(
        { error: 'Başlık, açıklama ve kategori zorunludur.' },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.create({
      data: {
        title: title.trim(),
        desc: desc.trim(),
        image: image || '',
        categoryId,
        paragraphs: paragraphs || null,
      },
      // include: {
      //   category: true, // Kategori bilgisini de döndür
      // },
    });

    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error) {
    console.error('Blog creation error:', error);
    return NextResponse.json(
      { error: 'Blog kaydedilirken hata oluştu.' },
      { status: 500 }
    );
  } 
}
