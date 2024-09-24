import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name: string;
      email: string;
      bio?: string;
      image?: string;
      social_links?: {
        twitter?: string;
        github?: string;
      };
      followers: string[];
      following: string[];
    };
  }
}
