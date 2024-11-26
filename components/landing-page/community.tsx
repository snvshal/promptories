import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "AI Researcher",
    content:
      "Promptories has revolutionized the way I approach prompt engineering. The community insights are invaluable!",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Michael Chen",
    role: "Content Creator",
    content:
      "As a content creator, Promptories has been a game-changer. It's my go-to resource for creative prompts.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Emily Rodriguez",
    role: "Student",
    content:
      "The learning opportunities on Promptories are endless. It's helped me improve my AI skills tremendously.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

const Community = () => {
  return (
    <section id="community" className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Join Our Thriving Community
        </h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-lg bg-gray-50 p-6 shadow-md"
            >
              <div className="mb-4 flex items-center">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Community
