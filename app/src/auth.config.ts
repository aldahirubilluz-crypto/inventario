/* eslint-disable @typescript-eslint/no-explicit-any */
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

const API_BASE = process.env.API_BASE_URL!

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  let data: any = null
  try {
    data = await res.json()
  } catch {}
  return { ok: res.ok, status: res.status, data }
}

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Email y contraseña requeridos")

        const res = await postJSON(`${API_BASE}/auth/signin`, {
          email: credentials.email,
          password: credentials.password,
          provider: "credentials",
        })

        if (!res.ok) {
          // res.data ya contiene { status, message, data }
          throw new Error(res.data?.message || "Credenciales inválidas")
        }

        // ✅ res.data contiene { status, message, data }
        // Entonces res.data.data es el objeto de usuario
        const userData = res.data?.data
        if (!userData?.id) {
          throw new Error("Respuesta inválida del servidor")
        }

        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          image: userData.image,
          role: userData.role,
        } as any
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
    updateAge: 10 * 60,
  },

  pages: { signIn: "/" },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
}

export default authConfig