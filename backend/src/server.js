import 'dotenv/config'
import "./config/db.js"
import app from "./app.js"
import { seedCategories } from "./seed/categories.seed.js"

const PORT = process.env.PORT || 4000

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`)
  await seedCategories()
})
