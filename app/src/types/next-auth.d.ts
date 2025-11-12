// src/types/next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "ADMIN" | "MANAGER" | "OBSERVER"
    } & DefaultSession["user"]
  }
  interface User {
    id: string
    role: "ADMIN" | "MANAGER" | "OBSERVER"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "ADMIN" | "MANAGER" | "OBSERVER"
  }
}