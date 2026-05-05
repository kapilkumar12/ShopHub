// components/CategoryCard.jsx

export default function CategoryCard({ name, image }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md cursor-pointer">
      <img
        src={image}
        alt={name}
        className="w-16 h-16 mx-auto object-contain"
        loading="lazy"
      />
      <p className="mt-2 font-medium">{name}</p>
    </div>
  );
}