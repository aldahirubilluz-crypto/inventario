//app/src/auth.config.ts
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

const API_BASE = process.env.API_BASE_URL!

interface SigninRequest {
  email: string
  password: string
  provider: "credentials" | "google"
}

interface AuthResponse {
  id: string
  email: string
  name: string | null
  image: string | null
  role: "ADMIN" | "MANAGER" | "EMPLOYEE"
  office: "OTIC" | "PATRIMONIO" | "ABASTECIMIENTO" | null
}

interface ApiResponse<T> {
  status: number
  message: string
  data: T | null
}

async function postJSON<T>(
  url: string,
  body: unknown
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  let data: ApiResponse<T>
  try {
    data = await res.json()
  } catch {
    throw new Error("Failed to parse response")
  }

  return data
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña requeridos")
        }

        const request: SigninRequest = {
          email: credentials.email as string,
          password: credentials.password as string,
          provider: "credentials",
        }

        const response = await postJSON<AuthResponse>(
          `${API_BASE}/auth/signin`,
          request
        )

        if (!response.data) {
          throw new Error(response.message || "Credenciales inválidas")
        }

        return {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          image: response.data.image,
          role: response.data.role,
          office: response.data.office,
        }
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
    maxAge: 30 * 60, // 30 minutos
    updateAge: 10 * 60, // 10 minutos
  },

  pages: { signIn: "/" },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
}

export default authConfig