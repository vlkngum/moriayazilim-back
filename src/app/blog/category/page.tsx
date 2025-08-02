"use client";

import React, { useEffect, useState } from "react";
import CategoryModal from "../components/CategoryModal";

type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Kategori silme fonksiyonu
  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/category?id=${categoryId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      } else {
        alert(data.error || "Silme işlemi başarısız.");
      }
    } catch {
      alert("Bir hata oluştu.");
    }
  };

  // Kategorileri çek
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/category");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      } else {
        console.error("Kategori çekme hatası:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl  text-gray-800">Kategoriler</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-950 text-white rounded-md hover:bg-blue-900 transition-colors"
        >
          Yeni Kategori Ekle
        </button>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategoryCreated={(category) => {
          console.log("Yeni kategori:", category);
          setIsModalOpen(false);
          fetchCategories(); // Kategorileri yeniden yükle
        }}
      />

      <div>
        {loading ? (
          <p className="text-gray-500">Yükleniyor...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">Henüz kategori eklenmemiş.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
                <div
                key={category.id}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      {/* {category.products.length} ürün */}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-500 hover:text-red-700 hover:cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div> 
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
