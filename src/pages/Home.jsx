import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import {
  getProducts,
  getTrendingProducts,
} from "../services/product";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";

export default function Home() {

  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  ////////////////////////////////////////////////////////////////
  // FETCH ALL PRODUCTS
  ////////////////////////////////////////////////////////////////
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      const res = await getProducts();

      const data =
        res?.products ||
        res?.data?.products ||
        [];

      setProducts(data);

    } catch (error) {
      console.error("Products fetch error:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  // FETCH TRENDING
  ////////////////////////////////////////////////////////////////
  const fetchTrendingProducts = async () => {
    try {
      setLoadingTrending(true);

      const res = await getTrendingProducts();

      const data =
        res?.products ||
        res?.data?.products ||
        [];

      setTrendingProducts(data);

    } catch (error) {
      console.error("Trending fetch error:", error);
    } finally {
      setLoadingTrending(false);
    }
  };

  ////////////////////////////////////////////////////////////////
  // INIT
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    fetchProducts();
    fetchTrendingProducts();
  }, []);

  ////////////////////////////////////////////////////////////////
  // REUSABLE GRID
  ////////////////////////////////////////////////////////////////
  const renderGrid = (loading, data) => {
    if (loading) {
      return <ProductCardSkeleton count={10} />;
    }

    if (!data || data.length === 0) {
      return (
        <p className="text-gray-500 col-span-full text-center">
          No products found 😔
        </p>
      );
    }

    return data.map((item) => (
      <ProductCard key={item._id} product={item} />
    ));
  };

  ////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-6 space-y-10">

      {/* HERO */}
      <Hero />

      {/* 🔥 TRENDING */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          🔥 Trending Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {renderGrid(loadingTrending, trendingProducts)}
        </div>
      </section>

      {/* 📦 ALL PRODUCTS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          📦 All Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {renderGrid(loadingProducts, products)}
        </div>
      </section>

    </div>
  );
}