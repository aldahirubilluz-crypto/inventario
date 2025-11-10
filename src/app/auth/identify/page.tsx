"use client";

import { useState } from "react";
import { Mail, Loader2, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { checkUserExists, generateResetToken } from "@/actions/auth";
import { sendRecoveryEmail } from "@/actions/email-actions";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }

    setIsLoading(true);
    try {
      const user = await checkUserExists(email);
      if ("error" in user) {
        toast.error(user.error);
        return;
      }

      const resetData = await generateResetToken(email, user.id);
      if (!resetData.code || !resetData.token) {
        toast.error("Error al generar el código de verificación");
        return;
      }

      await sendRecoveryEmail({
        email,
        token: resetData.code,
        name: user.name || "Usuario",
      });

      toast.success("¡Código enviado! Revisa tu correo");
      router.push(
        `/auth/verify?email=${encodeURIComponent(email)}&token=${resetData.token}`
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ocurrió un error. Inténtalo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/30 dark:from-background dark:to-muted/50 px-4 sm:px-6 lg:px-8">
      {/* Fondo decorativo animado (solo desktop) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-pulse animation-delay-4000" />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Formulario */}
        <div className="flex flex-col justify-center">
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-xl">
            <CardContent className="p-8 sm:p-10">
              <div className="text-center mb-9">
                <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg mb-5">
                  <LockKeyhole className="w-9 h-9 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  ¿Olvidaste tu contraseña?
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Ingresa tu correo y te enviaremos un código de recuperación seguro.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@ejemplo.com"
                      className="pl-11 h-12 bg-background/70 border-muted focus:border-primary focus:ring-primary transition-all"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando código...
                    </>
                  ) : (
                    "Enviar código de recuperación"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <Link
                  href="/"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  ← Volver al inicio de sesión
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel decorativo derecho (solo lg+) */}
        <div className="hidden lg:flex flex-col justify-center text-center">
          <div className="bg-linear-to-br from-primary to-primary/80 rounded-3xl shadow-2xl p-12 text-primary-foreground">
            <h2 className="text-4xl font-bold mb-6">Recupera tu cuenta al instante</h2>
            <p className="text-lg opacity-90 leading-relaxed mb-10">
              En menos de 30 segundos tendrás acceso nuevamente.<br />
              Solo necesitas tu correo electrónico.
            </p>

            <div className="flex justify-center gap-6">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className="bg-white/20 backdrop-blur-md rounded-2xl p-6 w-28 h-28 flex items-center justify-center border border-white/30"
                >
                  <span className="text-5xl font-bold">{step}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm opacity-80">
              Ingresa correo → Recibe código → ¡Accede!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}