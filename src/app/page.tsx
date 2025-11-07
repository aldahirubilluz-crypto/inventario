"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Lock, PackageOpen, LogIn, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-provider";
import { handler } from "next/dist/build/templates/app-page";
import { getUsers } from "@/actions/prueba";

export default function Home() {
  const handler = () => {
    getUsers();
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-slate-50 to-slate-100">
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-linear-to-br from-primary/80 to-primary text-white p-12 relative overflow-hidden rounded-r-4xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-yellow-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-lg">
          <div className="flex items-center justify-center gap-3 text-6xl font-black tracking-tighter">
            <PackageOpen size={56} className="text-amber-400 drop-shadow-lg" />
            <span className="bg-linear-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">
              INVENTARIO
            </span>
          </div>

          <p className="text-lg text-amber-50 font-medium leading-relaxed">
            Gestiona tu stock con inteligencia. Control total, en tiempo real,
            sin complicaciones.
          </p>

          <div className="flex items-center justify-center gap-2 text-amber-200">
            <Sparkles size={18} />
            <span className="text-sm font-semibold">
              +10,000 productos gestionados
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 justify-center sm:items-center">
        <Card className="w-full max-w-md border-0 shadow-2xl rounded-none sm:rounded-3xl bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/90 overflow-hidden">
          <CardHeader className="space-y-1 pb-8 pt-10 px-8">
            <ThemeToggle />

            <CardTitle className="text-center text-4xl font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Bienvenido
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Ingresa tus credenciales para continuar
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-10 space-y-6">
            <form className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <Mail size={16} className="text-amber-600" />
                  Correo electrónico
                </label>
                <Input
                  type="email"
                  placeholder="ejemplo@hotmail.com"
                  className="h-12 bg-slate-50/70 border-slate-200 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-amber-500 transition-all duration-200 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <Lock size={16} className="text-amber-600" />
                  Contraseña
                </label>
                <Input
                  type="password"
                  placeholder="••••••••••"
                  className="h-12 bg-slate-50/70 border-slate-200 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-amber-500 transition-all duration-200"
                />
                <div className="text-right mt-2">
                  <Link
                    href="#"
                    className="text-xs font-medium text-amber-600 hover:text-amber-700 hover:underline transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/80 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <LogIn
                  size={18}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
                Iniciar sesión
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-slate-700 hover:text-amber-700 transition-all duration-300 flex items-center justify-center gap-3 group"
              onClick={() => handler()}
            >
              <img src="/icons/google-icon.svg" width="20px"></img>
              Continuar con Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
