import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession()
  const url = session ? "/home" : "/sign-in"
  return redirect(url)
}
