import "./globals.css"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { AuthSessionProvider } from "@/components/session-provider"
import { Session } from "next-auth"
import { getServerSession } from "next-auth"
import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/sidebar"
import { getContextUser } from "@/utils/get-user"
import ProgressBar from "@/components/progress-bar"
import { PostsProvider } from "@/hooks/use-posts"
import { UserProvider } from "@/hooks/use-user"
import FeedbackDialog from "@/components/feedback-dialog"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: {
    default:
      "Promptories — Your Ultimate Prompt Library for AI Learning and Discovery",
    template: "%s — Promptories",
  },
  description:
    "Explore, save, and share effective AI prompts with Promptories. Discover a growing library of prompts and their responses across platforms to enhance your prompting skills and learn from others.",
  keywords: [
    "AI prompts",
    "prompt engineering",
    "prompt library",
    "prompt sharing",
    "AI learning",
    "prompt examples",
    "social features",
    "AI discovery",
    "effective prompting",
    "Gemini prompts",
    "ChatGPT prompts",
    "Claude prompts",
    "LLaMA prompts",
    "GPT-4 prompts",
    "AI prompt ideas",
    "AI writing prompts",
    "AI chatbot prompts",
    "prompt marketplace",
    "creative prompts",
    "educational AI prompts",
    "productivity prompts",
  ],
  metadataBase: new URL(process.env.METADATA_BASE_URL as string),
  creator: "Promptories",
  publisher: "Promptories",
  applicationName: "Promptories",
  category: "AI Prompts Library",
  twitter: {
    card: "summary_large_image",
    site: "@snvshal",
    creator: "@snvshal",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session: Session | null = await getServerSession()

  const contextUser = await getContextUser()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgressBar />
        <AuthSessionProvider session={session as Session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UserProvider initialUser={contextUser}>
              <PostsProvider>
                <Sidebar>{children}</Sidebar>
              </PostsProvider>
            </UserProvider>
          </ThemeProvider>

          <Toaster />
          {session?.user && <FeedbackDialog />}
        </AuthSessionProvider>
      </body>
    </html>
  )
}
