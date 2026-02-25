import { Link } from "react-router-dom"
import { fullRoutineSteps } from "../data/fullRoutineSteps"

export default function Routine() {
    return (
        <section className="bg-ivory/40 py-32">
            <div className="max-w-5xl mx-auto px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-md tracking-widest uppercase text-sage">
                        Guía completa
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serifkr text-ink mt-4">
                        La rutina coreana
                    </h1>
                    <p className="text-ink/60 mt-4 max-w-2xl mx-auto leading-relaxed">
                        El skincare coreano se basa en la filosofía de capas: aplicar productos
                        del más ligero al más pesado, permitiendo que cada uno se absorba
                        completamente antes del siguiente.
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-6">
                    {fullRoutineSteps.map((step) => (
                        <article
                            key={step.id}
                            className={`${step.color} rounded-3xl px-10 py-10 md:px-14 md:py-12 relative overflow-hidden`}
                        >
                            {/* Step number background */}
                            <span className={`absolute left-6 md:left-10 bottom-4 text-[7rem] md:text-[8rem] font-bold leading-none select-none pointer-events-none ${step.numberColor}`}>
                                {step.id}
                            </span>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                {/* Left content */}
                                <div className="max-w-xl">
                                    <div className="flex items-baseline gap-4 mb-4">
                                        <h2 className="text-2xl md:text-3xl font-semibold text-ink">
                                            {step.title}
                                        </h2>
                                        <span className="text-xs text-ink/40 tracking-wide">
                                            {step.time}
                                        </span>
                                    </div>

                                    <p className="text-ink/60 leading-relaxed mb-6">
                                        {step.description}
                                    </p>

                                    <ul className="space-y-2">
                                        {step.tips.map((tip, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-ink/70">
                                                <span className="text-sage mt-0.5">•</span>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Right link */}
                                <Link
                                    to={`/productos?categoria=${encodeURIComponent(step.category)}`}
                                    className="text-sage text-sm font-medium hover:text-sage/80 transition whitespace-nowrap self-start mt-2"
                                >
                                    Ver producto recomendado
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <p className="text-ink/50 mb-4">¿Lista para comenzar tu rutina?</p>
                    <Link
                        to="/productos"
                        className="inline-block bg-sage text-white px-10 py-3 rounded-full font-medium hover:bg-sage/90 transition"
                    >
                        Explorar productos
                    </Link>
                </div>
            </div>
        </section>
    )
}
