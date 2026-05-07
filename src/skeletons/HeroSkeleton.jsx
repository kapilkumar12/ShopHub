import React from 'react'

const HeroSkeleton = () => {
    return (
        <div className="w-full h-75 md:h-100 rounded-xl overflow-hidden bg-gray-200 animate-pulse relative">

            {/* Image skeleton */}
            <div className="w-full h-full bg-gray-300"></div>

            {/* Overlay skeleton */}
            <div className="absolute inset-0 flex flex-col justify-center p-8 space-y-4">
                <div className="h-8 w-1/3 bg-gray-400 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-400 rounded"></div>
                <div className="h-10 w-32 bg-gray-400 rounded"></div>
            </div>
        </div>
    )
}

export default HeroSkeleton