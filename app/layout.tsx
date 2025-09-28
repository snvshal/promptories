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
import { ps } from "@/utils/ps"
import ProgressBar from "@/components/progress-bar"
import { fetchFeedPosts } from "@/actions/getFeedPosts"
import { PostsProvider } from "@/hooks/use-posts"
import { ContextUser, UserProvider } from "@/hooks/use-user"
import { Suspense } from "react"
import { FullPageLoadingIndicator } from "@/components/home"

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
    "Next.js",
    "Tailwind CSS",
    "shadcn-ui",
    "social features",
    "Vercel",
    "AI discovery",
    "effective prompting",
  ],
  metadataBase: new URL(process.env.METADATA_BASE_URL as string),
  openGraph: {
    title: "Promptories — A Prompt Library for AI Enthusiasts",
    description:
      "Save, discover, and share powerful AI prompts and responses. Learn how to prompt smarter with Promptories.",
    url: new URL(process.env.METADATA_BASE_URL as string),
    siteName: "Promptories",
    images: [
      {
        url: "/promptories.png",
        width: 1600,
        height: 900,
        alt: "Promptories OpenGraph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    title: "Promptories — Master the Art of AI Prompting",
    description:
      "Unlock the full potential of AI with curated prompts and responses. Discover, learn, and share your best prompts.",
    images: [
      {
        url: "/promptories.png",
        width: 1600,
        height: 900,
        alt: "Promptories Twitter Image",
      },
    ],
    card: "summary_large_image",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session: Session | null = await getServerSession()

  const contextUser = (await getContextUser()) as ContextUser
  const posts = await fetchFeedPosts()

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
            <Suspense fallback={<FullPageLoadingIndicator />}>
              <UserProvider initialUser={ps(contextUser)}>
                <PostsProvider initialPosts={ps(posts)}>
                  <Sidebar>{children}</Sidebar>
                </PostsProvider>
              </UserProvider>
            </Suspense>
          </ThemeProvider>

          <Toaster />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
