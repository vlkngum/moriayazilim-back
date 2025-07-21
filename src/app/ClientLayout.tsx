'use client' 
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer"; 
import Loading from "@/tools/Loading";
import { Suspense } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) { 
  const [isLoading, setIsLoading] = useState(true);

  return (
    <> 
      {isLoading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        </div>
      )}

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
 
      <Suspense fallback={null}>
        <Loading setIsLoading={setIsLoading} />
      </Suspense>
    </> 
  );
}
