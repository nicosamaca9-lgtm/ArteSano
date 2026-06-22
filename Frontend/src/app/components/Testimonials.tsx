import React, { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { commentService } from '../services/commentService';
import { CommentFormModal } from './CommentFormModal';
import { ConfirmModal } from './ConfirmModal';

export function Testimonials() {
  const { user, isAdmin } = useAuth();
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

  return (
    <section className="bg-[#FDFBF7] py-20 px-4 md:px-8" id="testimonios">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Encabezado */}
        <h2 className="text-gray-900 font-caveat font-bold text-5xl md:text-6xl text-center mb-4 leading-tight">
          Lo que dicen nuestros{' '}
          <span className="relative inline-block">
            <span className="relative z-10">clientes</span>
            <span className="absolute bottom-1 left-0 w-full h-3 md:h-4 bg-green-300/50 -rotate-1 rounded-sm" />
          </span>
        </h2>
        <p className="text-gray-500 font-montserrat text-center mb-12 max-w-xl text-lg">
          Valoraciones que nos inspiran a seguir mejorando
        </p>

        {/* Cuadrícula de Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
          {comments.map((t) => (
            <div 
              key={t.id} 
              className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between h-full border border-gray-50 relative group"
            >
              {isAdmin && (
                <button 
                  onClick={() => handleDeleteClick(t.id)}
                  className="absolute top-4 right-4 bg-red-500/90 p-2 rounded-full hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  title="Eliminar comentario"
                >
                  <Trash2 size={16} />
                </button>
              )}
              
              <div>
                {/* Estrellas */}
                <div className="flex gap-1 mb-6 text-[#FBBF24]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < t.rating ? "currentColor" : "none"} 
                      strokeWidth={i < t.rating ? 0 : 2} 
                      className={i < t.rating ? "text-[#FBBF24]" : "text-gray-300"}
                    />
                  ))}
                </div>
                {/* Texto */}
                <p className="text-gray-600 font-montserrat italic mb-8 leading-relaxed">
                  "{t.content}"
                </p>
              </div>
              {/* Nombre */}
              <p className="text-[#064E3B] font-montserrat font-bold text-lg">
                {t.name}
              </p>
            </div>
          ))}
          
          {comments.length === 0 && (
            <p className="text-gray-500 font-montserrat col-span-full text-center">Sé el primero en dejar un comentario.</p>
          )}
        </div>

        {/* Botón Secundario */}
        <button 
          onClick={() => {
            setIsFormOpen(true);
          }}
          className="border-2 border-[#064E3B] text-[#064E3B] hover:bg-[#064E3B] hover:text-white font-montserrat font-bold text-base md:text-lg px-8 py-3 rounded-full transition-colors shadow-sm"
        >
          Agregar un comentario
        </button>
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
