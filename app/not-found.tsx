"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function notFound() {
  return (
    <div className="flex-center h-dvh w-full">
      <div className="flex-center flex-col gap-3">
        <p className="p-4 text-lg text-gray-500">404 | Page not found!</p>
        <Link href="/home">
          <Button>Go to home</Button>
        </Link>
      </div>
    </div>
  )
}
