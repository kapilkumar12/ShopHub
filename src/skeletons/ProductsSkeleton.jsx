import React from 'react'

const ProductsSkeleton = () => {
  return ( 
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">

      {/* ================= FILTER SIDEBAR ================= */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">

        <div className="h-5 w-24 bg-gray-300 rounded"></div>

        {/* Category */}
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-300 rounded"></div>

          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-28 bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
          <div className="h-2 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-8 w-full bg-gray-200 rounded"></div>
        </div>

      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="md:col-span-3">

        {/* Title */}
        <div className="h-6 w-60 bg-gray-300 rounded mb-4"></div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-3 rounded-xl shadow">
              <div className="h-48 bg-gray-300 rounded mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            </div>
          ))}

        </div>
      </div>

    </div>
    )
}

export default ProductsSkeleton