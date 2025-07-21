import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Blog ekle (POST)
export async function POST(req: NextRequest) {
  try {
    console.log('POST request received');
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { title, desc, image, categoryId, paragraphs } = body;

    // Validation
    if (!title?.trim()) {
      console.log('Validation failed: title missing');
      return NextResponse.json(
        { error: 'Başlık zorunludur.' },
        { status: 400 }
      );
    }

    if (!desc?.trim()) {
      console.log('Validation failed: desc missing');
      return NextResponse.json(
        { error: 'Açıklama zorunludur.' },
        { status: 400 }
      );
    }

    if (!categoryId?.trim()) {
      console.log('Validation failed: categoryId missing');
      return NextResponse.json(
        { error: 'Kategori zorunludur.' },
        { status: 400 }
      );
    }

    console.log('Creating blog with data:', {
      title: title.trim(),
      desc: desc.trim(),
      image: image || '',
      categoryId: categoryId.trim(),
      paragraphs: paragraphs || null,
    });

    const blog = await prisma.blog.create({
      data: {
        title: title.trim(),
        desc: desc.trim(),
        image: image || '',
        categoryId: categoryId.trim(),
        paragraphs: paragraphs || null,
      },
    });

    console.log('Blog created successfully:', blog);

    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error) {
    console.error('Blog creation error:', error);
    
    // Prisma hatalarını daha detaylı logla
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Blog kaydedilirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Blog güncelle (PUT)
export async function PUT(req: NextRequest) {
  try {
    console.log('PUT request received');
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID zorunludur.' }, { status: 400 });
    }
    
    const body = await req.json();
    console.log('Update request body:', body);
    
    const { title, desc, image, categoryId, paragraphs } = body;
    
    if (!title?.trim() || !desc?.trim() || !categoryId?.trim()) {
      return NextResponse.json(
        { error: 'Başlık, açıklama ve kategori zorunludur.' },
        { status: 400 }
      );
    }
    
    console.log('Updating blog with ID:', id);
    
    const updated = await prisma.blog.update({
      where: { id },
      data: {
        title: title.trim(),
        desc: desc.trim(),
        image: image || '',
        categoryId: categoryId.trim(),
        paragraphs: paragraphs || null,
      },
    });
    
    console.log('Blog updated successfully:', updated);
    
    return NextResponse.json({ success: true, blog: updated });
  } catch (error) {
    console.error('Blog update error:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Blog güncellenirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Blog sil (DELETE) - ihtiyaç halinde
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID zorunludur.' }, { status: 400 });
    }
    
    await prisma.blog.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog delete error:', error);
    return NextResponse.json(
      { error: 'Blog silinirken hata oluştu.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Tüm blogları getir (GET)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Tek blog getir
      const blog = await prisma.blog.findUnique({
        where: { id },
      });
      
      if (!blog) {
        return NextResponse.json({ error: 'Blog bulunamadı.' }, { status: 404 });
      }
      
      return NextResponse.json({ blog });
    } else {
      // Tüm blogları getir
      const blogs = await prisma.blog.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      return NextResponse.json({ blogs });
    }
  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { error: 'Bloglar getirilirken hata oluştu.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}