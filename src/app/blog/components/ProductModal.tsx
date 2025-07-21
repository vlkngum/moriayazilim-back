"use client";

import React, { useState } from 'react';
import ImageUpload from '@/tools/ImageUpload';

interface Category {
  id: string;
  name: string;
}

interface Paragraph {
  title: string;
  desc1: string;
  image: string;
  desc2: string;
}

interface BlogModalProps {
  isOpen: boolean;
  onClose: (shouldRefresh?: boolean) => void;
  categories: Category[];
}

export default function ProductModal({ 
  isOpen, 
  onClose,
  categories
}: BlogModalProps) {
  const [blog, setBlog] = useState({
    title: '',
    image: '',
    categoryId: '',
    paragraphs: [] as Paragraph[],
  });
  const [isSaving, setIsSaving] = useState(false);

  // Blog image handler
  const handleBlogImageChange = (base64Image: string) => {
    setBlog(prev => ({ ...prev, image: base64Image }));
  };

  // Paragraph image handler
  const handleParagraphImageChange = (idx: number, base64Image: string) => {
    setBlog(prev => ({
      ...prev,
      paragraphs: prev.paragraphs.map((p, i) => i === idx ? { ...p, image: base64Image } : p)
    }));
  };

  // Add new paragraph
  const handleAddParagraph = () => {
    setBlog(prev => ({
      ...prev,
      paragraphs: [
        ...prev.paragraphs,
        { title: '', desc1: '', image: '', desc2: '' }
      ]
    }));
  };

  // Remove paragraph
  const handleRemoveParagraph = (idx: number) => {
    setBlog(prev => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, i) => i !== idx)
    }));
  };

  // Update paragraph fields
  const handleParagraphChange = (idx: number, field: keyof Paragraph, value: string) => {
    setBlog(prev => ({
      ...prev,
      paragraphs: prev.paragraphs.map((p, i) => i === idx ? { ...p, [field]: value } : p)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log({
        title: blog.title,
        desc: blog.paragraphs.map(p => p.desc1).join(' '),
        image: blog.image,
        categoryId: blog.categoryId,
        paragraphs: blog.paragraphs,
      });
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: blog.title,
          desc: blog.paragraphs.map(p => p.desc1).join(' '),
          image: blog.image,
          categoryId: blog.categoryId,
          paragraphs: blog.paragraphs,
        })
      });
      if (res.ok) {
        setBlog({ title: '', image: '', categoryId: '', paragraphs: [] });
        onClose(true); // refresh parent
      } else {
        // Hata mesajı gösterilebilir
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Modal kapandığında formu sıfırla
  React.useEffect(() => {
    if (!isOpen) {
      setBlog({ title: '', image: '', categoryId: '', paragraphs: [] });
    }
  }, [isOpen]);

  return (
    <div 
      className={`fixed inset-0 transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      onClick={() => onClose()}
    >
      <div 
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      
      <div 
        className={`fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-800">
              Yeni Blog Ekle
            </h2>
            <button 
              onClick={() => onClose()}
              className="text-gray-500 hover:text-gray-700 transform transition-all duration-200 hover:rotate-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {/* Blog Başlığı */}
            <input
              type="text"
              placeholder="Blog Başlığı"
              value={blog.title}
              onChange={e => setBlog(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Blog Fotoğrafı */}
            <div className={`max-h-112 ${blog.image ? "w-1/2" : "w-auto"}`}>
              <ImageUpload
                onImageChange={handleBlogImageChange}
                id="blog-image"
                initialImageUrl={blog.image}
              />
            </div>
            {/* Blog Kategorisi */}
            <select
              value={blog.categoryId}
              onChange={e => setBlog(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Kategori Seçin</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {/* Paragraflar */}
            <div className="space-y-6">
              {blog.paragraphs.map((p, idx) => (
                <div key={idx} className="border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveParagraph(idx)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    title="Paragrafı Sil"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Paragraf Başlığı"
                    value={p.title}
                    onChange={e => handleParagraphChange(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Paragraf Açıklaması 1"
                    value={p.desc1}
                    onChange={e => handleParagraphChange(idx, 'desc1', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  

                  <div className={`max-h-112 ${p.image ? "w-1/2" : "w-auto"}`}>
                  <ImageUpload
                    onImageChange={img => handleParagraphImageChange(idx, img)}
                    id={`paragraph-image-${idx}`}
                    initialImageUrl={p.image}
                  />
                  </div>
                  <textarea
                    placeholder="Paragraf Açıklaması 2"
                    value={p.desc2}
                    onChange={e => handleParagraphChange(idx, 'desc2', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddParagraph}
                className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-md font-medium mt-2"
              >
                + Paragraf Ekle
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 flex-shrink-0">
            <button
              onClick={() => onClose()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-950 hover:bg-blue-900 rounded-md flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kaydediliyor...
                </>
              ) : (
                'Kaydet'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
