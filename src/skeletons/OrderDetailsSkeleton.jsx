export function OrderDetailsSkeleton() {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-pulse">

      {/* Title */}
      <div className="h-7 w-52 bg-gray-300 rounded mb-6"></div>

      {/* ================= TRACKING ================= */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6">
        <div className="h-5 w-32 bg-gray-300 rounded mb-4"></div>

        <div className="flex justify-between items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="w-6 h-6 mx-auto bg-gray-300 rounded-full mb-2"></div>
              <div className="h-3 w-16 mx-auto bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        <div className="h-3 w-40 bg-gray-200 rounded mx-auto mt-4"></div>
      </div>

      {/* ================= ITEMS ================= */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6">
        <div className="h-5 w-24 bg-gray-300 rounded mb-4"></div>

        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between items-center border-b py-3 gap-3">
            <div className="w-16 h-16 bg-gray-300 rounded"></div>

            <div className="flex-1 space-y-2">
              <div className="h-3 w-40 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>

            <div className="h-4 w-16 bg-gray-300 rounded"></div>
          </div>
        ))}

        <div className="mt-4 flex justify-between">
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-5 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* ================= ADDRESS ================= */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6">
        <div className="h-5 w-36 bg-gray-300 rounded mb-3"></div>

        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* ================= PAYMENT ================= */}
      <div className="bg-white p-5 rounded-2xl shadow mb-6">
        <div className="h-5 w-28 bg-gray-300 rounded mb-3"></div>

        <div className="space-y-2">
          <div className="h-3 w-40 bg-gray-200 rounded"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* ================= BUTTONS ================= */}
      <div className="space-y-3">
        <div className="h-10 w-full bg-gray-300 rounded-xl"></div>
        <div className="h-10 w-full bg-gray-200 rounded-xl"></div>
      </div>

    </div>
  );
}