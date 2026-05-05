import { useEffect,useState,useCallback } from "react";
import { productFilter as filterAPI } from "../services/product";
import ProductCard from "../components/ProductCard";
import { useSearch } from "../context/SearchContext";

export default function Products() {
  const [products,setProducts] = useState([]);
  const [categories,setCategories] = useState([]);
  const [loading,setLoading] = useState(true);

  // filters
  const { search } = useSearch();
  const [category,setCategory] = useState("");
  const [priceRange,setPriceRange] = useState(200000);
  const [sort,setSort] = useState("");
  const [page,setPage] = useState(1);

  ////////////////////////////////////////////////////////////////
  // 🔥 FETCH (ONLY ONE API)
  ////////////////////////////////////////////////////////////////
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const data = await filterAPI({
        search,
        category,
        sort,
        minPrice: 0,
        maxPrice: priceRange,
        page,
      });

      // ✅ directly use API response
      setProducts(data?.products || []);
      setCategories(data?.categories || []);

    } catch (error) {
      console.error("Filter failed:",error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  },[search,category,priceRange,page,sort]);

  ////////////////////////////////////////////////////////////////
  // AUTO FETCH
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    const delay = setTimeout(fetchProducts,400);
    return () => clearTimeout(delay);
  },[fetchProducts]);

  ////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h2 className="font-bold text-lg">Filters</h2>

        {/* CATEGORY */}
        <div>
          <p className="font-medium">Category</p>
          <div className="space-y-1 text-sm">

            <p>
              <input
                type="radio"
                checked={category === ""}
                onChange={() => setCategory("")}
              /> All
            </p>

            {categories.map((cat,i) => (
              <label key={i}>
                <input
                  type="radio"
                  value={cat}
                  checked={category === cat}
                  onChange={(e) => setCategory(e.target.value)}
                /> {cat}
              </label>
            ))}

          </div>
        </div>

        {/* PRICE */}
        <div>
          <p className="font-medium">Price</p>
          <input
            type="range"
            min="0"
            max="200000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-sm">Up to ₹{priceRange}</p>
        </div>
        <div>
          <p className="font-medium">Sort By</p>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="latest">Latest</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="md:col-span-3">
        <h2 className="text-2xl font-bold mb-4">All Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {loading ? (
            <SkeletonCards />
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
  );
}

//////////////////////////////////////////////////////////////
// SKELETON
//////////////////////////////////////////////////////////////

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