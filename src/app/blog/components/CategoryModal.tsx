"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (category: Category) => void;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onCategoryCreated,
}: CategoryModalProps) {
  const [categoryName, setCategoryName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    if (!categoryName.trim()) {
      toast.error("Kategori adı boş olamaz");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch('/api/category', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          name: categoryName.trim()
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Kategori eklenemedi');
      }

      const data = await res.json();
      
      // Success callback
      onCategoryCreated(data.category);
      toast.success('Kategori başarıyla eklendi!');
      
      setCategoryName('');
      onClose();
    } catch (err: unknown) {
      console.error('Category save error:', err);
      if (err instanceof Error) {
        toast.error(err.message || 'Kategori kaydedilirken hata oluştu');
      } else {
        toast.error('Kategori kaydedilirken hata oluştu');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSaving) {
      handleSave();
    }
  };

  return (
    <div
      className={`fixed inset-0 transition-all duration-300 ease-in-out z-50 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={onClose}
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
            <h2 className="text-xl font-semibold text-gray-800">Yeni Kategori Ekle</h2>
            <button
              onClick={onClose}
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
              placeholder="Kategori Adı"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSaving}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              autoFocus={isOpen}
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-all hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !categoryName.trim()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-all hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  isSaving || !categoryName.trim() 
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