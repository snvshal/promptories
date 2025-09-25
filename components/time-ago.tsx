"use client"

import { useEffect, useState } from "react"

export function TimeAgo({ timestamp }: { timestamp: Date }) {
  const [timeAgo, setTimeAgo] = useState<string>("")

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date()
      const ts = new Date(timestamp)
      const diffInMs = now.getTime() - ts.getTime()

      const seconds = Math.floor(diffInMs / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      if (seconds <= 0) return `Now`
      if (seconds < 60) return `${seconds}s`
      if (minutes < 60) return `${minutes}m`
      if (hours < 24) return `${hours}h`
      if (days < 7) return `${days}d`

      const options: Intl.DateTimeFormatOptions =
        ts.getFullYear() === now.getFullYear()
          ? { month: "short", day: "numeric" }
          : { month: "short", day: "numeric", year: "numeric" }

      return ts.toLocaleDateString("en-US", options)
    }

    setTimeAgo(calculateTimeAgo())

    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo())
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [timestamp])

  return <span>{timeAgo}</span>
}
