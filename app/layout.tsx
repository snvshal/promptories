import "./globals.css"
import localFont from "next/font/local"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { AuthSessionProvider } from "@/components/session-provider"
import { Session } from "next-auth"
import { getServerSession } from "next-auth"
import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/sidebar"
import { currentUser } from "@/utils/get-user"
import { TUser } from "@/types/schema.type"
import { ps } from "@/utils/ps"

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session: Session | null = await getServerSession()
  const user = await currentUser()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider session={session as Session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Sidebar user={ps(user as TUser)}>{children}</Sidebar>
          </ThemeProvider>
          <Toaster />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
