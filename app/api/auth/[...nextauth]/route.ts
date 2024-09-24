import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/models/user.model";
import { connectToDatabase } from "@/utils/db";
import { Types } from "mongoose";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        await connectToDatabase();
        let dbUser = await User.findOne({ email: user.email });
        if (!dbUser) {
          dbUser = await User.create({
            username: user.email?.split("@")[0] || "",
            name: user.name || "",
            email: user.email || "",
            avatar: user.image || "",
          });
        }
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.username = dbUser.username;
          token.bio = dbUser.bio;
          token.social_links = dbUser.social_links;
          token.followers = dbUser.followers.map((id: Types.ObjectId) =>
            id.toString(),
          );
          token.following = dbUser.following.map((id: Types.ObjectId) =>
            id.toString(),
          );
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.bio = token.bio as string | undefined;
        session.user.social_links = token.social_links as
          | {
              twitter?: string;
              github?: string;
            }
          | undefined;
        session.user.followers = token.followers as string[];
        session.user.following = token.following as string[];
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
