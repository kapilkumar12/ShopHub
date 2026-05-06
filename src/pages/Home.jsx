import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import API from "../services/api";
import { useEffect,useState } from "react";
import { getProducts, getTrendingProducts } from "../services/product"
import ProductCartSkeleton from "../skeletons/ProductCartSkeleton";

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
              <ProductCartSkeleton />
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
              <ProductCartSkeleton />
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