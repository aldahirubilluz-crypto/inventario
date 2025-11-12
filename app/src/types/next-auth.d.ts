import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {

  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "MANAGER" | "OBSERVER";
      email: string;
      name?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }


  interface User extends DefaultUser {
    id: string;
    role: "ADMIN" | "MANAGER" | "OBSERVER";
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "ADMIN" | "MANAGER" | "OBSERVER";
    email: string;
  }
}
