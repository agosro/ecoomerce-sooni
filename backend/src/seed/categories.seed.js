import Category from "../models/Category.js"

const DEFAULT_CATEGORIES = ['Limpiadores', 'Tónicos', 'Esencias', 'Serums', 'Cremas', 'Protección Solar']

export const seedCategories = async () => {
  for (const name of DEFAULT_CATEGORIES) {
    const exists = await Category.findOne({ name })
    if (!exists) {
      await Category.create({ name })
    }
  }
}
