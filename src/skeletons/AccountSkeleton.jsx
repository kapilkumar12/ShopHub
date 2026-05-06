import React from 'react'

const AccountSkeleton = () => {
   return (
    <div className="p-6 max-w-5xl mx-auto animate-pulse">

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6">

        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gray-300"></div>

        {/* Info */}
        <div className="flex-1 space-y-3 w-full">
          <div className="h-5 w-40 bg-gray-300 rounded"></div>
          <div className="h-4 w-60 bg-gray-200 rounded"></div>
        </div>

        {/* Logout Button */}
        <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
      </div>

      {/* ================= SECTIONS ================= */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">

        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow"
          >
            <div className="h-5 w-24 bg-gray-300 rounded mb-3"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default AccountSkeleton