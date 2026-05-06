export function CartSkeleton() {
  return (

    <div className="p-4 md:p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">

      {/* LEFT - CART ITEMS */}
      <div className="lg:col-span-2 space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row justify-between bg-white p-4 rounded-xl shadow gap-4"
          >
            {/* PRODUCT */}
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-300 rounded"></div>

              <div className="space-y-2 w-40">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
              <div className="w-6 h-4 bg-gray-300 rounded"></div>
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>

            {/* TOTAL */}
            <div className="flex flex-col items-end gap-2">
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
              <div className="h-3 w-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT - SUMMARY */}
      <div className="bg-white p-4 rounded-xl shadow h-fit space-y-3">
        <div className="h-5 w-1/2 bg-gray-300 rounded"></div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-gray-300 rounded"></div>
            <div className="h-3 w-16 bg-gray-300 rounded"></div>
          </div>

          <div className="flex justify-between">
            <div className="h-3 w-16 bg-gray-300 rounded"></div>
            <div className="h-3 w-14 bg-gray-300 rounded"></div>
          </div>

          <div className="flex justify-between mt-2">
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="h-10 bg-gray-300 rounded mt-4"></div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="lg:col-span-3 mt-10">
        <div className="h-5 w-48 bg-gray-300 rounded mb-4"></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>

    </div>

  )
}