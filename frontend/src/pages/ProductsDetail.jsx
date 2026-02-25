import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Plus, Minus } from "lucide-react"
import { useState, useEffect } from "react"
import { productService } from "@/services/api"
import { useCart } from "@/context/CartContext"

export default function ProductsDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.getById(id).then(res => {
      setProduct(res.data)
      setLoading(false)
    })
  }, [id])

  const handleAddToCart = () => {
    addToCart(product._id, quantity)
    setQuantity(1)
  }

  if (loading) {
    return (
      <section className="py-32 bg-ivory">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-ink/60">Cargando producto...</p>
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="py-32 bg-ivory">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-2xl font-medium mb-4 text-ink">Producto no encontrado</h1>
          <Link to="/productos" className="inline-block px-6 py-3 bg-ink text-ivory rounded-full hover:bg-ink/90 transition">
            Ver productos
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-ivory">
      <div className="max-w-7xl mx-auto px-8">
        {/* Back Link */}
        <Link
          to="/productos"
          className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Volver a productos
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Image */}
          <div className="aspect-square rounded-3xl overflow-hidden bg-white/50">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-light tracking-widest text-ink/60 uppercase">
              {product.category}
            </span>

            <h1 className="mt-4 text-3xl md:text-4xl font-serifkr text-ink">
              {product.name}
            </h1>

            <p className="mt-4 text-2xl font-medium text-ink">
              ${product.price.toLocaleString("es-AR")}
              <span className="text-base font-light text-ink/60 ml-2">{product.currency}</span>
            </p>

            <p className="mt-6 text-ink/70 font-light leading-relaxed">
              {product.description}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-ink/20 rounded-full w-fit">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 hover:bg-ink/5 transition-colors text-ink"
                  aria-label="Reducir cantidad"
                >
                  <Minus size={18} />
                </button>
                <span className="px-6 text-sm font-medium text-ink">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-3 hover:bg-ink/5 transition-colors text-ink"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="px-8 py-3 bg-ink text-ivory rounded-full hover:bg-ink/90 transition font-medium sm:flex-1"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
