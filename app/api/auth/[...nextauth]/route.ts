import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { User } from "@/models/user.model"
import { connectToDatabase } from "@/utils/db"
import { st } from "@/utils/ps"

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
        // Update the token with the new session data
        return { ...token, ...session.user }
      }

      if (user) {
        const dbUser = await User.findOne({ email: user.email })
        if (dbUser) {
          token.id = dbUser._id.toString()
          token.username = dbUser.username
          token.name = dbUser.name
          token.image = dbUser.avatar
          token.bio = dbUser.bio
          token.social_links = dbUser.social_links
          token.followers = st(dbUser.followers)
          token.following = st(dbUser.following)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.name = token.name as string
        session.user.image = token.image as string
        session.user.bio = token.bio as string | undefined
        session.user.social_links = token.social_links as
          | {
              twitter?: string
              github?: string
            }
          | undefined
        session.user.followers = token.followers as string[]
        session.user.following = token.following as string[]
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
