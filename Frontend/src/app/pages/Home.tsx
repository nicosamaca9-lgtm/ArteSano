import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { Revolution } from '../components/Revolution';
import { ProductCarousel } from '../components/ProductCarousel';
import { Testimonials } from '../components/Testimonials';
import { VideoShowcase } from '../components/VideoShowcase';
import { ProductSpecial } from '../components/ProductSpecial';
import { productService } from '../services/productService';

export function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await productService.getProducts();
      if (res.ok) {
        setProducts(res.products);
      }
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Hero />
      <ProductSpecial 
        title={
          <>
            Nuestros{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Favoritos</span>
              <span className="absolute bottom-1 left-0 w-full h-3 md:h-4 bg-[#FBBF24]/40 -rotate-1 rounded-sm" />
            </span>
          </>
        } 
        products={products}
        onRefresh={fetchProducts}
      />
      <Revolution />
      
      <div className="bg-stone-50 py-4">
        <ProductCarousel 
          title={
            <>
              Best{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Zumos</span>
                <span className="absolute bottom-1 left-0 w-full h-3 md:h-4 bg-green-300/50 -rotate-1 rounded-sm" />
              </span>{' '}
              in Town
            </>
          } 
          products={products} 
          onRefresh={fetchProducts}
        />
      </div>
      <VideoShowcase />
      <Testimonials />
    </>
  );
}
