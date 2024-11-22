"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <h2 className="text-2xl font-semibold tracking-tight">
          Loading your application...
        </h2>
        <p className="text-muted-foreground">This may take a few moments.</p>
      </div>
    </div>
  )
}
