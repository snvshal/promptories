import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const Hero = () => {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Unleash the Power of Prompts:
            <span className="block text-blue-600">Discover, Save, Share</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Promptories is your go-to platform for storing, managing, and
            sharing AI prompts. Join our community and master the art of prompt
            engineering.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition duration-300 hover:bg-blue-700"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <div className="mt-16 flex justify-center">
          <div className="relative w-full max-w-4xl">
            <div className="absolute -inset-2 transform bg-gradient-to-r from-blue-400 to-green-400 shadow-xl sm:skew-y-0 sm:rounded-3xl"></div>
            <div className="relative rounded-2xl bg-white shadow-lg">
              <Image
                src="/promptories.png"
                alt="Promptories"
                width={1600}
                height={900}
                className="rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
