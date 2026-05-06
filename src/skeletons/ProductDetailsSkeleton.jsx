import React from 'react'

const ProductDetailsSkeleton = () => {
  return (
   
    <div className="p-4 md:p-6 animate-pulse">

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* LEFT IMAGE */}
        <div className="lg:col-span-2 flex flex-col lg:flex-row gap-4">

          {/* thumbnails */}
          <div className="flex lg:flex-col gap-2">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-gray-300 rounded"></div>
            ))}
          </div>

          {/* main image */}
          <div className="bg-gray-300 h-80 w-full rounded"></div>
        </div>

        {/* CENTER INFO */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 bg-gray-300 w-3/4 rounded"></div>
          <div className="h-4 bg-gray-300 w-1/3 rounded"></div>

          <div className="space-y-2">
            <div className="h-5 bg-gray-300 w-1/4 rounded"></div>
            <div className="h-8 bg-gray-300 w-1/2 rounded"></div>
            <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
          </div>

          <div className="h-20 bg-gray-300 rounded"></div>
        </div>

        {/* RIGHT BOX */}
        <div className="lg:col-span-1">
          <div className="border border-gray-300 p-4 rounded space-y-3">
            <div className="h-6 bg-gray-300 w-1/2 rounded"></div>
            <div className="h-4 bg-gray-300 w-3/4 rounded"></div>

            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        </div>

      </div>

      {/* REVIEW INPUT */}
      <div className="mt-8 space-y-3">
        <div className="h-5 bg-gray-300 w-1/4 rounded"></div>
        <div className="h-20 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-300 w-40 rounded"></div>
      </div>

      {/* REVIEWS */}
      <div className="mt-10 space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-300 w-1/4 rounded"></div>
              <div className="h-3 bg-gray-300 w-1/3 rounded"></div>
              <div className="h-3 bg-gray-300 w-2/3 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-gray-300 h-48 rounded"></div>
        ))}
      </div>

    </div>

  )
}

export default ProductDetailsSkeleton