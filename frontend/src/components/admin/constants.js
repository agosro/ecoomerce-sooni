export { STATUS_LABEL, STATUS_COLOR } from '../../utils/orderStatus'

export const CATEGORIES = ['Limpiadores', 'Tónicos', 'Esencias', 'Serums', 'Cremas', 'Protección Solar']

export const FIELD = `w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm
  focus:outline-none focus:border-stone-400 transition`
export const LABEL = 'block text-xs text-stone-500 mb-1'

export const EMPTY_PRODUCT = {
    name: '', description: '', price: '', stock: '',
    category: CATEGORIES[0], imageUrl: '', featured: false, active: true,
}

export const EMPTY_COUPON = {
    code: '', discountType: 'percent', discountValue: '', minOrderAmount: '',
    maxUses: '', active: true, expiresAt: '',
}
