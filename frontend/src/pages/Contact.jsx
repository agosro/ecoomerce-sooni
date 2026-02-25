import { useState } from "react"
import { Mail, MapPin, Clock } from "lucide-react"

const FIELD_CLS = `
  w-full px-4 py-3 rounded-xl border border-stone-300 bg-white
  text-sm text-stone-800 placeholder-stone-300
  focus:outline-none focus:border-stone-400 transition
`
const LABEL_CLS = "block text-sm text-ink mb-1.5"

const infoCards = [
    {
        icon: <Mail size={18} strokeWidth={1.5} className="text-sage" />,
        iconBg: "bg-sage/25",
        bg: "bg-sage/10",
        title: "Email",
        line1: "hola@sooniskincare.com",
        line2: "Respondemos en menos de 24 horas",
    },
    {
        icon: <MapPin size={18} strokeWidth={1.5} className="text-purple-400" />,
        iconBg: "bg-lilac/60",
        bg: "bg-lilac/30",
        title: "Ubicación",
        line1: "Córdoba, Argentina",
        line2: "Envíos a todo el país",
    },
    {
        icon: <Clock size={18} strokeWidth={1.5} className="text-rose-400" />,
        iconBg: "bg-blush/50",
        bg: "bg-blush/20",
        title: "Horario de atención",
        line1: "Lunes a Viernes",
        line2: "9:00 AM – 6:00 PM (ART)",
    },
]

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
    const [sent, setSent] = useState(false)

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = (e) => {
        e.preventDefault()
        setSent(true)
    }

    return (
        <section className="bg-ivory/40 min-h-screen py-28">
            <div className="max-w-5xl mx-auto px-8">

                {/* Header */}
                <div className="text-center mb-14">
                    <span className="text-md tracking-[0.3em] uppercase text-sage">Contacto</span>
                    <h1 className="text-4xl md:text-5xl font-serifkr text-ink mt-3 mb-4">Hablemos</h1>
                    <p className="text-ink/50 text-md">
                        ¿Tienes preguntas sobre tu rutina o nuestros productos? Estamos aquí para ayudarte.
                    </p>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                    {/* LEFT — Formulario */}
                    <div className="lg:col-span-3">
                        {sent ? (
                            <div className="bg-sage/10 border border-sage/20 rounded-2xl p-10 text-center">
                                <p className="text-sage font-medium mb-2">¡Mensaje enviado!</p>
                                <p className="text-sm text-ink/50">Te respondemos en menos de 24 horas.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className={LABEL_CLS}>Nombre</label>
                                        <input
                                            type="text" name="name" value={form.name}
                                            onChange={handleChange} required placeholder="Tu nombre"
                                            className={FIELD_CLS}
                                        />
                                    </div>
                                    <div>
                                        <label className={LABEL_CLS}>Email</label>
                                        <input
                                            type="email" name="email" value={form.email}
                                            onChange={handleChange} required placeholder="tu@email.com"
                                            className={FIELD_CLS}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={LABEL_CLS}>Asunto</label>
                                    <input
                                        type="text" name="subject" value={form.subject}
                                        onChange={handleChange} required placeholder="¿En qué podemos ayudarte?"
                                        className={FIELD_CLS}
                                    />
                                </div>

                                <div>
                                    <label className={LABEL_CLS}>Mensaje</label>
                                    <textarea
                                        name="message" value={form.message}
                                        onChange={handleChange} required placeholder="Cuéntanos más..."
                                        rows={5}
                                        className={FIELD_CLS + " resize-none"}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-sage text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-sage/90 transition"
                                >
                                    Enviar mensaje
                                </button>
                            </form>
                        )}
                    </div>

                    {/* RIGHT — Info cards */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {infoCards.map((card) => (
                            <div
                                key={card.title}
                                className={`${card.bg} border border-stone-100 rounded-2xl p-5 flex items-start gap-4`}
                            >
                                <div className={`w-9 h-9 rounded-full ${card.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                                    {card.icon}
                                </div>
                                <div>
                                    <p className="font-medium text-ink text-sm mb-0.5">{card.title}</p>
                                    <p className="text-sm text-ink/70">{card.line1}</p>
                                    <p className="text-xs text-ink/40 mt-0.5">{card.line2}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
