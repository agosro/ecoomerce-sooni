import React from "react"
import ReactDOM from "react-dom/client"
import AppRouter from "./router/router"
import { CartProvider } from "./context/CartContext"
import useAuthStore from "./store/auth.store"
import "./styles/index.css"

// Hydrate auth state from localStorage before rendering
useAuthStore.getState().hydrateAuth()

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <AppRouter />
    </CartProvider>
  </React.StrictMode>
)
