'use client'

import { useState } from 'react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: { username: string; password: string }) => Promise<void>;
}

export default function AddUserModal({ isOpen, onClose, onSubmit }: AddUserModalProps) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }

    setIsSaving(true);

    try {
      await onSubmit(formData);
      setFormData({ username: '', password: '' });
      onClose();
    } catch (error) {
      console.error('Kullanıcı eklenirken hata:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSaving) {
      handleSubmit();
    }
  };

  const handleClose = () => {
    setFormData({ username: '', password: '' });
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 transition-all duration-300 ease-in-out z-50 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={handleClose}
    >
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`fixed right-0 top-0 h-full w-screen md:w-1/5 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Yeni Kullanıcı Ekle</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transform transition-all duration-200 hover:rotate-90"
              disabled={isSaving}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              onKeyPress={handleKeyPress}
              disabled={isSaving}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              autoFocus={isOpen}
            />

            <input
              type="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onKeyPress={handleKeyPress}
              disabled={isSaving}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-all hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving || !formData.username.trim() || !formData.password.trim()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-all hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  isSaving || !formData.username.trim() || !formData.password.trim()
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-950 hover:bg-blue-900'
                }`}
              >
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 