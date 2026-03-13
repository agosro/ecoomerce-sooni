import { Router } from "express"
import multer from "multer"
import path from "path"
import { v2 as cloudinary } from "cloudinary"
import sharp from "sharp"
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js"

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
        
        // Obtener metadata de la imagen
        const metadata = await sharp(req.file.buffer).metadata()
        const { width, height } = metadata
        
        // Calcular el tamaño del cuadrado (el lado más pequeño)
        const size = Math.min(width, height)
        
        // Calcular las coordenadas para centrar el recorte
        const left = Math.round((width - size) / 2)
        const top = Math.round((height - size) / 2)
        
        // Procesar la imagen: recortar al cuadrado y redimensionar a 1000x1000
        const processedBuffer = await sharp(req.file.buffer)
            .extract({ left, top, width: size, height: size })
            .resize(1000, 1000, { fit: 'cover' })
            .webp({ quality: 100 })
            .toBuffer()
        
        // Subir a Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'image', format: 'webp', folder: 'sooni-products' },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            uploadStream.end(processedBuffer)
        })
        
        res.json({ url: result.secure_url })
    } catch (err) {
        console.error("Upload error:", err)
        res.status(500).json({ error: err.message || "Error al procesar imagen" })
    }
})

export default router
