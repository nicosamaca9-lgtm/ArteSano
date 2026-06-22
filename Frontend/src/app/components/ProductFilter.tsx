import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { productService } from '../services/productService';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmModal } from './ConfirmModal';

export type CategoryUI = 'Jugos de temporada' | 'Antojos' | 'Para la comida';

export interface FilterProduct {
  id: string;
  category: string;
  name: string;
  description: string;
  image: string;
  price: number;
}

interface ProductFilterProps {
  products: FilterProduct[];
  onRefresh: () => void;
}

const renderCategoryTitle = (cat: CategoryUI) => {
  switch (cat) {
    case 'Jugos de temporada':
      return (
        <>
          Jugos de{' '}
          <span className="relative inline-block">
            <span className="relative z-10">temporada</span>
            <span className="absolute bottom-1 left-0 w-full h-2 md:h-3 bg-[#FF8A80] -rotate-2 rounded-sm" />
          </span>
        </>
      );
    case 'Antojos':
      return (
        <span className="relative inline-block">
          <span className="relative z-10">Antojos</span>
          <span className="absolute bottom-1 left-0 w-full h-2 md:h-3 bg-[#FF8A80] -rotate-2 rounded-sm" />
        </span>
      );
    case 'Para la comida':
      return (
        <>
          Para la{' '}
          <span className="relative inline-block">
            <span className="relative z-10">comida</span>
            <span className="absolute bottom-1 left-0 w-full h-2 md:h-3 bg-[#FF8A80] -rotate-2 rounded-sm" />
          </span>
        </>
      );
    default:
      return cat;
  }
};

export function ProductFilter({ products, onRefresh }: ProductFilterProps) {
  const { isAdmin } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories: CategoryUI[] = ['Jugos de temporada', 'Antojos', 'Para la comida'];

  const getBackendCategory = (uiCat: CategoryUI) => {
    if (uiCat === 'Jugos de temporada') return 'jugos y smoothies';
    if (uiCat === 'Antojos') return 'antojos';
    if (uiCat === 'Para la comida') return 'comida';
    return '';
  };

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
    <section className="bg-white" id="menu">
      
      {/* Franja "MENU" */}
      <div className="w-full bg-[#5c778c] py-16 md:py-20 mb-24 flex justify-center items-center shadow-inner relative">
        <h1 className="text-white font-montserrat font-extrabold text-5xl md:text-7xl tracking-[0.2em]">
          MENU
        </h1>
        {isAdmin && (
          <button 
            onClick={handleCreate}
            className="absolute right-8 md:right-16 z-20 bg-white text-[#5c778c] p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            title="Crear nuevo producto"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center px-4 md:px-8 pb-20 md:pb-28">

        {categories.map(cat => {
          const backendCat = getBackendCategory(cat);
          const categoryProducts = products.filter(p => p.category === backendCat);
          if (categoryProducts.length === 0) return null;

          return (
            <div key={cat} className="w-full mb-24">
              {/* Categoría Título */}
              <h3 className="font-caveat font-bold text-5xl md:text-6xl text-[#1E293B] text-center mb-6 tracking-tight">
                {renderCategoryTitle(cat)}
              </h3>
              
              {/* Separador */}
              <hr className="border-t border-gray-900 w-full mb-12" />

              {/* Grid de productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 w-full">
                {categoryProducts.map(product => (
                  <div key={product.id} className="flex flex-col items-center text-center group relative">
                    {isAdmin && (
                      <div className="absolute top-2 right-2 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="bg-white/90 p-2 rounded-full hover:bg-white text-gray-800 transition-colors shadow-md border border-gray-200"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(product.id)}
                          className="bg-red-500/90 p-2 rounded-full hover:bg-red-500 text-white transition-colors shadow-md border border-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}

                    {/* Contenedor de la imagen */}
                    <div className="w-full aspect-[4/5] bg-[#F8F8F8] flex items-center justify-center mb-6 overflow-hidden transition-colors group-hover:bg-[#F0F0F0] rounded-xl">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Textos */}
                    <h4 className="font-montserrat font-bold text-lg md:text-xl text-gray-900 mb-2 uppercase tracking-widest">
                      {product.name}
                    </h4>
                    <p className="font-montserrat text-sm text-gray-500 px-4 mb-2">
                      {product.description}
                    </p>
                    <p className="font-montserrat font-bold text-[#064E3B]">
                      $ {product.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <p className="text-gray-400 font-montserrat mt-8">Próximamente más opciones en el menú.</p>
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
