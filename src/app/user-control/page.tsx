'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';
import AddUserModal from '@/components/AddUserModal';

interface User {
  id: string;
  username: string;
  createdAt: string;
}

export default function UserControlPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const router = useRouter();
  const { isLoggedIn, userType } = useAuth();

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Database kullanıcılar user-control sayfasına erişemez
    if (userType === 'database') {
      router.push('/');
      return;
    }

    fetchUsers();
  }, [isLoggedIn, userType, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (userData: { username: string; password: string }) => {
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Başarılı kayıt
        fetchUsers(); // Kullanıcı listesini yenile
        return;
      } else {
        // Hata durumu
        throw new Error(data.error || 'Kullanıcı kaydedilemedi');
      }
    } catch (error) {
      console.error('Kullanıcı eklenirken hata:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-md cursor-pointer transition-colors text-nowrap md:text-md text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
           Kullanıcı Ekle
        </button>
      </div>

      {/* Kullanıcı Listesi */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg text-gray-900">Veritabanı Kullanıcıları</h2>
        </div>
        
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oluşturulma Tarihi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                      Henüz kullanıcı bulunmuyor
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AddUserModal Component */}
      <AddUserModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddUser}
      />
    </div>
  );
} 