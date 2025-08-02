"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProductModal from './components/ProductModal';
import BlogList from './components/BlogList';
import Select from 'react-select';
import { FaChevronDown } from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
}

interface Blog {
  id: string;
  title: string;
  desc: string;
  image: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'title'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    

    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/get-blog');
        const data = await res.json();
        setBlogs(data);
      } catch {
        setBlogs([]);
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category');
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
      } catch {
        setCategories([]);
      }
    };
    fetchBlogs();
    fetchCategories();
  }, [isLoggedIn, router]);

  // Modal kapandığında blog eklenmişse veya güncellendiyse tekrar fetch et
  const handleModalClose = (shouldRefresh = false) => {
    setIsModalOpen(false);
    setEditBlog(null);
    if (shouldRefresh) {
      fetch('/api/get-blog')
        .then(res => res.json())
        .then(data => setBlogs(data));
      fetch('/api/category')
        .then(res => res.json())
        .then(data => setCategories(data.success ? data.categories : []));
    }
  };

  // Edit blog
  const handleEdit = (blog: Blog) => {
    setEditBlog(blog);
    setIsModalOpen(true);
  };

  // Delete blog
  const handleDelete = async (blog: Blog) => {
    if (!window.confirm('Bu blogu silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/blog?id=${blog.id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs(prev => prev.filter(b => b.id !== blog.id));
      } else {
        alert('Silme işlemi başarısız.');
      }
    } catch {
      alert('Silme işlemi sırasında hata oluştu.');
    }
  };

  // Filtreleme ve sıralama
  const filteredBlogs = blogs
    .filter(blog => !selectedCategory || blog.categoryId === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      return 0;
    });

  // Options for react-select
  const categoryOptions = [
    { value: '', label: 'Tüm Kategoriler' },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ];
  const sortByOptions = [
    { value: 'createdAt', label: 'Tarihe Göre' },
    { value: 'title', label: 'Başlığa Göre' }
  ];
  const sortOrderOptions = [
    { value: 'desc', label: 'Azalan' },
    { value: 'asc', label: 'Artan' }
  ];

  return (
    <div className="space-y-6 py-6 px-2">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold text-gray-800">Bloglar</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-950 text-white rounded-md hover:bg-blue-900 transition-colors"
        >
          Blog Ekle
        </button>
      </div>

      {/* Filtre ve sıralama seçenekleri */}
      <div className="flex flex-wrap gap-4 items-center mb-4 p-2">
        <div className="min-w-[180px]">
          <Select
            options={categoryOptions}
            value={categoryOptions.find(opt => opt.value === selectedCategory)}
            onChange={opt => setSelectedCategory(opt?.value || '')}
            isSearchable={false}
            components={{ DropdownIndicator: () => <FaChevronDown className="text-gray-500 mx-1" /> }}
            styles={{
              control: (base) => ({ ...base, borderRadius: 8, borderColor: '#e5e7eb', minHeight: 40 }),
              menu: (base) => ({ ...base, zIndex: 20 }),
              singleValue: (base) => ({ ...base, color: '#1e293b' }),
            }}
          />
        </div>
        <div className="min-w-[150px]">
          <Select
            options={sortByOptions}
            value={sortByOptions.find(opt => opt.value === sortBy)}
            onChange={opt => setSortBy(opt?.value as 'createdAt' | 'title')}
            isSearchable={false}
            components={{ DropdownIndicator: () => <FaChevronDown className="text-gray-500 mx-1" /> }}
            styles={{
              control: (base) => ({ ...base, borderRadius: 8, borderColor: '#e5e7eb', minHeight: 40 }),
              menu: (base) => ({ ...base, zIndex: 20 }),
              singleValue: (base) => ({ ...base, color: '#1e293b' }),
            }}
          />
        </div>
        <div className="min-w-[120px]">
          <Select
            options={sortOrderOptions}
            value={sortOrderOptions.find(opt => opt.value === sortOrder)}
            onChange={opt => setSortOrder(opt?.value as 'asc' | 'desc')}
            isSearchable={false}
            components={{ DropdownIndicator: () => <FaChevronDown className="text-gray-500 mx-1" /> }}
            styles={{
              control: (base) => ({ ...base, borderRadius: 8, borderColor: '#e5e7eb', minHeight: 40 }),
              menu: (base) => ({ ...base, zIndex: 20 }),
              singleValue: (base) => ({ ...base, color: '#1e293b' }),
            }}
          />
        </div>
      </div>

      {/* Ürün Sayısı */}
      <div className="text-sm text-gray-500 px-4">
        {filteredBlogs.length} blog bulundu
      </div>

      <BlogList
        blogs={filteredBlogs}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => handleModalClose(true)}
        categories={categories}
        initialBlog={editBlog}
        isEdit={!!editBlog}
      />
    </div>
  );
} 