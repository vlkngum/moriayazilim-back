import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

interface Blog {
  id: string;
  title: string;
  desc: string;
  image: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

interface BlogListProps {
  blogs: Blog[];
  categories: Category[];
  onEdit?: (blog: Blog) => void;
  onDelete?: (blog: Blog) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

const BlogList: React.FC<BlogListProps> = ({ blogs, categories, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {blogs.map(blog => {
        const category = categories.find(cat => cat.id === blog.categoryId);
        return (
          <div key={blog.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center border border-gray-300 relative group">
            <div className="w-full gap-2 opacity-100 transition-opacity pb-2 flex justify-between">
              <h3 className="text-xl text-gray-800 mb-2">{blog.title}</h3>
              <div>
                <button onClick={() => onEdit && onEdit(blog)} className="p-1 rounded bg-blue-100" title="Düzenle">
                <FaEdit className="text-blue-500 cursor-pointer" />
              </button>
              <button onClick={() => onDelete && onDelete(blog)} className="p-1 rounded bg-red-100" title="Sil">
                <FaTrash className="text-red-600 cursor-pointer" />
              </button>
              </div>
            </div>
            <Image src={blog.image} alt={blog.title} width={400} height={192} className="w-full min-h-48 max-h-84 object-cover rounded mb-3 border border-gray-300" />
            
            <div className="flex gap-2 items-center text-xs text-gray-500 mb-2">
              <span>{category ? category.name : 'Kategori Yok'}</span>
              <span>•</span>
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-3">{blog.desc}</p>
          </div>
        );
      })}
    </div>
  );
};

export default BlogList; 