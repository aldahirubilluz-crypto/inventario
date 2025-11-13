//app/src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"

export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE"
export type Office = "OTIC" | "PATRIMONIO" | "ABASTECIMIENTO"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      office: Office | null
      email: string
      name: string | null
      image: string | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    role: UserRole
    office: Office | null
    email: string
    name: string | null
    image: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: UserRole
    office: Office | null
    email: string
    name: string | null
    image: string | null
    error?: "NoEmail" | "UserNotFound" | "AuthError"
  }
}