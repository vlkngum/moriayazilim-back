'use client'

import { useAuth } from '@/contexts/AuthContext';
import { Shield, Database, UserPlus, BookOpenText, BriefcaseBusiness } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { currentUser, userType } = useAuth();

  const getUserTypeIcon = () => {
    if (userType === 'static') {
      return <Shield className="h-6 w-6 text-yellow-500" />;
    } else if (userType === 'database') {
      return <Database className="h-6 w-6 text-green-500" />;
    }
    return null;
  };

  const getUserTypeText = () => {
    if (userType === 'static') {
      return 'Statik Kullanıcı';
    } else if (userType === 'database') {
      return 'Veritabanı Kullanıcısı';
    }
    return 'Kullanıcı';
  };

  const getWelcomeMessage = () => {
    if (userType === 'static') {
      return 'Kullanıcı yönetimi paneline hoş geldiniz. Veritabanı kullanıcılarını yönetebilirsiniz.';
    } else if (userType === 'database') {
      return 'Blog ve portfolio yönetimi paneline hoş geldiniz. İçeriklerinizi yönetebilirsiniz.';
    }
    return 'Yönetim paneline hoş geldiniz.';
  };

  const getActionCards = () => {
    if (userType === 'static') {
      return [
        {
          title: 'Kullanıcı Yönetimi',
          description: 'Veritabanı kullanıcılarını ekleyin, düzenleyin ve silin.',
          icon: UserPlus,
          href: '/user-control',
          color: 'bg-blue-600 hover:bg-blue-700'
        }
      ];
    } else if (userType === 'database') {
      return [
        {
          title: 'Blog Yönetimi',
          description: 'Blog yazılarınızı yönetin, yeni blog ekleyin ve kategoriler oluşturun.',
          icon: BookOpenText,
          href: '/blog',
          color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
          title: 'Portfolio Yönetimi',
          description: 'Portfolio projelerinizi yönetin ve yeni projeler ekleyin.',
          icon: BriefcaseBusiness,
          href: '/portfolio',
          color: 'bg-green-600 hover:bg-green-700'
        }
      ];
    }
    return [];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Hoş Geldiniz!
        </h1>
        <div className="flex items-center justify-center space-x-2 mb-8">
          <p className="text-xl text-gray-600">
            Moria Back yönetim paneline hoş geldiniz, <span className="font-semibold text-blue-600">{currentUser}</span>.
          </p>
          {getUserTypeIcon()}
        </div>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 mb-8">
          <span>{getUserTypeText()}</span>
        </div>
        
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          {getWelcomeMessage()}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {getActionCards().map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <card.icon className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">{card.title}</h2>
              </div>
              <p className="text-gray-600 mb-4">
                {card.description}
              </p>
              <Link 
                href={card.href}
                className={`inline-block text-white px-4 py-2 rounded-md transition-colors ${card.color}`}
              >
                {card.title} Git
              </Link>
            </div>
          ))}
        </div>

        {userType === 'static' && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Yönetici Paneli
            </h3>
            <p className="text-yellow-700">
              Statik kullanıcı olarak giriş yaptınız. Sadece kullanıcı yönetimi sayfasına erişiminiz bulunmaktadır.
            </p>
          </div>
        )}

        {userType === 'database' && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              İçerik Yönetimi
            </h3>
            <p className="text-green-700">
              Veritabanı kullanıcısı olarak giriş yaptınız. Blog ve portfolio içeriklerini yönetebilirsiniz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}