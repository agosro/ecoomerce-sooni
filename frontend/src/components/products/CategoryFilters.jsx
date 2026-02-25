const categories = [
  "Todos",
  "Limpiadores",
  "Tónicos",
  "Esencias",
  "Serums",
  "Cremas",
  "Protección Solar",
]

export default function CategoryFilters({ active, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-16">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-5 py-2 text-sm rounded-full transition
            ${
              active === cat
                ? "bg-stone-900 text-white"
                : "bg-sand/40 text-stone-500 hover:bg-sand/60 hover:text-stone-700"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
