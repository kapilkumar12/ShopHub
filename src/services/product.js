// services/product.js

import API from "./api";

// fetch all products
export const getProducts = async (params) => {
  const res = await API.get("/products", { params });
  return res.data;
};

// product details
export const productDetails = async (id) => {
  const res = await API.get(`/products/get-single-product/${id}`);
  return res.data.product;
};

// trending products

export const getTrendingProducts = async (params) => {
  const res = await API.get("/products/trending", { params });
  return res.data;
};

// related products

export const getRelatedProducts = async (productId) => {
  const res = await API.get(`/products/related/${productId}`);
  return res.data;
};

// ✅ PRODUCT FILTER (FIXED)
export const productFilter = async ({
  search = "",
  category = "",
  sort = "",
  minPrice,
  maxPrice,
  page = 1,
  limit = 10,
}) => {
  const params = {
    search,
    category,
    sort,
    page,
    limit,
    ...(minPrice !== undefined && { minPrice }),
    ...(maxPrice !== undefined && { maxPrice }),
  };

  const res = await API.get("/admin/products/filter", { params });

  return res.data;
};
