export default function WishlistSkeleton() {
  return (
    <div className="p-4 md:p-6 animate-pulse">

      {/* Title */}
      <div className="h-6 w-48 bg-gray-300 rounded mb-6"></div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white p-3 rounded-xl shadow">

            {/* Image */}
            <div className="h-40 bg-gray-300 rounded mb-3"></div>

            {/* Title */}
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

            {/* Description */}
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>

            {/* Price */}
            <div className="h-5 bg-gray-300 rounded w-1/3"></div>

          </div>
        ))}

      </div>

    </div>
  );
}