import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Pencil, Trash2, Plus, Heart, Leaf } from 'lucide-react';
import { productService } from '../services/productService';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmModal } from './ConfirmModal';

interface ProductSpecialProps {
  title?: React.ReactNode;
  products: any[];
  onRefresh: () => void;
}

const GRADIENTS = [
  'bg-gradient-to-br from-[#FFE9EC] to-[#FFD6DC]', // Rosa
  'bg-gradient-to-br from-[#FFF6D8] to-[#FFE9A7]', // Amarillo
  'bg-gradient-to-br from-[#FFE5E5] to-[#FFC9C9]', // Coral
  'bg-gradient-to-br from-[#EEE8FF] to-[#DDD3FF]', // Lavanda
];

export function ProductSpecial({ products, onRefresh }: ProductSpecialProps) {
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Limitar a 4 productos
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
    <section className="py-20 px-4 md:px-8 bg-[#FFFDF8] overflow-hidden relative" id="favoritos">
      <div className="max-w-[1360px] mx-auto relative">
        {isAdmin && (
          <button 
            onClick={handleCreate}
            className="absolute top-0 right-0 z-20 bg-[#9CB88A] text-white p-3 rounded-full hover:bg-[#6E8B65] transition-colors shadow-lg"
            title="Crear nuevo producto"
          >
            <Plus size={24} />
          </button>
        )}

        {/* Título Premium */}
        <div className="flex flex-col items-center justify-center mb-16 relative">
          <div className="flex items-center gap-4">
            <Leaf size={32} className="text-[#78A86B]" />
            <div className="relative inline-block">
              <h2 className="font-caveat text-[54px] text-[#1D2433] leading-none z-10 relative">
                Nuestros Favoritos
              </h2>
              <span className="absolute bottom-2 left-0 w-full h-[14px] bg-[#F3E2A7] -rotate-1 rounded-sm -z-0" />
            </div>
            <Leaf size={32} className="text-[#78A86B] scale-x-[-1]" />
          </div>
        </div>
        
        {/* Grid de 4 tarjetas horizontales */}
        <div className="flex overflow-x-auto xl:grid xl:grid-cols-4 gap-[28px] pb-8 px-4 md:px-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {displayProducts.map((product, index) => {
            const bgGradient = GRADIENTS[index % GRADIENTS.length];
            return (
              <div 
                key={product.id} 
                className={`snap-start shrink-0 w-[310px] h-[260px] rounded-[24px] p-[24px] flex flex-row items-center relative transition-all duration-300 hover:-translate-y-[8px] group ${bgGradient}`} 
                style={{ boxShadow: '0 10px 35px rgba(0,0,0,0.08)' }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 15px 45px rgba(0,0,0,0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 35px rgba(0,0,0,0.08)'}
              >
                {isAdmin && (
                  <div className="absolute top-2 left-2 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="bg-white/90 p-2 rounded-full hover:bg-white text-gray-800 transition-colors shadow-sm"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(product.id)}
                      className="bg-red-500/90 p-2 rounded-full hover:bg-red-500 text-white transition-colors shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

                {/* Botón Favorito (Top Right) */}
                <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-[0_4px_12px_rgba(0,0,0,0.05)] z-20 transition-transform duration-300 group-hover:scale-110">
                  <Heart size={20} className="text-[#FF9FAE]" fill="#FF9FAE" />
                </button>

                {/* Textos y Precio (Mitad Izquierda) */}
                <div className="flex flex-col justify-between h-full w-[50%] z-10 relative">
                  <div>
                    <span className="font-poppins font-medium text-[12px] md:text-[13px] text-[#707070] uppercase tracking-wide block mb-1 leading-tight">
                      {product.category}
                    </span>
                    <h3 className="font-poppins font-bold text-[20px] md:text-[22px] text-[#1F2530] leading-tight mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="font-inter text-[13px] md:text-[14px] text-[#707070] line-clamp-2 leading-snug">
                      {product.description}
                    </p>
                  </div>
                  
                  {/* Cápsula de Precio */}
                  <div className="mt-auto">
                    <button 
                      onClick={() => addToCart({ id: product.id, name: product.name, category: product.category, price: product.price, image: product.image, description: product.description || '' })}
                      className="bg-white rounded-full px-5 py-2 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:scale-[1.04]"
                    >
                      <span className="font-poppins font-bold text-[18px] md:text-[20px] text-[#2C8A58]">
                        $ {product.price}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Imagen (Mitad Derecha - 60%) */}
                <div className="absolute right-[-5%] bottom-0 h-full w-[65%] flex items-end justify-center pb-4 pointer-events-none z-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-[90%] h-[90%] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
          
          {displayProducts.length === 0 && (
            <p className="text-[#707070] font-poppins text-center w-full py-10">No hay favoritos disponibles.</p>
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