import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tüm kullanıcıları getir
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Kullanıcılar getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni kullanıcı ekle
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Basit doğrulamalar
    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Geçersiz veri tipi' },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre boş olamaz' },
        { status: 400 }
      );
    }

    // Kullanıcı adının benzersiz olup olmadığını kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { username: trimmedUsername }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı zaten kullanılıyor' },
        { status: 409 }
      );
    }

    // Yeni kullanıcı oluştur
    const newUser = await prisma.user.create({
      data: {
        username: trimmedUsername,
        password: trimmedPassword
      },
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: newUser 
    }, { status: 201 });

  } catch (error) {
    console.error('Kullanıcı eklenirken hata:', error);
    const message = error instanceof Error ? error.message : 'Kullanıcı eklenemedi';
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development' ? message : 'Kullanıcı eklenemedi' },
      { status: 500 }
    );
  }
} 