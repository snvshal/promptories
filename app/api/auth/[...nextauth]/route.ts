import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/models/user.model"; // import your MongoDB model
import { connectToDatabase } from "@/utils/db"; // function to connect to your database

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await connectToDatabase();
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create({
          username: user?.email?.split("@")[0],
          email: user.email,
          name: user.name,
          avatar: user.image,
        });
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
