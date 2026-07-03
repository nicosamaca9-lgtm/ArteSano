import React, { useState, useEffect } from 'react';
import { Star, Trash2, MessageCircle, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { commentService } from '../services/commentService';
import { CommentFormModal } from './CommentFormModal';
import { ConfirmModal } from './ConfirmModal';

export function Testimonials() {
  const { isAdmin } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await commentService.getComments();
      if (res.ok) {
        setComments(res.comments);
      }
    } catch (error) {
      console.error("Error al cargar comentarios", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleCreateComment = async (data: any) => {
    await commentService.createComment(data);
    fetchComments();
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await commentService.deleteComment(deletingId);
      fetchComments();
    } catch (error) {
      console.error("Error al eliminar", error);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setDeletingId(null);
    }
  };

  // Limit to 3 comments for the horizontal layout
  const displayComments = comments.slice(0, 3);

  return (
    <section className="bg-[#FCFBF8] py-24 px-4 md:px-8 relative overflow-hidden" id="testimonios">
      {/* Elementos Orgánicos Decorativos (Hojas flotantes) */}
      <Leaf className="absolute top-12 left-10 text-[#7FA87A] opacity-20 rotate-45 w-12 h-12 pointer-events-none" />
      <Leaf className="absolute bottom-20 left-20 text-[#7FA87A] opacity-30 -rotate-12 w-16 h-16 pointer-events-none" />
      <Leaf className="absolute top-32 right-12 text-[#7FA87A] opacity-20 rotate-90 w-10 h-10 pointer-events-none" />
      <Leaf className="absolute bottom-12 right-24 text-[#7FA87A] opacity-25 -rotate-45 w-14 h-14 pointer-events-none" />
      
      <div className="max-w-[1360px] mx-auto flex flex-col items-center relative z-10">
        
        {/* Encabezado Premium */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="flex items-center gap-4">
            <Leaf size={28} className="text-[#7FA87A]" />
            <div className="relative">
              <h2 className="text-[#1F2530] font-caveat font-bold text-[52px] md:text-[56px] text-center leading-tight relative z-10">
                Lo que dicen nuestros{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">clientes</span>
                  <span className="absolute bottom-2 left-0 w-full h-[14px] bg-[#F3E2A7] -rotate-1 rounded-sm -z-0" />
                </span>
              </h2>
            </div>
            <Leaf size={28} className="text-[#7FA87A] scale-x-[-1]" />
          </div>
        </div>
        
        {/* Subtítulo */}
        <p className="text-[#6F6F6F] font-poppins text-[16px] text-center mb-16">
          Valoraciones que nos inspiran a seguir mejorando
        </p>

        {/* Layout: Tarjetas y Botón */}
        <div className="flex flex-col xl:flex-row items-center justify-center gap-8 w-full">
          
          {/* Tarjetas de Testimonios */}
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 w-full xl:w-auto overflow-x-auto pb-4 px-4 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {displayComments.map((t) => (
              <div 
                key={t.id} 
                className="bg-[#FFFFFF] rounded-[24px] p-[28px] md:p-[32px] flex flex-col relative group border border-[#ECE8E2] w-[320px] md:w-[360px] flex-shrink-0 min-h-[180px] transition-transform duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
              >
                {isAdmin && (
                  <button 
                    onClick={() => handleDeleteClick(t.id)}
                    className="absolute top-4 right-4 bg-red-500/90 p-2 rounded-full hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all shadow-sm z-20"
                    title="Eliminar comentario"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                
                {/* Comillas Decorativas */}
                <span className="absolute top-4 left-6 font-serif text-[80px] text-[#D8EFD8] leading-none opacity-50 pointer-events-none select-none">
                  “
                </span>

                <div className="relative z-10 flex flex-col h-full ml-10 md:ml-12 mt-2">
                  {/* Estrellas */}
                  <div className="flex gap-1 mb-4 text-[#F7B731]">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < t.rating ? "currentColor" : "none"} 
                        strokeWidth={i < t.rating ? 0 : 2} 
                        className={i < t.rating ? "text-[#F7B731]" : "text-gray-200"}
                      />
                    ))}
                  </div>
                  
                  {/* Texto */}
                  <p className="text-[#4B5563] font-poppins text-[15px] md:text-[16px] mb-6 leading-relaxed flex-grow italic">
                    "{t.content}"
                  </p>
                  
                  {/* Cliente (Sin imagen según instrucciones) */}
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-[36px] h-[36px] rounded-full bg-[#F5F3ED] flex items-center justify-center overflow-hidden border border-[#ECE8E2]">
                       <span className="font-poppins font-bold text-[#6F6F6F] text-[14px]">
                         {t.name ? t.name.charAt(0).toUpperCase() : 'U'}
                       </span>
                    </div>
                    <p className="text-[#2C8A58] font-poppins font-semibold text-[15px] md:text-[16px]">
                      {t.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {displayComments.length === 0 && (
              <p className="text-[#6F6F6F] font-poppins text-center w-full py-10">Sé el primero en dejar un comentario.</p>
            )}
          </div>

          {/* Botón Agregar Comentario (Derecha) */}
          <div className="mt-6 xl:mt-0 xl:ml-4 flex-shrink-0">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="group flex items-center gap-3 bg-white border-2 border-[#2C8A58] text-[#2C8A58] hover:bg-[#2C8A58] hover:text-white font-poppins font-medium text-[15px] md:text-[16px] px-8 py-3.5 rounded-[999px] transition-colors shadow-[0_4px_14px_rgba(0,0,0,0.06)]"
            >
              Agregar un comentario
              <MessageCircle size={20} className="text-[#2C8A58] group-hover:text-white transition-colors" />
            </button>
          </div>

        </div>
      </div>

      <CommentFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleCreateComment} 
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="Eliminar Comentario"
        message="¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={isDeleting}
      />
    </section>
  );
}
