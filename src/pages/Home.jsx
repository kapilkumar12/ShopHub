import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import API from "../services/api";
import { useEffect,useState } from "react";
import { getProducts, getTrendingProducts } from "../services/product"
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";

export default function Home() {

  const [products,setProducts] = useState([]);
  const [trendingProducts,setTrendingProducts] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
    fetchTrendingProducts()
  },[]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


    const fetchTrendingProducts = async () => {
    try {
      setLoading(true);
      const res = await getTrendingProducts();
      setTrendingProducts(res.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className="p-6 space-y-8">
        <Hero />

        <div>
          <h2 className="text-2xl font-bold mb-4">🔥 Trending Products</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {loading ? (
              <ProductCardSkeleton count={5} />
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))
            ) : (
              <p>No products found 😔</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">🔥 All Products</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {loading ? (
              <ProductCardSkeleton count={5} />
            ) : products.length > 0 ? (
              products.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))
            ) : (
              <p>No products found 😔</p>
            )}
          </div>
        </div>

      </div>
    </>
  );
}


function SkeletonCards() {
  return Array(6)
    .fill(0)
    .map((_,i) => (
      <div key={i} className="bg-white p-3 rounded-xl shadow animate-pulse">
        <div className="h-48 bg-gray-300 rounded mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      </div>
    ));
}