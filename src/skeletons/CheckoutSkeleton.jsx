import React from 'react'

const CheckoutSkeleton = () => {
  return (
   <div className="bg-gray-100 min-h-screen p-4 md:p-8 animate-pulse">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {/* LEFT - FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-xl space-y-4">

          <div className="h-6 w-1/2 bg-gray-300 rounded"></div>

          <div className="space-y-3">
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-20 bg-gray-300 rounded"></div>

            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="space-y-3 mt-6">
            <div className="h-5 w-1/3 bg-gray-300 rounded"></div>

            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow-xl h-fit space-y-4">

          <div className="h-6 w-1/2 bg-gray-300 rounded"></div>

          {/* PRODUCTS */}
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-16 h-16 bg-gray-300 rounded"></div>

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
                </div>

                <div className="h-4 w-12 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>

          <div className="h-px bg-gray-300"></div>

          {/* PRICE SUMMARY */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-20 bg-gray-300 rounded"></div>
              <div className="h-3 w-16 bg-gray-300 rounded"></div>
            </div>

            <div className="flex justify-between">
              <div className="h-3 w-16 bg-gray-300 rounded"></div>
              <div className="h-3 w-14 bg-gray-300 rounded"></div>
            </div>

            <div className="flex justify-between">
              <div className="h-3 w-20 bg-gray-300 rounded"></div>
              <div className="h-3 w-16 bg-gray-300 rounded"></div>
            </div>

            <div className="flex justify-between mt-2">
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* BUTTON */}
          <div className="h-12 bg-gray-300 rounded mt-4"></div>
        </div>

      </div>
    </div>
  )
}

export default CheckoutSkeleton