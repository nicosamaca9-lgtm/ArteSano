import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { productService } from '../services/productService';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmModal } from './ConfirmModal';

interface ProductSpecialProps {
  title: React.ReactNode;
  products: any[];
  onRefresh: () => void;
}

const PASTEL_COLORS = [
  'bg-[#A855F7]', // Purple
  'bg-[#F59E0B]', // Orange
  'bg-[#EF4444]', // Red
  'bg-[#3B82F6]'  // Blue
];

export function ProductSpecial({ title, products, onRefresh }: ProductSpecialProps) {
  const { isAdmin } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Limitar a 5 productos
  const displayProducts = products.filter(p => p.isSpecial).slice(0, 4);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(deletingId);
      onRefresh();
    } catch (error) {
      console.error("Error al eliminar", error);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const handleSubmitForm = async (formData: FormData) => {
    if (editingProduct) {
      await productService.updateProduct(editingProduct.id, formData);
    } else {
      await productService.createProduct(formData);
    }
    onRefresh();
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-stone-50 overflow-hidden relative" id="menu">
      <div className="max-w-7xl mx-auto relative">
        {isAdmin && (
          <button 
            onClick={handleCreate}
            className="absolute top-0 right-0 z-20 bg-[#064E3B] text-white p-3 rounded-full hover:bg-[#064E3B]/90 transition-colors shadow-lg"
            title="Crear nuevo producto"
          >
            <Plus size={24} />
          </button>
        )}

        <h2 className="text-gray-900 font-caveat font-bold text-5xl md:text-6xl text-center tracking-tight mb-8 leading-tight">
          {title}
        </h2>
        
        {/* CSS Scroll Snap Carousel */}
        <div className="flex md:justify-center overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {displayProducts.map((product, index) => {
            const bgColor = PASTEL_COLORS[index % PASTEL_COLORS.length];
            return (
              <div 
                key={product.id} 
                className={`snap-start shrink-0 w-[260px] sm:w-[280px] h-[360px] rounded-2xl overflow-hidden relative flex flex-col p-6 shadow-lg transition-transform hover:-translate-y-2 ${bgColor} group`} 
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="bg-white/90 p-2 rounded-full hover:bg-white text-gray-800 transition-colors shadow-sm"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(product.id)}
                      className="bg-red-500/90 p-2 rounded-full hover:bg-red-500 text-white transition-colors shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                {/* Mitad Superior: Imagen Flotante */}
                <div className="flex-1 min-h-0 flex items-center justify-center relative mb-4 z-10">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain drop-shadow-2xl"
                    loading="lazy"
                  />
                </div>

                {/* Mitad Inferior: Textos y Precio */}
                <div className="relative z-10 flex justify-between items-end mt-auto">
                  <div>
                    <span className="font-montserrat text-white/80 text-sm block mb-1 uppercase">
                      {product.category}
                    </span>
                    <h3 className="font-montserrat font-bold text-xl text-white">
                      {product.name}
                    </h3>
                  </div>
                  
                  {/* Pastilla del Precio */}
                  <div className="bg-white rounded-full px-4 py-1.5 flex items-center justify-center shadow-sm">
                    <span className="font-montserrat font-bold text-sm text-gray-800">
                      $ {product.price}
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              </div>
            );
          })}
          
          {displayProducts.length === 0 && (
            <p className="text-gray-500 font-montserrat text-center w-full py-10">No hay favoritos disponibles</p>
          )}
        </div>
      </div>

      <ProductFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitForm}
        product={editingProduct}
        allProducts={products}
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="Eliminar Favorito"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={isDeleting}
      />
    </section>
  );
}