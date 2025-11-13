//app/src/auth.ts
import NextAuth from "next-auth"
import authConfig from "./auth.config"

const API_BASE = process.env.API_BASE_URL!

interface SignupRequest {
  email: string
  name?: string | null
  image?: string | null
  provider: "google"
}

interface SigninRequest {
  email: string
  password: string
  provider: "google"
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

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Login con credenciales
      if (account?.provider === "credentials" && user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
        token.role = user.role
        token.office = user.office
        return token
      }

      // Login con Google
      if (account?.provider === "google" && profile) {
        const email = profile.email
        const name = profile.name ?? null
        const image = (profile.picture as string | undefined) ?? null

        if (!email) {
          throw new Error("No se pudo obtener el email de Google")
        }

        try {
          // 1. Intentar registrar
          const signupRequest: SignupRequest = {
            email,
            name,
            image,
            provider: "google",
          }

          const signupResponse = await postJSON<AuthResponse>(
            `${API_BASE}/auth/signup`,
            signupRequest
          )

          // Si falla y NO es 409, lanzar error
          if (!signupResponse.data && signupResponse.status !== 409) {
            throw new Error("Error registrando usuario Google")
          }

          // 2. Hacer signin
          const signinRequest: SigninRequest = {
            email,
            password: "",
            provider: "google",
          }

          const signinResponse = await postJSON<AuthResponse>(
            `${API_BASE}/auth/signin`,
            signinRequest
          )

          if (!signinResponse.data) {
            throw new Error("Error iniciando sesión con Google")
          }

          const userData = signinResponse.data

          token.id = userData.id
          token.email = userData.email
          token.name = userData.name
          token.image = userData.image
          token.role = userData.role
          token.office = userData.office
        } catch (error) {
          console.error("Error en autenticación Google:", error)
          throw error
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.image
        session.user.role = token.role
        session.user.office = token.office
      }
      return session
    },

    authorized: async ({ auth }) => !!auth,
  },

  cookies: {
    sessionToken: {
      name: "inventario_session_token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: "inventario_csrf_token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
})