"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const examplePrompts = [
  {
    prompt: "Explain quantum computing to a 5-year-old",
    response:
      "Imagine you have a magical box that can be in many places at once. That's kind of like quantum computing!",
  },
  {
    prompt: "Write a haiku about artificial intelligence",
    response:
      "Silicon dreams wake\nMachines learn, evolve, create\nHuman-made brilliance",
  },
  {
    prompt: "Describe the taste of blue",
    response:
      "If blue had a taste, it might be cool and refreshing like a crisp mountain stream or a hint of mint on a summer breeze.",
  },
]

const Showcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextPrompt = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % examplePrompts.length)
  }

  const prevPrompt = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + examplePrompts.length) % examplePrompts.length,
    )
  }

  return (
    <section id="showcase" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Discover Inspiring Prompts
        </h2>
        <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="p-8">
            <h3 className="mb-4 text-xl font-semibold">Example Prompt:</h3>
            <p className="mb-6 text-gray-600">
              {examplePrompts[currentIndex].prompt}
            </p>
            <h3 className="mb-4 text-xl font-semibold">AI Response:</h3>
            <p className="text-gray-600">
              {examplePrompts[currentIndex].response}
            </p>
          </div>
          <div className="flex items-center justify-between bg-gray-100 px-4 py-3 sm:px-6">
            <button
              onClick={prevPrompt}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-2 text-sm font-medium leading-4 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <ChevronLeft className="mr-1 h-5 w-5" />
              Previous
            </button>
            <button
              onClick={nextPrompt}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-2 text-sm font-medium leading-4 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next
              <ChevronRight className="ml-1 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Showcase
