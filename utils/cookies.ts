import { cookies } from "next/headers"

export const getCookie = (name: string) => {
  return cookies().get(name)?.value
}

export const setCookie = (name: string, value: string) => {
  cookies().set(name, value, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
  })
}
