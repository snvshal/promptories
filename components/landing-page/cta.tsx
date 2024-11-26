import Link from "next/link"
import { ArrowRight } from "lucide-react"

const CTA = () => {
  return (
    <section className="bg-blue-600 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Elevate Your Prompt Game?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
            Join Promptories today and unlock a world of creative possibilities
            with AI prompts.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-blue-600 transition duration-300 hover:bg-blue-50"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTA
