"use client"

import React, { useState, useEffect } from "react"
import { StarIcon, SendIcon } from "lucide-react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { sendFeedbackAction } from "@/actions/feedback"

// Types
type FeedbackData = {
  rating: number
  feedback: string
  timestamp: string
  userInfo: {
    signupTime: string
    feedbackCount: number
  }
}

type StarRatingProps = {
  rating: number
  onRatingChange: (rating: number) => void
  hoveredRating: number
  onHover: (rating: number) => void
  onLeave: () => void
}

// Star Rating Component
const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  hoveredRating,
  onHover,
  onLeave,
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="transition-transform hover:scale-110"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={onLeave}
        >
          <StarIcon
            className={`h-8 w-8 transition-colors ${
              star <= (hoveredRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

// Utility functions
const getStorageItem = (key: string, defaultValue: string = "0"): number => {
  if (typeof window === "undefined") return parseInt(defaultValue)
  return parseInt(localStorage.getItem(key) || defaultValue)
}

const setStorageItem = (key: string, value: number): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value.toString())
  }
}

const getRatingMessage = (rating: number): string => {
  const messages = {
    1: "We're sorry to hear that. Please let us know how we can improve.",
    2: "Thank you for the feedback. We'll work on improvements.",
    3: "Thanks! We appreciate your feedback.",
    4: "Great! We're glad you had a good experience.",
    5: "Awesome! We're thrilled you love our service!",
  }
  return messages[rating as keyof typeof messages] || ""
}

// Main Feedback Dialog Component
const FeedbackDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)

  // Initialize user data
  const [userSignupTime] = useState<number>(() => {
    const existing = getStorageItem("userSignupTime")
    if (existing) return existing

    const now = Date.now()
    setStorageItem("userSignupTime", now)
    return now
  })

  const [lastFeedbackTime, setLastFeedbackTime] = useState<number>(() => {
    return getStorageItem("lastFeedbackTime")
  })

  const [feedbackCount, setFeedbackCount] = useState<number>(() => {
    return getStorageItem("feedbackCount")
  })

  // Check if dialog should popup
  useEffect(() => {
    const checkShouldPopup = (): void => {
      const now = Date.now()
      const timeSinceSignup = now - userSignupTime
      const timeSinceLastFeedback = now - lastFeedbackTime

      // First time: 2 minutes after signup
      if (feedbackCount === 0 && timeSinceSignup >= 2 * 60 * 1000) {
        setIsOpen(true)
        return
      }

      // Subsequent times: every 7 days
      if (
        feedbackCount > 0 &&
        timeSinceLastFeedback >= 7 * 24 * 60 * 60 * 1000
      ) {
        setIsOpen(true)
        return
      }
    }

    const timer = setTimeout(checkShouldPopup, 1000)
    return () => clearTimeout(timer)
  }, [userSignupTime, lastFeedbackTime, feedbackCount])

  // Send feedback via Server Action
  const sendFeedback = async (
    rating: number,
    feedback: string,
  ): Promise<void> => {
    const feedbackData: FeedbackData = {
      rating,
      feedback,
      timestamp: new Date().toISOString(),
      userInfo: {
        signupTime: new Date(userSignupTime).toISOString(),
        feedbackCount: feedbackCount + 1,
      },
    }

    const result = await sendFeedbackAction(feedbackData)

    if (!result.success) {
      throw new Error(result.error || "Failed to send feedback")
    }
  }

  const handleSubmit = async (): Promise<void> => {
    if (rating === 0) {
      alert("Please select a rating")
      return
    }

    setIsSubmitting(true)

    try {
      await sendFeedback(rating, feedback)

      // Update local storage
      const now = Date.now()
      setStorageItem("lastFeedbackTime", now)
      setStorageItem("feedbackCount", feedbackCount + 1)

      setLastFeedbackTime(now)
      setFeedbackCount(feedbackCount + 1)
      setHasSubmitted(true)

      // Close dialog after showing success message
      setTimeout(() => {
        handleClose()
        setHasSubmitted(false)
      }, 10000)
    } catch (error) {
      console.error("Error sending feedback:", error)
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send feedback. Please try again."
      alert(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = (): void => {
    setIsOpen(false)
    setRating(0)
    setFeedback("")
    setHoveredRating(0)
  }

  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      handleClose()
    } else {
      setIsOpen(open)
    }
  }

  return (
    <>
      {/* Manual trigger button for testing */}
      {/* <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-orange-600 text-white shadow-lg hover:bg-orange-700"
        >
          Give Feedback
        </Button>
      </div> */}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>We&#39;d love your feedback!</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          {hasSubmitted ? (
            <div className="py-4 text-center">
              <div className="text-lg font-medium text-green-600">
                Thank you for your feedback! 🎉
              </div>
              <p className="mt-2 text-muted-foreground">
                Your input helps us improve our service.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <label className="mb-3 block text-sm font-medium text-muted-foreground">
                  How would you rate your experience?
                </label>
                <div className="flex justify-start">
                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    hoveredRating={hoveredRating}
                    onHover={setHoveredRating}
                    onLeave={() => setHoveredRating(0)}
                  />
                </div>
                {rating > 0 && (
                  <p className="mt-2 text-start text-sm text-muted-foreground">
                    {getRatingMessage(rating)}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Tell us more about your experience (optional)
                </label>
                <Textarea
                  placeholder="Your feedback helps us improve..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="h-24"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Maybe Later
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || rating === 0}
                  className="min-w-[100px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <SendIcon className="h-4 w-4" />
                      Send Feedback
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FeedbackDialog
