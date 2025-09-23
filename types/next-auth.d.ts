import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      name: string
      email: string
      bio?: string
      image?: string
      external_link?: string
    }
  }

  declare interface JWT {
    id?: string
    username?: string
    name?: string
    bio?: string
    image?: string
    external_link?: string
  }
}
