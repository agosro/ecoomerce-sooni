import { useEffect } from 'react'
import { initMercadoPago } from '@mercadopago/sdk-react'
import Navbar from "./components/layout/Navbar"
import { Outlet } from "react-router-dom"
import Footer from "./components/layout/Footer"

export default function App() {
  useEffect(() => {
    // Inicializa Mercado Pago con tu Public Key de pruebas
    const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY
    if (publicKey && publicKey !== 'TEST_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
      initMercadoPago(publicKey)
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
