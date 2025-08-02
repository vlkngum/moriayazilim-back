"use client";


import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  const pages = [
    {
      href:'/blog',
      text:'Bloglarımız',
    },
    {
      href:'/blog/category',
      text:'Blog Kategorilerimiz',
    }
  ];

  return (
    <html>
      <body>
        <div className="flex min-h-screen">
          <main className="flex-1 overflow-y-auto">
            {/* Header Section */}
            <div className="w-full border-b border-gray-400">
              <div className="md:mx-18 my-6 md:my-2">
                <div className="py-4">
                  <div className="flex items-center justify-between px-6 md:pb-5 md:flex-row flex-col">
                    <h1 className="text-3xl font-bold text-gray-900 pb-3">
                      Blog Yönetim Sistemi
                    </h1>
                    <div className="flex items-center space-x-2">
                      {pages.map((page, index) => {
                        const isActive = pathname === page.href || 
                          (page.href === '/products' && pathname === '/products') ||
                          (page.href === '/products/category' && pathname === '/products/category');
                        return (
                          <Link
                            key={index}
                            href={page.href}
                            className={`px-2 py-2 transition-colors duration-500
                              ${isActive 
                                ? 'text-gray-600 border-b border-blue-950 hover:text-blue-950 hover:bg-gray-100 hover:rounded-md hover:border-none' 
                                : 'text-blue-950 rounded-md border-none'
                              }`}
                          >
                            {page.text}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:px-14 py-8">
              <div className="rounded-lg border border-gray-300 shadow-sm px-4 py-8" >
                {children}
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
