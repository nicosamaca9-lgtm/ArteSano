import React, { useState } from 'react';
import { ChevronRight, Pencil, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmModal } from './ConfirmModal';

interface ProductCarouselProps {
  title: React.ReactNode;
  products: any[];
  onRefresh: () => void;
}

export function ProductCarousel({ title, products, onRefresh }: ProductCarouselProps) {
  const { isAdmin } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtrar solo los productos marcados para el carrusel
  const carouselProducts = products.filter(p => p.isCarousel).slice(0, 7);
  // Multiplicamos para asegurar que el carrusel siempre fluya bien
  const displayProducts = [...carouselProducts, ...carouselProducts, ...carouselProducts];

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
    <section className="py-16 bg-stone-50 overflow-hidden relative" id="menu">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        {isAdmin && (
          <button 
            onClick={handleCreate}
            className="absolute top-0 right-4 md:right-8 z-20 bg-[#064E3B] text-white p-3 rounded-full hover:bg-[#064E3B]/90 transition-colors shadow-lg"
            title="Crear nuevo producto"
          >
            <Plus size={24} />
          </button>
        )}

        <h2 className="text-gray-900 font-caveat font-bold text-5xl md:text-6xl text-center tracking-tight mb-12 leading-tight">
          {title}
        </h2>
      </div>
      
      <div className="relative w-full overflow-hidden pb-8">
        {carouselProducts.length === 0 ? (
          <p className="text-center text-gray-500 font-montserrat">No hay productos para mostrar en el carrusel</p>
        ) : (
          <div className="animate-marquee">
            {/* Primer grupo */}
            <div className="flex gap-6 pr-6">
              {displayProducts.map((product, idx) => (
                <div 
                  key={`${product.id}-1-${idx}`} 
                  className="group shrink-0 w-[280px] sm:w-[320px] bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col transition-transform hover:-translate-y-1 cursor-pointer relative"
                >
                  {isAdmin && (
                    <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                        className="bg-white/90 p-2 rounded-full hover:bg-white text-gray-800 transition-colors shadow-sm"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(product.id); }}
                        className="bg-red-500/90 p-2 rounded-full hover:bg-red-500 text-white transition-colors shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}

                  {/* Top Half: Image */}
                  <div className="h-[220px] sm:h-[240px] bg-gray-50 p-4 flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Bottom Half: Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-montserrat font-bold text-xl text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="font-montserrat text-sm text-gray-500 mb-6 flex-grow line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Footer of card */}
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                      <span className="font-montserrat font-bold text-lg text-[#064E3B]">
                        $ {product.price}
                      </span>
                      <button className="bg-[#064E3B] hover:bg-[#064E3B]/90 text-white font-montserrat text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1 transition-colors">
                        Pedir <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={isDeleting}
      />
    </section>
  );
}
