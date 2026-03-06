import { Router } from "express"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import { promises as fs } from "fs"
import sharp from "sharp"
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const storage = multer.memoryStorage()

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
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No se recibió imagen" })
        
        const uploadsDir = path.join(__dirname, "../../public/images/products")
        
        // Obtener metadata de la imagen
        const metadata = await sharp(req.file.buffer).metadata()
        const { width, height } = metadata
        
        // Calcular el tamaño del cuadrado (el lado más pequeño)
        const size = Math.min(width, height)
        
        // Calcular las coordenadas para centrar el recorte
        const left = Math.round((width - size) / 2)
        const top = Math.round((height - size) / 2)
        
        // Procesar la imagen: recortar al cuadrado y redimensionar a 500x500
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`
        const filepath = path.join(uploadsDir, filename)
        
        await sharp(req.file.buffer)
            .extract({ left, top, width: size, height: size })
            .resize(1000, 1000, { fit: 'cover' })
            .webp({ quality: 100 })
            .toFile(filepath)
        
        const url = `${req.protocol}://${req.get("host")}/images/products/${filename}`
        res.json({ url })
    } catch (err) {
        console.error("Upload error:", err)
        res.status(500).json({ error: err.message || "Error al procesar imagen" })
    }
})

export default router
