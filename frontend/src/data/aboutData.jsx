import { Leaf, Zap, Heart } from "lucide-react"

export const aboutCards = [
    {
        title: "Nuestra filosofía",
        text: "Creemos en el cuidado gentil y consistente. El skincare coreano nos enseña que la belleza verdadera viene de nutrir la piel día a día, no de soluciones rápidas y agresivas.",
        color: "bg-sage/10",
    },
    {
        title: "Ingredientes puros",
        text: "Seleccionamos cuidadosamente cada ingrediente por su eficacia probada. Priorizamos extractos naturales, fermentos ancestrales y fórmulas libres de irritantes.",
        color: "bg-blush/20",
    },
]

export const aboutValues = [
    {
        icon: <Leaf size={22} strokeWidth={1.5} className="text-sage" />,
        iconBg: "bg-sage/15",
        label: "Natural",
        desc: "Ingredientes de origen natural y sustentable.",
    },
    {
        icon: <Zap size={22} strokeWidth={1.5} className="text-amber-500" />,
        iconBg: "bg-amber-100",
        label: "Efectivo",
        desc: "Fórmulas probadas con resultados reales.",
    },
    {
        icon: <Heart size={22} strokeWidth={1.5} className="text-blush" />,
        iconBg: "bg-blush/20",
        label: "Gentil",
        desc: "Cuidado respetuoso para todo tipo de piel.",
    },
]
