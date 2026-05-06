export default function ProductCardSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-3 rounded-xl shadow animate-pulse"
        >
          {/* Image */}
          <div className="h-48 bg-gray-300 rounded mb-3"></div>

          {/* Title */}
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

          {/* Description */}
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>

          {/* Price */}
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        </div>
      ))}
    </>
  );
}