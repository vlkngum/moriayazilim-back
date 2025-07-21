'use client';

import React, { useState, useEffect } from 'react';

interface ImageUploadProps {
  onImageChange: (base64Image: string) => void;
  id: string;
  initialImageUrl?: string;
}

export default function ImageUpload({ onImageChange, id, initialImageUrl }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(initialImageUrl || '');

  useEffect(() => {
    setPreviewUrl(initialImageUrl || '');
  }, [initialImageUrl]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        setPreviewUrl(base64Image);
        onImageChange(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        setPreviewUrl(base64Image);
        onImageChange(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setPreviewUrl('');
    onImageChange('');
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-2">Görsel</label>
      <div 
        className={`border-2 border-dashed border-gray-300 rounded-lg ${previewUrl ? 'p-0' : 'p-6'} text-center hover:border-blue-500 transition-colors duration-200 h-full w-full flex flex-col items-center justify-center relative overflow-hidden`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={id}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-sm text-gray-600">
              <label htmlFor={id} className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Görsel yüklemek için tıklayın</span>
              </label>
              <p className="pl-1">veya sürükleyip bırakın</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF (max. 10MB)</p>
          </div> 
      </div>
    </>
  );
} 