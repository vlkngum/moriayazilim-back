 'use client';

import { useEffect } from "react"; 
import { usePathname, useSearchParams } from 'next/navigation';

export default function Loading({
  setIsLoading
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
   
  useEffect(() => { 
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); 
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams, setIsLoading]);
 
  useEffect(() => { 
    const handleLoad = () => {
      setIsLoading(false);
    };
   
    if (document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
    }
    
    return () => {     
      window.removeEventListener('load', handleLoad);
    };
  }, []);  
 
  return null;
}