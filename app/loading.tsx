"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="m-auto bg-background">
      <Loader2 className="h-4 w-4 animate-spin p-8 text-blue-500" />
    </div>
  )
}
