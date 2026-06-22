import React, { useEffect, useState } from 'react';
import { ProductFilter } from '../components/ProductFilter';
import { productService } from '../services/productService';

export function Menu() {
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
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-white">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="font-montserrat text-gray-500">Cargando menú...</p>
        </div>
      ) : (
        <ProductFilter products={products} onRefresh={fetchProducts} />
      )}
    </div>
  );
}
