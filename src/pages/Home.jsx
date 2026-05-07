import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import API from "../services/api";
import { useEffect,useState } from "react";
import { getProducts,getTrendingProducts } from "../services/product"
import { getSliders } from "../services/slider";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";
import HeroSkeleton from "../skeletons/HeroSkeleton";

export default function Home() {

  const [products,setProducts] = useState([]);
  const [trendingProducts,setTrendingProducts] = useState([]);

  const [slides,setSlides] = useState([]);
  const [loading,setLoading] = useState(true);
  const [heroLoading,setHeroLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  },[]);

  const fetchAllData = async () => {
    try {

      setLoading(true);
      setHeroLoading(true);

      const [
        productsRes,
        trendingRes,
        slidersRes
      ] = await Promise.all([
        getProducts(),
        getTrendingProducts({
          limit: 5,
        }),
        getSliders(),
      ]);

      setProducts(productsRes?.products || []);
      setTrendingProducts(trendingRes?.products || []);
      setSlides(slidersRes?.sliders || []);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
      setHeroLoading(false);
    }
  };

  return (
    <>

      <div className="p-6 space-y-8">
        {heroLoading ? (
          <HeroSkeleton />
        ) : (
          <HeroSlider slides={slides} />
        )}

        <div>
          {loading ? (
            <div className="animate-pulse mb-4">
              <div className="h-8 w-52 bg-gray-300 rounded"></div>
            </div>
          ) : (
            <h2 className="text-2xl font-bold mb-4">
              🔥 Trending Products
            </h2>
          )}

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
          {loading ? (
            <div className="animate-pulse mb-4">
              <div className="h-8 w-52 bg-gray-300 rounded"></div>
            </div>
          ) : (
            <h2 className="text-2xl font-bold mb-4">
              🔥 All Products
            </h2>
          )}

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
