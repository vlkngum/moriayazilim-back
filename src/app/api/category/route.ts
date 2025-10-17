import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const { name } = body;
    
    // Input validation
    if (!name || typeof name !== 'string' || !name.trim()) {
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

      return NextResponse.json({ 
        success: true, 
        category: {
          id: category.id,
          name: category.name
        }
      }, { status: 201 });

    } catch (dbError: unknown) {
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

// DELETE endpoint - kategori sil
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Kategori ID gerekli.' },
        { status: 400 }
      );
    }

    try {
      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id }
      });

      if (!existingCategory) {
        return NextResponse.json(
          { error: 'Kategori bulunamadı.' },
          { status: 404 }
        );
      }

      // Delete the category
      await prisma.category.delete({
        where: { id }
      });

      return NextResponse.json({ 
        success: true,
        message: 'Kategori başarıyla silindi.'
      });

    } catch (dbError: unknown) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Kategori silinirken bir hata oluştu.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Category deletion error:', error);
    return NextResponse.json(
      { error: 'Kategori silinirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}