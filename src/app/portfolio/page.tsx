'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Page() {
  const router = useRouter();
  const { isLoggedIn, userType } = useAuth();

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Static kullanıcılar portfolio sayfasına erişemez
    if (userType === 'static') {
      router.push('/');
      return;
    }
  }, [isLoggedIn, userType, router]);

  return <div>Portfolio Sayfası</div>;
}
