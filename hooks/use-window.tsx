"use client"

import { useState, useEffect } from "react"

export function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  )

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return width
}

export function useIsMobileDevice() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent
      setIsMobile(/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent))
    }
  }, [])

  return isMobile
}
