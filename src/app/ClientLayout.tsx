'use client'
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer"; 
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';

// Sidebar ve Footer gizlenecek sayfalar
const hiddenLayoutPages = ['/login', '/register'];

// Sayfa erişim kuralları
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

  // Client-side mounting kontrolü
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Auth durumunu kontrol et
    const initializeAuth = async () => {
      try {
        const isAuthenticated = checkAuth();
        
        // Eğer giriş yapılmamışsa ve login sayfasında değilse, login'e yönlendir
        if (!isAuthenticated && !hiddenLayoutPages.includes(pathname)) {
          router.push('/login');
          return;
        }

        // Sayfa erişim kontrolü
        if (isAuthenticated && userType) {
          checkPageAccess();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
    };

    initializeAuth();
  }, [isMounted, checkAuth, pathname, router, userType]);

  // Sayfa erişim kontrolü fonksiyonu
  const checkPageAccess = () => {
    // Ana sayfa her zaman erişilebilir
    if (pathname === '/') return;

    const allowedUserTypes = pageAccessRules[pathname as keyof typeof pageAccessRules];
    
    // Eğer sayfa için kural yoksa erişime izin ver
    if (!allowedUserTypes) return;

    // Kullanıcı türü bu sayfaya erişemiyorsa ana sayfaya yönlendir
    if (!allowedUserTypes.includes(userType as string)) {
      router.push('/');
      return;
    }
  };

  // Mount tamamlanana kadar server ile aynı durumu render et
  if (!isMounted) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 flex flex-col min-h-screen">
          <main className="flex-1 bg-white p-4 lg:p-8 pt-5 text-black">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  // Layout gizlenecek sayfalar için sadece içeriği göster
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
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    );
  }

  // Giriş yapmamış kullanıcılar için loading göster
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

  // Normal layout - sidebar ve footer ile
  return (
    <>
      <div className="flex min-h-screen bg-white">
        {/* Sidebar - login yapmış kullanıcılar için */}
        {isLoggedIn && (
          <div className="md:pr-64">
            <Sidebar />
          </div>
        )}
        
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
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}
