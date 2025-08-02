'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpenText ,  
  BriefcaseBusiness ,  
  ChevronDown, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const navigation = [ 
  { 
    name: 'Blog', 
    href: '/blog', 
    icon: BookOpenText ,
    hasSubsections: false,
    subsections: [
      { name: 'Bloglarımız', href: '/blog',icon: BookOpenText ,  },
      { name: 'Blog Kategorisi Ekle', href: '/blog/category' ,icon: BookOpenText , }
    ]
  },
  { 
    name: 'Portfolio', 
    href: '/portfolio', 
    icon: BriefcaseBusiness,
    hasSubsections: false,
    subsections: [
      { name: 'Portfoliolarımız', href: '/portfolio',icon: BookOpenText ,  },
    ]
  },
  
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSubsection = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

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

        <div className="flex h-16 items-center justify-center border-b border-blue-900">
          <Link href="/">
            <Image
              src="/logo_white.png"
              alt="logo"
              width={100} 
              height={100} 
              className="w-10 h-10"
            />
          </Link>
        </div>
 
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-1 p-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                            (item.subsections?.some(sub => pathname === sub.href));
              const isExpanded = expandedItems.includes(item.name);

              const itemContent = (
                <>
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.hasSubsections && (
                    isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                  )}
                </>
              );

              return (
                <div key={item.name}>
                  {item.hasSubsections ? (
                    
                    <div
                      onClick={() => toggleSubsection(item.name)}
                      className={`group flex items-center rounded-md px-2 py-2 transition-all duration-200 text-sm cursor-pointer ${
                        isActive
                          ? 'bg-black/40 text-white backdrop-blur-xl'
                          : 'text-gray-300 hover:bg-black/30 hover:text-white hover:backdrop-blur-xl'
                      }`}
                    >
                      
                      {itemContent}
                    </div>
                  ) : (
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
                  )}
                  
                  {item.hasSubsections && isExpanded && item.subsections && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.subsections.map((subsection) => (
                        <Link
                          key={subsection.href}
                          href={subsection.href}
                          onClick={() => setIsOpen(false)}
                          className={` rounded-md px-2 py-2 text-sm transition-all duration-200 flex flex-row ${
                            pathname === subsection.href
                              ? 'bg-black/40 text-white backdrop-blur-xl'
                              : 'text-gray-300 hover:bg-black/30 hover:text-white hover:backdrop-blur-xl'
                          }`}
                        >
                          <subsection.icon
                            className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                              isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                            }`}
                            aria-hidden="true"
                          />
                          {subsection.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
} 