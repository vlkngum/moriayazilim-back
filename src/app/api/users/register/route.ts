import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Yeni kullanıcı kaydı
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Kullanıcı adının benzersiz olup olmadığını kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı zaten kullanılıyor' },
        { status: 409 }
      );
    }

    // Yeni kullanıcı oluştur (şifre hash'lenmeden)
    const newUser = await prisma.user.create({
      data: {
        username,
        password // Hash'leme geçici olarak kaldırıldı
      },
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: newUser,
      message: 'Kullanıcı başarıyla kaydedildi'
    }, { status: 201 });

  } catch (error) {
    console.error('Kullanıcı kaydı hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcı kaydedilemedi' },
      { status: 500 }
    );
  }
} 