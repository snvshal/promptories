"use client"

import { useEffect, useState } from "react"

export function TimeAgo({ timestamp }: { timestamp: Date }) {
  const [timeAgo, setTimeAgo] = useState<string>("")

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date()
      const diffInMs = now.getTime() - new Date(timestamp).getTime()

      const seconds = Math.round(diffInMs / 1000)
      const minutes = Math.round(seconds / 60)
      const hours = Math.round(minutes / 60)
      const days = Math.round(hours / 24)
      const weeks = Math.round(days / 7)
      const months = Math.round(days / 30)
      const years = Math.round(days / 365)

      if (seconds <= 0) return `Now`
      if (seconds < 60) return `${seconds}s ago`
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      if (days < 7) return `${days}d ago`
      if (weeks < 4) return `${weeks}w ago`
      if (months < 12) return `${months}mo ago`
      return `${years}y ago`
    }

    setTimeAgo(calculateTimeAgo())

    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo())
    }, 1e5)

    return () => clearInterval(interval)
  }, [timestamp])

  return <span>{timeAgo}</span>
}
