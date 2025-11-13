/* eslint-disable @typescript-eslint/no-explicit-any */
//app/src/auth.ts
import NextAuth from "next-auth"
import authConfig from "./auth.config"

const API_BASE = process.env.API_BASE_URL!

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

        if (!email) {
          console.error("❌ No se pudo obtener email de Google")
          // ✅ Marcar token como inválido
          token.error = "NoEmail"
          return token
        }

        try {
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
            console.error("❌ Usuario no encontrado:", email)
            // ✅ Marcar token como inválido
            token.error = "UserNotFound"
            return token
          }

          const userData = signinResponse.data

          token.id = userData.id
          token.email = userData.email
          token.name = userData.name
          token.image = userData.image
          token.role = userData.role
          token.office = userData.office
          
          console.log("✅ Login Google exitoso:", email)
        } catch (error) {
          console.error("❌ Error en autenticación Google:", error)
          // ✅ Marcar token como inválido
          token.error = "AuthError"
          return token
        }
      }

      return token
    },

    async session({ session, token }) {
      // ✅ Si hay error en el token, no crear sesión válida
      if ("error" in token) {
        console.error("❌ Token con error, rechazando sesión:", token.error)
        // Retornar sesión inválida
        return {
          ...session,
          user: undefined,
        } as any
      }

      // ✅ Solo crear sesión si el token tiene ID (usuario válido)
      if (token.id && session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.image
        session.user.role = token.role
        session.user.office = token.office
        return session
      }

      // Si no hay ID, sesión inválida
      return {
        ...session,
        user: undefined,
      } as any
    },

    // ✅ Verificar que la sesión tenga usuario válido
    async authorized({ auth }) {
      // Si no hay auth o no hay user, denegar
      if (!auth || !auth.user) {
        return false
      }
      
      // Si no tiene rol, denegar
      if (!auth.user.role) {
        return false
      }
      
      return true
    },
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
  
  pages: {
    signIn: "/",
    error: "/",
  },
})