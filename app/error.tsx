"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-semibold tracking-tight">
          Something went wrong!
        </h2>
        <p className="mx-auto max-w-xs text-muted-foreground">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  )
}
