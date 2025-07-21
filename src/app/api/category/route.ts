import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Dinamik import ile PrismaClient'ı yükle
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const body = await req.json();
    const { name } = body;
    
    // Input validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: 'Kategori adı zorunludur.' }, 
        { status: 400 }
      );
    }

    try {
      // Database operation - Prisma otomatik olarak createdAt'i set edecek
      const category = await prisma.category.create({
        data: { 
          name: name.trim()
        },
        select: { 
          id: true, 
          name: true,
          createdAt: true
        },
      });

      await prisma.$disconnect();

      return NextResponse.json({ 
        success: true, 
        category: {
          id: category.id,
          name: category.name
        }
      }, { status: 201 });

    } catch (dbError: unknown) {
      await prisma.$disconnect();
      
      // Unique constraint error (eğer name unique ise)
      if (typeof dbError === 'object' && dbError !== null && 'code' in dbError && (dbError as { code?: string }).code === 'P2002') {
        return NextResponse.json(
          { error: 'Bu kategori adı zaten mevcut.' },
          { status: 409 }
        );
      }
      
      console.error('Database error:', dbError);
      throw dbError;
    }

  } catch (error) {
    console.error('Category creation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Kategori eklenirken bir hata oluştu.',
        detail: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.message : String(error)) : undefined
      }, 
      { status: 500 }
    );
  }
}

// GET endpoint - kategorileri listele
export async function GET() {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    await prisma.$disconnect();

    return NextResponse.json({ 
      success: true, 
      categories 
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Kategoriler alınamadı.' },
      { status: 500 }
    );
  }
}