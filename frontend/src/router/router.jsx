import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "@/App"
import Home from "@/pages/Home"
import Products from "@/pages/Products"
import ProductsDetail from "@/pages/ProductsDetail"
import SetUp from "@/pages/SetUp"
import Cart from "@/pages/Cart"
import Checkout from "@/pages/Checkout"
import Orders from "@/pages/Orders"
import AdminDashboard from "@/pages/AdminDashboard"
import PaymentSuccess from "@/pages/PaymentSuccess"
import PaymentFailure from "@/pages/PaymentFailure"
import PaymentPending from "@/pages/PaymentPending"
import Profile from "@/pages/Profile"
import Routine from "@/pages/Routine"
import About from "@/pages/About"
import Contact from "@/pages/Contact"
import ScrollToTop from "./ScrollToTop"
import PrivateRoute from "./PrivateRoute"
import AdminRoute from "./AdminRoute"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<App />}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:id" element={<ProductsDetail />} />
          <Route path="/setup" element={<SetUp />} />
          <Route path="/rutina" element={<Routine />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/checkout/success" element={<PaymentSuccess />} />
          <Route path="/checkout/failure" element={<PaymentFailure />} />
          <Route path="/checkout/pending" element={<PaymentPending />} />

          {/* Private routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/carrito" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<Orders />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}