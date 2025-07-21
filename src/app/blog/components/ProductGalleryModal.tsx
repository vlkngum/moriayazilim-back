"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaAngleLeft, FaChevronRight } from "react-icons/fa6";

interface Props {
  product: {
    id: string;
    name: string;
    description: string;
    category: {
      name: string;
    };
    images: {
      id: string;
      url: string;
      isDefault: boolean;
    }[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductGalleryModal({ product, isOpen, onClose }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      const defaultIndex = product.images.findIndex(img => img.isDefault);
      setCurrentImageIndex(defaultIndex !== -1 ? defaultIndex : 0);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 flex md:justify-center items-center flex-col z-50 backdrop-blur bg-black/60 md:pt-0 pt-15 transition-opacity duration-300">
      <button 
        className="absolute top-3 right-3 text-3xl text-white hover:text-gray-400 transition" 
        onClick={onClose}
      > 
        <IoClose className="cursor-pointer"/>
      </button>

      <div className="bg-white rounded-lg p-6 md:w-full md:max-w-7xl w-[90vw] min-h-[60%] shadow-xl gap-6 flex flex-col md:flex-row transform transition-all duration-300">
        <div className="md:w-1/2 w-full relative flex items-center justify-center">
          <img
            src={product.images[currentImageIndex].url}
            alt={product.name}
            className="rounded md:object-cover md:w-112 w-full"
          />
 
          {product.images.length > 1 && (
            <>
              <button
                className="absolute left-0 text-white p-4 md:p-6 rounded-full aspect-square cursor-pointer hover:bg-black/10 transition-colors"
                onClick={handlePrev}
              >
                <FaAngleLeft className="md:text-2xl text-xl text-black"/>
              </button>
              <button
                className="absolute right-0 text-white p-4 md:p-6 rounded-full aspect-square cursor-pointer hover:bg-black/10 transition-colors"
                onClick={handleNext}
              >
                <FaChevronRight className="md:text-2xl text-xl text-black"/>
              </button>
            </>
          )}
        </div>
        <div className="md:w-1/2 w-full flex flex-col gap-4 justify-between">
          <div>
            <h2 className="md:text-3xl text-2xl font-bold text-gray-800 mb-4">{product.name}</h2>
            <span className="md:text-sm text-xs font-medium text-gray-500 mb-2">
              /{product.category.name}
            </span>
            <p className="md:text-lg my-3 text-xs text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 