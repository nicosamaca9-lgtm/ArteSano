import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  product?: any; // Si existe, es edición
  allProducts: any[];
}

export function ProductFormModal({ isOpen, onClose, onSubmit, product, allProducts }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'antojos',
    isCarousel: false,
    isSpecial: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price ? product.price.toString() : '',
        category: product.category || 'antojos',
        isCarousel: product.isCarousel || false,
        isSpecial: product.isSpecial || false,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'antojos',
        isCarousel: false,
        isSpecial: false,
      });
      setFile(null);
    }
    setError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!product && !file) {
        throw new Error('La imagen es obligatoria para un producto nuevo');
      }

      if (formData.isCarousel) {
        const carouselCount = allProducts.filter(p => p.isCarousel && p.id !== product?.id).length;
        if (carouselCount >= 7) {
          throw new Error('Ya hay 7 productos en el carrusel. Debes quitar uno antes de agregar este.');
        }
      }

      if (formData.isSpecial) {
        const specialCount = allProducts.filter(p => p.isSpecial && p.id !== product?.id).length;
        if (specialCount >= 4) {
          throw new Error('Ya hay 4 productos en favoritos. Debes quitar uno antes de agregar este.');
        }
      }

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('category', formData.category);
      submitData.append('isCarousel', formData.isCarousel.toString());
      submitData.append('isSpecial', formData.isSpecial.toString());
      if (file) {
        submitData.append('image', file);
      }

      await onSubmit(submitData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="font-caveat font-bold text-3xl text-gray-900">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-4 font-montserrat">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#064E3B] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#064E3B] outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#064E3B] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#064E3B] outline-none transition-all bg-white"
                >
                  <option value="antojos">Antojos</option>
                  <option value="jugos y smoothies">Jugos y Smoothies</option>
                  <option value="comida">Comida</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isCarousel"
                  checked={formData.isCarousel}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#064E3B] border-gray-300 rounded focus:ring-[#064E3B]"
                />
                <span className="text-sm font-medium text-gray-700">Mostrar en Carrusel</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isSpecial"
                  checked={formData.isSpecial}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#064E3B] border-gray-300 rounded focus:ring-[#064E3B]"
                />
                <span className="text-sm font-medium text-gray-700">Destacar en Favoritos</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#064E3B]/10 file:text-[#064E3B] hover:file:bg-[#064E3B]/20 transition-all cursor-pointer"
              />
              {product?.image && !file && (
                <div className="mt-2 text-xs text-gray-500">
                  El producto ya tiene una imagen. Sube una nueva para reemplazarla.
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 shrink-0">
          <button
            form="productForm"
            type="submit"
            disabled={loading}
            className="w-full bg-[#064E3B] hover:bg-[#064E3B]/90 text-white font-montserrat font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </div>
      </div>
    </div>
  );
}
