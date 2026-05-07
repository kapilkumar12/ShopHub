// skeletons/NavbarSkeleton.jsx

import React from "react";

const NavbarSkeleton = () => {
  return (
    <div className="bg-white shadow-md px-4 py-3 animate-pulse">
      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded md:hidden"></div>

          {/* LOGO */}
          <div className="w-24 h-10 bg-gray-300 rounded"></div>
        </div>

        {/* SEARCH */}
        <div className="hidden md:block w-1/2">
          <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* USER */}
          <div className="hidden md:block h-5 w-24 bg-gray-300 rounded"></div>

          {/* BUTTON */}
          <div className="h-9 w-20 bg-gray-300 rounded-lg"></div>

          {/* CART */}
          <div className="relative">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>

            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 rounded-full"></div>
          </div>

          {/* WISHLIST */}
          <div className="relative">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>

            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 rounded-full"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NavbarSkeleton;