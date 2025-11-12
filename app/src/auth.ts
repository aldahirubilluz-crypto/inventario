/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const API_BASE = process.env.API_BASE_URL!;

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {}
  return { ok: res.ok, status: res.status, data };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // ✅ Login con credenciales - el usuario ya viene del authorize()
      if (account?.provider === "credentials" && user) {
        token.id = (user as any).id;
        token.email = (user as any).email;
        token.name = (user as any).name;
        token.image = (user as any).image;
        (token as any).role = (user as any).role ?? "OBSERVER";
        return token;
      }

      // ✅ Login con Google
      if (account?.provider === "google" && profile) {
        const email = (profile as any)?.email;
        const name = (profile as any)?.name;
        const image = (profile as any)?.picture;

        if (!email) {
          throw new Error("No se pudo obtener el email de Google");
        }

        try {
          // 1. Intentar registrar (puede fallar con 409 si ya existe)
          const signupRes = await postJSON(`${API_BASE}/auth/signup`, {
            email,
            name,
            image,
            provider: "google",
          });

          // Si falla y NO es porque ya existe (409), lanzar error
          if (!signupRes.ok && signupRes.status !== 409) {
            console.error("Error en signup:", signupRes.data);
            throw new Error("Error registrando usuario Google");
          }

          // 2. Hacer signin (siempre, exista o no)
          const signinRes = await postJSON(`${API_BASE}/auth/signin`, {
            email,
            provider: "google",
          });

          if (!signinRes.ok) {
            console.error("Error en signin:", signinRes.data);
            throw new Error("Error iniciando sesión con Google");
          }

          // ✅ Extraer los datos correctamente (backend retorna { status, message, data })
          const userData = signinRes.data?.data;

          if (!userData?.id) {
            throw new Error("Respuesta inválida del servidor");
          }

          token.id = userData.id;
          token.email = userData.email;
          token.name = userData.name;
          token.image = userData.image;
          (token as any).role = userData.role ?? "OBSERVER";
        } catch (error) {
          console.error("Error en autenticación Google:", error);
          throw error;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = (token as any).image ?? null;
        (session.user as any).role = (token as any).role ?? "OBSERVER";
      }
      return session;
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
});
