import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import ProductsHeader from "@/components/products/ProductsHeader"
import CategoryFilters from "@/components/products/CategoryFilters"
import ProductsGrid from "@/components/products/ProductsGrid"
import { productService } from "@/services/api"

const PAGE_SIZE = 12

export default function Products() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("categoria") || "Todos"
  )
  const [page, setPage] = useState(1)
  useEffect(() => {
    productService.getAll().then(res => setProducts(res.data))
  }, [])

  // Reset to page 1 when filter changes
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setPage(1)
  }

  const filtered =
    activeCategory === "Todos"
      ? products
      : products.filter(p => p.category === activeCategory)

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <section className="py-32 bg-ivory/40">
      <div className="max-w-7xl mx-auto px-8">
        <ProductsHeader />

        <CategoryFilters
          active={activeCategory}
          onChange={handleCategoryChange}
        />

        <ProductsGrid
          products={paginated}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm rounded-full border border-stone-300 text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              ← Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-9 h-9 text-sm rounded-full transition ${n === page
                    ? "bg-ink text-white"
                    : "border border-stone-300 text-stone-500 hover:bg-stone-100"
                  }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm rounded-full border border-stone-300 text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
