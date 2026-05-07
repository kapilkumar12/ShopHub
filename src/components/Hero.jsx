import { useEffect, useState } from "react";
import { getSliders } from "../services/slider";
import HeroSkeleton from "../skeletons/HeroSkeleton";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await getSliders();
      setSlides(res?.sliders || []);
    } catch (error) {
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Auto Slide
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides]);

  //////////////////////////////////////////////////////////////
  // 🔥 SKELETON UI
  //////////////////////////////////////////////////////////////
  if (loading) {
    return (
       <div className="h-75 flex items-center justify-center">
        <HeroSkeleton />
      </div>       
    );
  }

  //////////////////////////////////////////////////////////////
  // 🔥 EMPTY STATE
  //////////////////////////////////////////////////////////////
  if (!Array.isArray(slides) || slides.length === 0) {
    return (
      <div className="h-75 flex items-center justify-center">
        No sliders found
      </div>
    );
  }

  //////////////////////////////////////////////////////////////
  // 🔥 MAIN UI
  //////////////////////////////////////////////////////////////
  return (
    <div className="relative w-full h-75 md:h-100 overflow-hidden rounded-xl">

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
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-8 text-white">
            <h2 className="text-3xl md:text-4xl font-bold">
              {slide.title}
            </h2>
            <p className="mt-2 text-lg">{slide.description}</p>
            <button className="mt-4 w-fit bg-orange-500 px-5 py-2 rounded-lg hover:bg-orange-600 cursor-pointer">
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
              current === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}