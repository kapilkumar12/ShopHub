import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { productFilter as filterAPI } from "../services/product";
import ProductCard from "../components/ProductCard";
import { useSearch } from "../context/SearchContext";
import ProductsSkeleton from "../skeletons/ProductsSkeleton";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { setSearch } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();

  // filters
  const [filters, setFilters] = useState({
    category: "",
    price: 200000,
    sort: "",
    page: 1,
    search: "",
  });

  const query = new URLSearchParams(location.search);
  const urlSearch = query.get("search") || "";
  const urlCategory = query.get("category") || "";

  ////////////////////////////////////////////////////////////////
  // sync URL → state
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: urlCategory,
      search: urlSearch,
      page: 1,
    }));
  }, [urlSearch, urlCategory]);

  ////////////////////////////////////////////////////////////////
  // FETCH PRODUCTS (stable + clean)
  ////////////////////////////////////////////////////////////////
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await filterAPI({
        search: filters.search,
        category: filters.category,
        sort: filters.sort,
        minPrice: 0,
        maxPrice: filters.price,
        page: filters.page,
      });

      setProducts(res?.products ?? []);
      setCategories(res?.categories ?? []);

    } catch (err) {
      console.error("Product fetch failed:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  ////////////////////////////////////////////////////////////////
  // debounce fetch
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  ////////////////////////////////////////////////////////////////
  // handlers (clean reducer style)
  ////////////////////////////////////////////////////////////////
  const handleCategory = (cat) => {
    setSearch("");

    setFilters((prev) => ({
      ...prev,
      category: cat,
      search: "",
      page: 1,
    }));

    if (cat) {
      navigate(`/products?category=${encodeURIComponent(cat)}`);
    } else {
      navigate("/products");
    }
  };

  const handleSort = (value) => {
    setFilters((prev) => ({
      ...prev,
      sort: value,
      page: 1,
    }));
  };

  const handlePrice = (value) => {
    setFilters((prev) => ({
      ...prev,
      price: value,
      page: 1,
    }));
  };

  ////////////////////////////////////////////////////////////////
  // LOADING
  ////////////////////////////////////////////////////////////////
  if (loading) return <ProductsSkeleton />;

  ////////////////////////////////////////////////////////////////
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h2 className="font-bold text-lg">Filters</h2>

        {/* CATEGORY */}
        <div>
          <p className="font-medium">Category</p>

          <div className="space-y-1 text-sm mt-2">
            <label className="block">
              <input
                type="radio"
                checked={!filters.category}
                onChange={() => handleCategory("")}
              />
              {" "}All
            </label>

            {categories.map((cat, i) => (
              <label key={i} className="block">
                <input
                  type="radio"
                  checked={filters.category === cat}
                  onChange={() => handleCategory(cat)}
                />
                {" "}{cat}
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
            value={filters.price}
            onChange={(e) => handlePrice(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-sm">Up to ₹{filters.price}</p>
        </div>

        {/* SORT */}
        <div>
          <p className="font-medium">Sort By</p>
          <select
            value={filters.sort}
            onChange={(e) => handleSort(e.target.value)}
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
        <h2 className="text-2xl font-bold mb-4">
          {filters.search
            ? `Search: "${filters.search}"`
            : filters.category
              ? `${filters.category} Products`
              : "All Products"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {products.length > 0 ? (
            products.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))
          ) : (
            <p className="text-gray-500">No products found 😔</p>
          )}

        </div>
      </div>

    </div>
  );
}