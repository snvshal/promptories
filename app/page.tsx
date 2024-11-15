import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function Home() {
  const session = await getServerSession()

  if (session) return redirect("/home")
  return (
    <Link href="/sign-in" className="flex-center h-screen">
      signIn
    </Link>
  )
}
