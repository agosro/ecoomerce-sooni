import HeroBackground from "./HeroBackground";

export default function Hero() {
  return (
    <section className="relative h-[92vh] overflow-hidden bg-ivory">
      <HeroBackground />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="max-w-xl">
            {/* Badge */}
            <span className="text-xs uppercase tracking-widest text-sage">
              Korean Skincare
            </span>

            {/* Title */}
            <h1 className="mt-2 text-5xl font-light leading-tight text-ink">
              Simple care. <br />
              <span className="font-medium text-sage">
                Real results.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-stone-700">
              Descubre el ritual coreano de belleza con ingredientes
              puros y efectivos para una piel radiante.
            </p>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <button className="rounded-full bg-sage px-6 py-3 text-sm text-ivory transition hover:opacity-90">
                Ver productos
              </button>

              <button
                className="rounded-full px-6 py-3 text-sm transition bg-ivory text-ink border border-transparent hover:opacity-95 md:border md:border-stone-500 md:bg-transparent md:hover:bg-stone/40"
              >
                Conocé tu rutina
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
