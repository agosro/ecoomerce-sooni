import { useEffect, useState } from "react"
import { productService } from "../../services/api"
import ProductCard from "./ProductCard"
import AnimatedLink from "../ui/AnimatedLink"

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    productService.getAll().then(res => setProducts(res.data.filter(p => p.featured)))
  }, [])

  return (
    <section className="bg-secondary/30 py-36">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <span className="text-2 tracking-widest text-sage uppercase">
              Bestsellers
            </span>
            <h2 className="text-3xl font-medium text-stone-900">
              Productos destacados
            </h2>
          </div>

          <AnimatedLink to="/productos" className="text-sm self-start md:self-auto">
            Ver todos los productos
          </AnimatedLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )

}
