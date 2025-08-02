'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpenText ,  
  BriefcaseBusiness ,  
  Menu,
  X,
  LogOut,
  User,
  UserPlus 
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [ 
  { 
    name: 'User Control', 
    href: '/user-control', 
    icon: UserPlus,
    hasSubsections: false,
    subsections: [],
    showForStatic: true,
    showForDatabase: false
  },
  { 
    name: 'Blog', 
    href: '/blog', 
    icon: BookOpenText,
    hasSubsections: false,
    subsections: [],
    showForStatic: false,
    showForDatabase: true
  },
  { 
    name: 'Portfolio', 
    href: '/portfolio', 
    icon: BriefcaseBusiness,
    hasSubsections: false,
    subsections: [],
    showForStatic: false,
    showForDatabase: true
  },
  
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userType, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Kullanıcı tipine göre menü öğelerini filtrele
  const filteredNavigation = navigation.filter(item => {
    if (userType === 'static') {
      return item.showForStatic;
    } else if (userType === 'database') {
      return item.showForDatabase;
    }
    return false;
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-md bg-blue-950 p-2 text-white backdrop-blur-md lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

       
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
 
      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-blue-950 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}> 

        <div className="flex py-4 items-center justify-center border-b border-blue-900">
          <Link href={"/"}>
            <Image
              src="/logo_white.png"
              alt="logo"
              width={100} 
              height={100} 
              className="w-10 h-10 cursor-pointer"
            />
          </Link>
        </div>

        {/* Kullanıcı Bilgisi */}
        <div className="p-4 border-b border-blue-900">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-300">
              {currentUser || 'Kullanıcı'}
            </span>
          </div>
        </div>
 
        <div className="h-[calc(100vh-8rem)] overflow-y-auto">
          <nav className="space-y-1 p-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || 
                            (item.subsections?.some((sub: { href: string }) => pathname === sub.href));

              const itemContent = (
                <>
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{item.name}</span>
                </>
              );

              return (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center rounded-md px-2 py-2 transition-all duration-200 text-sm ${
                      isActive
                        ? 'bg-black/40 text-white backdrop-blur-xl'
                        : 'text-gray-300 hover:bg-black/30 hover:text-white hover:backdrop-blur-xl'
                    }`}
                  >
                    
                    {itemContent}
                  </Link> 
                </div>
              );
            })}
          </nav>
        </div>

        {/* Logout Butonu */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-900">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-sm text-gray-300 hover:bg-black/30 hover:text-white transition-all duration-200 rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
} 