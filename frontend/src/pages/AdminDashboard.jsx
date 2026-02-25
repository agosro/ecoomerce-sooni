import { useState } from 'react'
import { Package, ShoppingBag, Tag } from 'lucide-react'
import OrdersTab from '../components/admin/OrdersTab'
import ProductsTab from '../components/admin/ProductsTab'
import CouponsTab from '../components/admin/CouponsTab'

// ─── TABS CONFIG ──────────────────────────────────────────────────────────────

const TABS = [
  { id: 'orders', label: 'Órdenes', icon: ShoppingBag },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'coupons', label: 'Cupones', icon: Tag },
]

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders')

  return (
    <div className="min-h-screen bg-ivory/40">
      {/* Header */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-0.5">SOONI Skincare</p>
          <h1 className="text-xl font-semibold text-ink">Panel de administración</h1>
        </div>

        {/* Tab nav */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition ${activeTab === tab.id
                    ? 'border-sage text-sage font-medium'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                  }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'coupons' && <CouponsTab />}
      </div>
    </div>
  )
}
