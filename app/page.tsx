"use client"

import CTA from "@/components/landing-page/cta"
import Features from "@/components/landing-page/features"
import Footer from "@/components/landing-page/footer"
import Header from "@/components/landing-page/header"
import Hero from "@/components/landing-page/hero"
import HowItWorks from "@/components/landing-page/howitworks"
import Showcase from "@/components/landing-page/showcase"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <Header />
        <main>
          <Hero />
          <Features />
          <Showcase />
          <HowItWorks />
          <CTA />
        </main>
        <Footer />
      </div>
    )
  } else {
    return router.push("/home")
  }
}
