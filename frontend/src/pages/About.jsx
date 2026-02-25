import { aboutCards, aboutValues } from "../data/aboutData"


export default function About() {
    return (
        <div className="bg-ivory/40 pb-16">

            {/* Hero */}
            <section className="max-w-4xl mx-auto px-8 pt-32 pb-16 text-center">
                <span className="text-md tracking-[0.3em] uppercase text-sage ">
                    Nuestra historia
                </span>
                <h1 className="text-4xl md:text-5xl font-serifkr text-ink mt-4 mb-10">
                    Sobre SOONI <span className="text-stone-500 font-light text-4xl">skincare</span>
                </h1>

                <p className="text-ink/60 leading-relaxed max-w-2xl mx-auto">
                    SOONI significa "niño pequeño" en coreano, un símbolo de pureza natural y protección.
                    Fundamos esta marca con una misión simple: traer los secretos milenarios del skincare
                    coreano a quienes buscan una piel saludable y radiante.
                </p>
            </section>

            {/* Filosofía + Ingredientes */}
            <section className="max-w-4xl mx-auto px-8 pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {aboutCards.map((card) => (
                        <div
                            key={card.title}
                            className={`${card.color} rounded-2xl p-8`}
                        >
                            <h2 className="text-base font-semibold text-ink mb-3">
                                {card.title}
                            </h2>
                            <p className="text-sm text-ink/50 leading-relaxed">
                                {card.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quote */}
            <section className="py-10 text-center">
                <p className="text-2xl md:text-3xl font-serifkr text-ink/70 italic">
                    "La piel sana es piel hermosa"
                </p>
            </section>

            {/* Valores */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-8 ">
                    <div className="bg-sand/20 border border-stone-100 rounded-2xl p-8 ">
                        <h2 className="text-xl font-semibold text-ink mb-10">
                            Nuestros valores
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            {aboutValues.map((v) => (
                                <div key={v.label} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                                    <div className={`w-12 h-12 rounded-full ${v.iconBg} flex items-center justify-center mb-4`}>
                                        {v.icon}
                                    </div>
                                    <h3 className="font-medium text-ink mb-1">{v.label}</h3>
                                    <p className="text-sm text-ink/50 leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}
