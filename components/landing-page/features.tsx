import { BookOpen, Share2, Lightbulb } from "lucide-react"

const features = [
  {
    name: "Store and Manage",
    description:
      "Organize your prompts and AI-generated responses in one place.",
    icon: BookOpen,
  },
  {
    name: "Share and Engage",
    description:
      "Connect with a community of prompt enthusiasts and share your best work.",
    icon: Share2,
  },
  {
    name: "Learn and Improve",
    description:
      "Master prompt engineering through examples and community insights.",
    icon: Lightbulb,
  },
]

const Features = () => {
  return (
    <section id="features" className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Powerful Features for Prompt Enthusiasts
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative rounded-lg bg-white p-6 shadow-md transition duration-300 hover:shadow-lg"
            >
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-100 p-3 text-blue-600">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mt-8 text-xl font-medium text-gray-900">
                {feature.name}
              </h3>
              <p className="mt-2 text-base text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
