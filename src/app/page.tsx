import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { StatsBar } from '@/components/StatsBar'
import { SocialProof } from '@/components/SocialProof'
import { ProblemSolution } from '@/components/ProblemSolution'
import { SpecialtiesSection } from '@/components/SpecialtiesSection'
import { Pricing } from '@/components/Pricing'
import { DemoForm } from '@/components/DemoForm'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <SocialProof />
        <ProblemSolution />
        <SpecialtiesSection />
        <Pricing />
        <DemoForm />
      </main>
      <Footer />
    </>
  )
}
