import { Router } from "express"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../public/images/products"),
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`
        cb(null, unique + path.extname(file.originalname).toLowerCase())
    },
})

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/
        const ok = allowed.test(path.extname(file.originalname).toLowerCase()) &&
            allowed.test(file.mimetype)
        ok ? cb(null, true) : cb(new Error("Solo se permiten imágenes (jpg, png, webp)"))
    },
})

const router = Router()

// POST /api/upload — admin only
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No se recibió imagen" })
    const url = `${req.protocol}://${req.get("host")}/images/products/${req.file.filename}`
    res.json({ url })
})

export default router
