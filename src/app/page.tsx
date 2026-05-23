import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { StatsBar } from '@/components/StatsBar'
import { SocialProof } from '@/components/SocialProof'
import { ProblemSolution } from '@/components/ProblemSolution'
import { ProcessSteps } from '@/components/ProcessSteps'
import { AppPreview } from '@/components/AppPreview'
import { SpecialtiesSection } from '@/components/SpecialtiesSection'
import { Pricing } from '@/components/Pricing'
import { NewsletterForm } from '@/components/NewsletterForm'
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
        <ProcessSteps />
        <AppPreview />
        <SpecialtiesSection />
        <Pricing />
        <section className="py-20" style={{ background: 'var(--bg)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <NewsletterForm />
          </div>
        </section>
        <DemoForm />
      </main>
      <Footer />
    </>
  )
}
