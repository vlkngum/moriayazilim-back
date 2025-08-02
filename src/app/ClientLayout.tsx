'use client'
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer"; 
import { useAuth } from "@/contexts/AuthContext";

// Sidebar ve Footer gizlenecek sayfalar
const hiddenLayoutPages = ['/login', '/register'];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) { 
  const [isMounted, setIsMounted] = useState(false);
  const { isLoggedIn, checkAuth } = useAuth();
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
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
    };

    initializeAuth();
  }, [isMounted, checkAuth, pathname, router]);

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
  );
}
