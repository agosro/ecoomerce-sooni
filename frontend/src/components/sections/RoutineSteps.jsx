import { Link } from "react-router-dom"
import { routineSteps } from "../../data/routineSteps"

export default function RoutineSteps() {
  return (
    <section className="bg-ivory py-24 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-xs tracking-widest uppercase text-sage">
          Tu ritual diario
        </span>

        <h2 className="mt-3 text-3xl md:text-4xl font-serifkr text-ink">
          La rutina perfecta
        </h2>

        <p className="mt-4 text-sm md:text-base text-ink/60 max-w-xl mx-auto">
          Sigue estos 4 pasos esenciales del skincare coreano para una piel
          saludable y luminosa.
        </p>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {routineSteps.map((step) => (
            <div
              key={step.id}
              className="bg-white rounded-2xl p-8 text-left shadow-sm hover:shadow-md transition"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-ink mb-6 ${step.color}`}
              >
                {step.id}
              </div>

              <h3 className="text-lg font-medium text-ink mb-3">
                {step.title}
              </h3>

              <p className="text-sm text-ink/60 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <Link
            to="/rutina"
            className="inline-flex items-center justify-center rounded-full border border-ink/30 px-8 py-3 text-sm text-ink hover:bg-ink hover:text-white transition"
          >
            Descubre más sobre cada paso
          </Link>
        </div>
      </div>
    </section>
  )
}
