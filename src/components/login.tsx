// components/RightLogin.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/components/theme-provider";
import { toast } from "sonner";

export default function RightLogin() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Credenciales incorrectas");
    } else {
      toast.success("¡Bienvenido!");
      window.location.href = "/dashboard";
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-1 justify-center sm:items-center p-4 sm:p-8">
      <Card className="w-full max-w-md border-0 shadow-2xl sm:rounded-3xl bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/90 overflow-hidden">
        <CardHeader className="space-y-1 pb-8 pt-10 px-8">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
          <CardTitle className="text-center text-4xl font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Bienvenido
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Ingresa tus credenciales para continuar
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Correo */}
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Mail size={16} className="text-amber-600" />
                Correo electrónico
              </label>
              <Input
                name="email"
                type="email"
                required
                placeholder="admin@demo.com"
                className="h-12"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Lock size={16} className="text-amber-600" />
                Contraseña
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Enlace de recuperar contraseña */}
              <div className="flex justify-end mt-2">
                <a
                  href="/auth/identify"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            {/* Botón iniciar sesión */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 font-semibold bg-primary hover:bg-primary/90"
            >
              <LogIn size={18} className="mr-2" />
              {loading ? "Verificando..." : "Iniciar sesión"}
            </Button>
          </form>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-muted-foreground">O</span>
            </div>
          </div>

          {/* Botón Google */}
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full h-12"
          >
            <img
              src="/icons/google-icon.svg"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            Continuar con Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
