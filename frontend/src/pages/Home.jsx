import Hero from "../components/hero/Hero"
import FeaturedProducts from "../components/products/FeaturedProducts"
import RoutineSteps from "../components/sections/RoutineSteps"
import RoutineCTA from "../components/sections/RoutineCTA"

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <RoutineSteps />
      <RoutineCTA />
    </>
  )
}
