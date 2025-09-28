"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

type FeedbackData = {
  rating: number
  feedback: string
  timestamp: string
  userInfo: {
    signupTime: string
    feedbackCount: number
  }
}

export async function sendFeedbackAction(feedbackData: FeedbackData) {
  try {
    const { rating, feedback, timestamp, userInfo } = feedbackData

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return {
        success: false,
        error: "Invalid rating. Must be between 1 and 5.",
      }
    }

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: "Promptories feedback <onboarding@resend.dev>",
      to: process.env.EMAIL_ADDRESS!,
      subject: `New Feedback: ${rating}/5 Stars`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Feedback Received
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Rating:</strong> 
              <span style="color: #ffc107;">${"⭐".repeat(rating)}</span> 
              (${rating}/5 stars)
            </p>
            <p style="margin: 10px 0;"><strong>Feedback:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
              ${feedback || "<em>No additional comments provided</em>"}
            </div>
          </div>
          
          <div style="border-top: 1px solid #dee2e6; padding-top: 15px; color: #6c757d; font-size: 14px;">
            <p><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}</p>
            <p><strong>User Signup:</strong> ${new Date(userInfo.signupTime).toLocaleString()}</p>
            <p><strong>Feedback Number:</strong> #${userInfo.feedbackCount}</p>
          </div>
        </div>
      `,
    })

    if (emailResult.error) {
      console.error("Resend error:", emailResult.error)
      return {
        success: false,
        error: "Failed to send email",
      }
    }

    return {
      success: true,
      messageId: emailResult.data?.id,
    }
  } catch (error) {
    console.error("Feedback action error:", error)
    return {
      success: false,
      error: "Internal server error",
    }
  }
}
