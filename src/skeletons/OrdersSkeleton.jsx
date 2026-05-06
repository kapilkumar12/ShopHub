import React from 'react'

const OrdersSkeleton = () => {
   return (
    <div className="p-6 max-w-6xl mx-auto animate-pulse">

      {/* Title */}
      <div className="h-6 w-40 bg-gray-300 rounded mb-6"></div>

      <div className="space-y-5">

        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow"
          >
            {/* Top Row */}
            <div className="flex justify-between items-center mb-4">

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-300 rounded"></div>

                <div className="space-y-2">
                  <div className="h-3 w-24 bg-gray-300 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>

              <div className="space-y-2 text-right">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
              </div>

              <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
            </div>

            {/* Items Preview */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-4/5 bg-gray-200 rounded"></div>
            </div>

            {/* Bottom */}
            <div className="mt-4 flex justify-between items-center">
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default OrdersSkeleton