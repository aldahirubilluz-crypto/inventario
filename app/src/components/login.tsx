/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/RightLogin.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/components/theme-provider";
import { toast } from "sonner";
import Lottie from "lottie-react";

interface LottieAnimation {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: any[];
  layers: any[];
}

export default function RightLogin() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [botAnimation, setBotAnimation] = useState<LottieAnimation | null>(
    null
  );
  const [lottieLoading, setLottieLoading] = useState(true);

  useEffect(() => {
    fetch("/lottie/bot.json")
      .then((res) => res.json())
      .then((data) => setBotAnimation(data))
      .finally(() => setLottieLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Credenciales incorrectas");
      } else if (res?.ok) {
        toast.success("¡Bienvenido!");
        window.location.href = "/dashboard";
      } else {
        toast.error("Error desconocido");
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      toast.error("Error al intentar iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Error en Google login:", error);
      toast.error("Error al iniciar sesión con Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex w-full md:w-1/2 justify-center items-center p-4 md:p-6">
      <Card className="w-full max-w-md border border-border/50 rounded-3xl shadow-xl bg-card">
        <CardHeader className="space-y-6 pb-6 pt-8 px-6">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>

          <div className="sm:hidden flex justify-center -mt-3">
            {lottieLoading ? (
              <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              botAnimation && (
                <div className="w-36 h-36 -mb-8 drop-shadow-lg">
                  <Lottie animationData={botAnimation} loop autoplay />
                </div>
              )
            )}
          </div>

          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold text-card-foreground">
              Bienvenido
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Ingresa tus credenciales para continuar
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                <Mail size={16} className="text-primary" />
                Correo electrónico
              </label>
              <Input
                name="email"
                type="email"
                required
                placeholder="admin@demo.com"
                className="h-12 bg-muted/50 border-input text-card-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                <Lock size={16} className="text-primary" />
                Contraseña
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-12 pr-11 bg-muted/50 border-input text-card-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-end">
                <a
                  href="/auth/identify"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              <LogIn size={18} className="mr-2" />
              {loading ? "Verificando..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">O</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full h-12 border border-border hover:bg-accent/50 text-card-foreground rounded-xl"
          >
            <img
              src="/icons/google-icon.svg"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            {googleLoading ? "Verificando..." : "Continuar con Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
