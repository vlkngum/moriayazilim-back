import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Statik kullanıcı bilgisi
const STATIC_USER = {
  username: 'moriayazilim',
  password: '!moriayazlim!my!'
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Önce statik kullanıcıyı kontrol et
    if (username === STATIC_USER.username && password === STATIC_USER.password) {
      return NextResponse.json({
        success: true,
        user: {
          username: STATIC_USER.username,
          isStatic: true
        }
      });
    }

    // Statik kullanıcı değilse veritabanından kontrol et
    const dbUser = await prisma.user.findUnique({
      where: { username }
    });

    if (dbUser && dbUser.password === password) {
      return NextResponse.json({
        success: true,
        user: {
          id: dbUser.id,
          username: dbUser.username,
          isStatic: false,
          createdAt: dbUser.createdAt
        }
      });
    }

    // Kullanıcı bulunamadı veya şifre yanlış
    return NextResponse.json(
      { error: 'Kullanıcı adı veya şifre hatalı' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 