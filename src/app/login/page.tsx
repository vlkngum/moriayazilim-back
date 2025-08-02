'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
  // const [username, setUsername] = useState('moriayazilim');
  // const [password, setPassword] = useState('!moriayazlim!my!');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // AuthContext'teki login fonksiyonunu kullan
    const success = await login(username, password);
    
    if (success) {
      router.push('/');
    } else {
      setError('Kullanıcı adı veya şifre hatalı!');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f2f3] py-12 px-4 sm:px-6 lg:px-8">

      
      <div className="max-w-4xl w-full">
        <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-300">
          {/* Sol taraf - Logo ve İsim */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 to-blue-950 p-12">
            <div className="w-full flex flex-col justify-center items-center text-white">
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15">
                    <Image 
                      src="/logo_white.png" 
                      alt="Logo" 
                      width={80}
                      height={80}
                      className="w-20 h-20"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Moria Yazılım
                </h1>
                <p className="text-blue-100 text-lg font-medium">Yönetim Paneli</p>
                <div className="mt-6 w-16 h-1 bg-white/30 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>

          {/* Sağ taraf - Giriş Formu */}
          <div className="w-full lg:w-1/2 p-8 ">
            <div className="max-w-sm mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Giriş Yap
                </h2>
                <p className="text-sm text-gray-600">
                  Hesabınıza giriş yapın
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Kullanıcı Adı
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Kullanıcı adınızı girin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Şifrenizi girin"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-blue-900 cursor-pointer hover:bg-blue-900 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 