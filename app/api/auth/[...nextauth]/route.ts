import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { User } from "@/models/user.model"
import { connectToDatabase } from "@/utils/db"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        await connectToDatabase()
        let dbUser = await User.findOne({ email: user.email })
        if (!dbUser) {
          dbUser = await User.create({
            username: user.email?.split("@")[0] || "",
            name: user.name || "",
            email: user.email || "",
            avatar: user.image || "",
          })
        }
        return true
      } catch (error) {
        console.error("Error during sign in:", error)
        return false
      }
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        return { ...token, ...session.user }
      }

      if (user) {
        const dbUser = await User.findOne({ email: user.email })
        if (dbUser) {
          token.id = dbUser._id.toString() || ""
          token.username = dbUser.username || ""
          token.name = dbUser.name || ""
          token.image = dbUser.avatar || ""
          token.bio = dbUser.bio || ""
          token.social_links = dbUser.social_links || {}
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || ""
        session.user.username = (token.username as string) || ""
        session.user.name = (token.name as string) || ""
        session.user.image = (token.image as string) || ""
        session.user.bio = (token.bio as string) || ""
        session.user.external_link = (token.external_link as string) || ""
      }

      return session
    },
  },
})

export { handler as GET, handler as POST }
