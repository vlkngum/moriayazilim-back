"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ProductModal from './components/ProductModal';
import ProductGalleryModal from './components/ProductGalleryModal';

interface Paragraph {
  title: string;
  desc1: string;
  image: string;
  desc2: string;
}

interface Blog {
  id: string;
  title: string;
  image: string;
  categoryId: string;
  category: Category;
  paragraphs: Paragraph[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  images: {
    id: string;
    url: string;
    isDefault: boolean;
  }[];
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blog', { cache: 'no-store' });
      const data = await res.json();
      console.log('Fetched blogs:', data.blogs);
      if (res.ok) {
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      console.error('Blog fetch error:', error);
    }
  };

  // Kategorileri fetch et
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/category');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      // Hata yönetimi
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  // Modal kapandığında blog eklenmişse tekrar fetch et
  const handleModalClose = (shouldRefresh = false) => {
    setIsModalOpen(false);
    if (shouldRefresh) fetchBlogs();
  };

  // Ürün sil
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    try {
      // setProducts(prev => prev.filter(p => p.id !== id)); // This line was removed as per the edit hint
      toast.success('Ürün başarıyla silindi');
    } catch (error) {
      toast.error('Ürün silinirken bir hata oluştu');
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsGalleryModalOpen(true);
  };

  // const filteredProducts = product.filter((product: Product) => 
  //   selectedCategory === 'all' || product.categoryId === selectedCategory
  // ); // This line was removed as per the edit hint

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Ürünler</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-950 text-white rounded-md hover:bg-blue-900 transition-colors"
        >
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Kategori Filtreleme */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-gray-600">Kategori:</span>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
            text-sm text-gray-700 bg-white hover:border-blue-500 transition-colors"
        >
          <option value="all">Tümü</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Ürün Sayısı */}
      <div className="text-sm text-gray-500">
        {/* {filteredProducts.length} ürün bulundu */}
        {blogs.length} blog bulundu
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog: Blog) => {
          const defaultImage = blog.paragraphs.find(p => p.image) || blog.paragraphs[0];
          
          return (
            <div
              key={blog.id}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleProductClick({ id: blog.id, name: blog.title, description: blog.paragraphs.map(p => p.desc1).join(' '), categoryId: blog.categoryId, category: blog.category, images: [] })}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{blog.title}</h3>
                  <p className="text-sm text-gray-500">/{blog.category.name}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{blog.paragraphs.map(p => p.desc1).join(' ')}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // handleDeleteProduct(product.id); // This line was removed as per the edit hint
                  }}
                  className="text-red-500 hover:text-red-700 hover:cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              {defaultImage && (
                <div className="mt-4">
                  <img
                    src={defaultImage.image}
                    alt={blog.title}
                    className="w-full min-h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => handleModalClose(true)}
        categories={categories}
      />

      <ProductGalleryModal
        product={selectedProduct}
        isOpen={isGalleryModalOpen}
        onClose={() => {
          setIsGalleryModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
} 