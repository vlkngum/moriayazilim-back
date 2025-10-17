'use client'

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer"; 
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';

// Bu sabitler bileşen dışında tanımlandığı için her render'da yeniden oluşturulmaz.
const hiddenLayoutPages = ['/login', '/register'];

const pageAccessRules = {
  '/user-control': ['static'],
  '/blog': ['database'],
  '/blog/category': ['database'],
  '/portfolio': ['database'],
  '/': ['static', 'database']
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) { 
  const [isMounted, setIsMounted] = useState(false);
  const { isLoggedIn, checkAuth, userType } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Bu useEffect, bileşenin istemci tarafında yüklendiğini (mount edildiğini)
  // doğrulamak için kullanılır. Bu, SSR (Server-Side Rendering) sırasında 
  // window gibi tarayıcıya özel API'lerin çağrılmasını engeller.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sayfa erişim kontrolü yapan fonksiyonu useCallback ile sarmalıyoruz.
  // Bu, fonksiyonun gereksiz yere yeniden oluşturulmasını engeller ve
  // useEffect bağımlılık dizisinde güvenle kullanılmasını sağlar.
  const checkPageAccess = useCallback(() => { 
    // Ana sayfadaysak veya sayfa için bir erişim kuralı tanımlanmamışsa, devam et.
    if (pathname === '/' || !pageAccessRules[pathname as keyof typeof pageAccessRules]) {
      return;
    }

    const allowedUserTypes = pageAccessRules[pathname as keyof typeof pageAccessRules];
    
    // Eğer kullanıcının tipi (userType), o sayfa için izin verilen tipler arasında değilse,
    // kullanıcıyı ana sayfaya yönlendir.
    if (userType && !allowedUserTypes.includes(userType)) {
      router.push('/');
    }
  }, [pathname, userType, router]); // Fonksiyon sadece bu değerler değiştiğinde yeniden oluşur.

  // Bu ana useEffect, kimlik doğrulama ve sayfa yönlendirme mantığını yönetir.
  useEffect(() => {
    // Bileşen henüz istemcide yüklenmediyse (isMounted false ise) hiçbir işlem yapma.
    if (!isMounted) return;

    const initializeAuth = () => {
      const isAuthenticated = checkAuth();
        
      // Kullanıcı giriş yapmamışsa ve bulunduğu sayfa (login, register gibi)
      // layout'un gizlendiği sayfalardan biri değilse, onu login sayfasına yönlendir.
      if (!isAuthenticated && !hiddenLayoutPages.includes(pathname)) {
        router.push('/login');
        return;
      }

      // Kullanıcı giriş yapmışsa, o an bulunduğu sayfa için erişim yetkisini kontrol et.
      if (isAuthenticated) {
        checkPageAccess();
      }
    };

    initializeAuth();
  }, [isMounted, pathname, router, checkAuth, checkPageAccess]); // Bağımlılıklar eklendi.

  // isMounted false iken null döndürmek, SSR ve CSR arasındaki "hydration"
  // uyumsuzluklarını önlemeye yardımcı olur.
  if (!isMounted) {
    return null; 
  }

  // Eğer bulunulan sayfa, layout'un gizlenmesi gereken sayfalardan biriyse
  // (login veya register), sadece children ve Toaster'ı render et.
  if (hiddenLayoutPages.includes(pathname)) {
    return (
      <div className="min-h-screen bg-white">
        <main className="bg-white text-black">
          {children}
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#363636', color: '#fff' },
            success: { duration: 3000, iconTheme: { primary: '#4ade80', secondary: '#fff' }},
            error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' }},
          }}
        />
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa ve yönlendirme işlemi gerçekleşiyorsa, 
  // bir yükleme animasyonu göster.
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Yönlendiriliyor...</p>
        </div>
      </div>
    );
  }

  // Yukarıdaki koşulların hiçbiri karşılanmazsa, bu, kullanıcının giriş yaptığı
  // ve normal bir sayfada olduğu anlamına gelir. Standart layout'u (Sidebar, Footer vb. ile) göster.
  return (
    <>
      <div className="flex min-h-screen bg-white">
        <div className="md:pr-64">
          <Sidebar />
        </div>
        
        <div className="flex-1 flex flex-col min-h-screen">
          <main className="flex-1 bg-white p-4 lg:p-8 pt-5 text-black">
            {children}
          </main>
          <Footer />
        </div>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
          success: { duration: 3000, iconTheme: { primary: '#4ade80', secondary: '#fff' }},
          error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' }},
        }}
      />
    </>
  );
}