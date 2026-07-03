import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pencil, Trash2, Plus, ShoppingCart, Leaf, ShieldCheck, Truck, Heart, Menu as MenuIcon, X, ChevronRight } from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmModal } from './ConfirmModal';

export type CategoryUI = 'Todas' | 'Jugos de temporada' | 'Antojos' | 'Para la comida';

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

const ProductCard = ({ product, isAdmin, onEdit, onDelete, onAddToCart }: { product: FilterProduct, isAdmin: boolean, onEdit: (p: any) => void, onDelete: (id: string) => void, onAddToCart: (p: FilterProduct) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongDescription = product.description && product.description.length > 90;

  return (
    <div 
      className="bg-white rounded-[26px] p-6 flex flex-col relative group transition-all duration-300 hover:-translate-y-1.5"
      style={{ 
        border: '1px solid #F1EFEA',
        boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.05)'}
    >
      {/* Botones de Admin */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(product)}
            className="bg-white p-2 rounded-full hover:bg-gray-100 text-[#1F1F1F] transition-colors shadow-sm border border-gray-200"
          >
            <Pencil size={16} />
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            className="bg-white p-2 rounded-full hover:bg-red-50 text-[#EF735F] transition-colors shadow-sm border border-gray-200"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* Imagen */}
      <div className="w-full aspect-square rounded-[24px] bg-[#FCFBF8] mb-5 overflow-hidden flex items-center justify-center p-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      {/* Textos y Precio */}
      <div className="flex flex-col flex-1">
        <h4 className="font-poppins font-semibold text-xl text-[#1F1F1F] mb-2 leading-tight">
          {product.name}
        </h4>
        
        <div className="mb-5 flex flex-col items-start">
          <p className={`font-inter text-sm text-[#7B7B7B] leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {product.description}
          </p>
          {isLongDescription && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#9CB88A] hover:text-[#6E8B65] text-xs font-poppins font-medium mt-1 focus:outline-none"
            >
              {isExpanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="font-poppins font-bold text-2xl text-[#EF735F]">
            ${product.price.toLocaleString('es-CO')}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-[#9CB88A] hover:bg-[#6E8B65] text-white p-3 md:px-5 rounded-full flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart size={20} />
            <span className="hidden md:inline font-poppins font-medium text-sm">Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export function ProductFilter({ products, onRefresh }: ProductFilterProps) {
  const { isAdmin, user, openAuthModal } = useAuth();
  const { addToCart } = useCart();
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryUI>('Todas');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories: CategoryUI[] = ['Todas', 'Jugos de temporada', 'Antojos', 'Para la comida'];

  const getBackendCategory = (uiCat: CategoryUI) => {
    if (uiCat === 'Jugos de temporada') return 'jugos y smoothies';
    if (uiCat === 'Antojos') return 'antojos';
    if (uiCat === 'Para la comida') return 'comida';
    return '';
  };

  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'Todas') return true;
    return p.category === getBackendCategory(selectedCategory);
  });

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

  const handleAddToCart = (product: FilterProduct) => {
    if (!user) {
      openAuthModal();
      return;
    }
    addToCart(product);
  };

  // Prevenir scroll cuando la sidebar móvil está abierta
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isSidebarOpen]);

  const SidebarContent = () => (
    <div className="flex flex-col gap-10">
      {/* Categorías */}
      <div>
        <h3 className="font-poppins font-semibold text-[#1F1F1F] text-xl mb-4">Categorías</h3>
        <ul className="flex flex-col gap-2">
          {categories.map(cat => (
            <li key={cat}>
              <button
                onClick={() => { setSelectedCategory(cat); setIsSidebarOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-2xl font-poppins transition-colors flex items-center justify-between ${
                  selectedCategory === cat 
                    ? 'bg-[#9CB88A]/10 text-[#6E8B65] font-semibold' 
                    : 'text-[#7B7B7B] hover:bg-gray-50'
                }`}
              >
                {cat}
                {selectedCategory === cat && <ChevronRight size={18} className="text-[#9CB88A]" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Beneficios */}
      <div>
        <h3 className="font-poppins font-semibold text-[#1F1F1F] text-xl mb-4">¿Por qué ArteSano?</h3>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#9CB88A]/10 flex items-center justify-center shrink-0">
              <Leaf size={24} className="text-[#6E8B65]" />
            </div>
            <div>
              <h4 className="font-poppins font-semibold text-[#1F1F1F] text-sm mb-1">Ingredientes naturales</h4>
              <p className="font-inter text-[#7B7B7B] text-xs leading-relaxed">Seleccionados con cuidado</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F6C9C7]/20 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} className="text-[#EF735F]" />
            </div>
            <div>
              <h4 className="font-poppins font-semibold text-[#1F1F1F] text-sm mb-1">Pago seguro</h4>
              <p className="font-inter text-[#7B7B7B] text-xs leading-relaxed">Tus compras están protegidas</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#9CB88A]/10 flex items-center justify-center shrink-0">
              <Truck size={24} className="text-[#6E8B65]" />
            </div>
            <div>
              <h4 className="font-poppins font-semibold text-[#1F1F1F] text-sm mb-1">Envíos rápidos</h4>
              <p className="font-inter text-[#7B7B7B] text-xs leading-relaxed">Llegamos a donde estés</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F6C9C7]/20 flex items-center justify-center shrink-0">
              <Heart size={24} className="text-[#EF735F]" />
            </div>
            <div>
              <h4 className="font-poppins font-semibold text-[#1F1F1F] text-sm mb-1">Satisfacción garantizada</h4>
              <p className="font-inter text-[#7B7B7B] text-xs leading-relaxed">Si no te gusta, te devolvemos tu dinero</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-[#FCFBF8] min-h-screen pt-12 pb-24" id="menu">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-12 relative">
        
        {/* Encabezado Mobile (Visible solo en pantallas pequeñas) */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <div>
            <h1 className="font-poppins font-semibold text-3xl text-[#1F1F1F]">Nuestros Productos</h1>
            <p className="font-inter text-[#7B7B7B] mt-1 text-sm">Alimentos seleccionados para una vida más saludable.</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-[#F1EFEA] hover:bg-[#E5E3DD] text-[#1F1F1F] px-4 py-2 rounded-full font-poppins text-sm transition-colors"
          >
            <span>Ver todas</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-72 shrink-0 pt-6">
          <SidebarContent />
        </aside>

        {/* Sidebar Mobile (Offcanvas) */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Panel */}
            <div className="relative flex w-4/5 max-w-sm flex-col bg-[#FCFBF8] h-full overflow-y-auto shadow-2xl p-6 transform transition-transform">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
              <div className="mt-8">
                <SidebarContent />
              </div>
            </div>
          </div>
        )}

        {/* Contenido Principal (Grid de Productos) */}
        <main className="flex-1 w-full">
          
          {/* Encabezado Desktop */}
          <div className="hidden lg:flex items-center justify-between mb-10 pt-6">
            <div>
              <h1 className="font-poppins font-semibold text-4xl text-[#1F1F1F]">Nuestros Productos</h1>
              <p className="font-inter text-[#7B7B7B] mt-2 text-lg">Alimentos seleccionados para una vida más saludable.</p>
            </div>
            {isAdmin && (
              <button 
                onClick={handleCreate}
                className="bg-[#9CB88A] hover:bg-[#6E8B65] text-white px-6 py-3 rounded-full font-poppins font-semibold transition-colors shadow-sm flex items-center gap-2"
              >
                <Plus size={20} />
                Nuevo Producto
              </button>
            )}
          </div>

          {/* Botón Admin Mobile */}
          {isAdmin && (
            <div className="lg:hidden mb-8">
              <button 
                onClick={handleCreate}
                className="w-full bg-[#9CB88A] hover:bg-[#6E8B65] text-white px-6 py-3 rounded-full font-poppins font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Nuevo Producto
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-poppins text-[#7B7B7B] text-lg">No hay productos en esta categoría.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </main>
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
