import { z } from "zod";

export const signInSchema = z.object({
  username: z.string({ error: "Ingrese un usuario" }).min(1, "El usuario es necesario"),
  password: z.string({ error: "La contraseña es necesaria" }).min(1, "La contraseña es necesaria"),
});