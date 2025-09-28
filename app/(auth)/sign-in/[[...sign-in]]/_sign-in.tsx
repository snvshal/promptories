"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { GoogleIcon } from "@/components/ui/svg-icons"

export default function SignInComponent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const router = useRouter()

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl })
    router.replace(callbackUrl)
  }

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background p-4 max-sm:px-0">
      <Card className="w-full max-w-xl rounded-3xl px-5 py-8 text-card-foreground max-sm:border-0 max-sm:shadow-none">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <div className="flex-center gap-3">
              <Image
                src="/rmbg-icon.png"
                height={100}
                width={100}
                className="h-16 w-16 rounded-lg"
                alt="Promptories Icon"
              />
              <h1 className="bg-gradient-to-r from-orange-300 via-orange-500 to-orange-400 bg-clip-text text-4xl font-semibold text-transparent">
                Promptories
              </h1>
            </div>
            <p className="text-pretty text-lg text-muted-foreground">
              Get better AI prompts, faster and easier.
            </p>
          </div>

          <div className="flex-center w-full">
            <Button
              variant="secondary"
              onClick={handleSignIn}
              className="flex-center h-14 gap-3 rounded-full px-8"
            >
              <GoogleIcon />
              <span className="text-lg">Continue with Google</span>
            </Button>
          </div>

          <p className="text-pretty text-sm text-muted-foreground">
            By continuing, you agree to the{" "}
            <a
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </Card>
    </div>
  )
}
