"use client"

export default function notFound() {
  return (
    <div className="flex-center h-dvh w-full">
      <p className="p-4">
        <span className="mr-4 h-12 border-r pr-4 text-lg">404</span>
        <span>This page could not be found.</span>
      </p>
    </div>
  )
}
