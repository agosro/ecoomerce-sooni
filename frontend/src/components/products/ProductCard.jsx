import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../../store/auth.store"
import { useCart } from "../../context/CartContext"

export default function ProductCard({ product, variant = "sm", onAddToCart }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { cart, addToCart, updateItem } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const isLarge = variant === "lg"

  // Derivar la cantidad REAL del servidor, no de estado local
  const cartItem = cart?.items?.find((i) => {
    const id = i.productId?._id?.toString() ?? i.productId?.toString()
    return id === product._id?.toString()
  })
  const quantity = cartItem?.quantity ?? 0

  const withLoading = async (fn) => {
    setIsLoading(true)
    try { await fn() }
    catch (err) { console.error("Cart error:", err) }
    finally { setIsLoading(false) }
  }

  const handleAdd = () => {
    if (!isAuthenticated) { navigate("/setup"); return }
    withLoading(async () => {
      if (quantity === 0) {
        await addToCart(product._id, 1)
      } else {
        await updateItem(product._id, quantity + 1)
      }
      onAddToCart?.(product)
    })
  }

  const handleRemove = () => {
    withLoading(() => updateItem(product._id, quantity - 1))
  }

  return (
    <article className="group bg-white rounded-2xl shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-lg flex flex-col">
      {/* imagen */}
      <Link to={`/productos/${product._id}`}>
        <div className={`relative overflow-hidden rounded-t-2xl bg-stone-100 ${isLarge ? "aspect-4/5" : "aspect-square"}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      {/* info */}
      <div className={`flex flex-col flex-1 ${isLarge ? "p-6" : "p-4"} gap-1`}>
        <span className="text-xs uppercase tracking-wide text-stone-400">
          {product.category}
        </span>

        <h3>
          <Link
            to={`/productos/${product._id}`}
            className={`font-medium text-stone-900 transition-colors duration-300 group-hover:text-sage ${isLarge ? "text-base" : "text-sm"}`}
          >
            {product.name}
          </Link>
        </h3>

        <div className="flex-1">
          <p className={`text-stone-500 line-clamp-2 ${isLarge ? "text-sm" : "text-xs"}`}>
            {product.description}
          </p>
        </div>

        <p className={`font-semibold text-stone-900 pt-2 ${isLarge ? "text-base" : "text-sm"}`}>
          ${product.price}
          <span className="text-xs text-stone-400 ml-1">{product.currency}</span>
        </p>

        {/* acción carrito */}
        <div className="mt-auto pt-4">
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              disabled={isLoading}
              className="w-full rounded-full border border-stone-300 py-2 text-xs hover:bg-stone-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Agregando..." : "Agregar al carrito"}
            </button>
          ) : (
            <div className="flex items-center justify-between border rounded-full px-3 py-1">
              <button
                onClick={handleRemove}
                disabled={isLoading}
                className="px-2 text-stone-400 hover:text-stone-700 disabled:opacity-50"
              >
                −
              </button>
              <span className="text-sm font-medium">{quantity}</span>
              <button
                onClick={handleAdd}
                disabled={isLoading}
                className="px-2 text-stone-400 hover:text-stone-700 disabled:opacity-50"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
