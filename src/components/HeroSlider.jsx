import { useEffect, useState } from "react";

export default function HeroSlider({ slides = [] }) {

  const [current, setCurrent] = useState(0);

  //////////////////////////////////////////////////////////////
  // AUTO SLIDE
  //////////////////////////////////////////////////////////////

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides]);

  //////////////////////////////////////////////////////////////
  // EMPTY STATE
  //////////////////////////////////////////////////////////////

  if (!slides.length) return null;

  //////////////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////////////

  return (
    <div className="relative w-full h-64 md:h-[420px] overflow-hidden rounded-xl">

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-all duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide?.image?.[0]?.url}
            alt={slide.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-4 md:p-8 text-white">

            <h2 className="text-2xl md:text-4xl font-bold max-w-xl">
              {slide.title}
            </h2>

            <p className="mt-2 text-sm md:text-lg max-w-lg">
              {slide.description}
            </p>

            <button className="mt-4 w-fit bg-orange-500 px-5 py-2 rounded-lg hover:bg-orange-600">
              Shop Now
            </button>

          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index
                ? "bg-white"
                : "bg-gray-400"
            }`}
          />
        ))}
      </div>

    </div>
  );
}