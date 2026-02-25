import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { cartService } from "../services/api"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart]       = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]     = useState(null)

  // Helper genérico para operaciones del carrito
  const cartAction = useCallback(async (fn, errorMsg) => {
    try {
      const response = await fn()
      setCart(response.data)
      setError(null)
      return response.data
    } catch (err) {
      const msg = err.response?.data?.error || errorMsg
      setError(msg)
      throw err
    }
  }, [])

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await cartService.getCart()
      setCart(response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || "Error al cargar el carrito")
      if (err.response?.status === 401) setCart(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem("token")) fetchCart()
  }, [fetchCart])

  useEffect(() => {
    const onStorage = () => {
      localStorage.getItem("token") ? fetchCart() : setCart(null)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [fetchCart])

  const addToCart  = (productId, quantity) =>
    cartAction(() => cartService.addToCart(productId, quantity), "Error al agregar al carrito")

  const updateItem = (productId, quantity) =>
    cartAction(() => cartService.updateItem(productId, quantity), "Error al actualizar el carrito")

  const removeItem = (productId) =>
    cartAction(() => cartService.removeItem(productId), "Error al eliminar del carrito")

  const clearCart  = () =>
    cartAction(() => cartService.clearCart(), "Error al limpiar el carrito")

  return (
    <CartContext.Provider value={{ cart, isLoading, error, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
