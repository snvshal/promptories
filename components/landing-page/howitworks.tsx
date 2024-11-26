import { UserPlus, PlusCircle, Share } from "lucide-react"

const steps = [
  {
    title: "Sign Up",
    description:
      "Create your free account and join our community of prompt enthusiasts.",
    icon: UserPlus,
  },
  {
    title: "Add Prompts",
    description:
      "Start building your library by adding prompts and AI-generated responses.",
    icon: PlusCircle,
  },
  {
    title: "Share & Explore",
    description:
      "Share your prompts with others and discover new ideas from the community.",
    icon: Share,
  },
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
          How Promptories Works
        </h2>
        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={step.title} className="bg-gray-50 px-4">
                <div className="relative">
                  <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                      <step.icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="pt-8 text-center">
                    <h3 className="mb-2 text-xl font-medium text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-base text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
