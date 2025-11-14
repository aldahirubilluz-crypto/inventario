"use client";

import * as React from "react";
import { Key, KeyRound, Lock, MailCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkUserExists, generateResetTokene, validateResetCode } from "@/actions/auth";
import { sendRecoveryEmail } from "@/actions/email-actions";

function VerifyCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token) {
      toast.error("Parámetros de URL inválidos");
      return;
    }

    setIsLoading(true);
    try {
      const result = await validateResetCode(email, code);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Código verificado correctamente");
      router.push(
        `/auth/reset-password?email=${encodeURIComponent(email)}&token=${
          result.token
        }`
      );
    } catch {
      toast.error("Error al verificar el código. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !email) return;
    setIsLoading(true);

    try {
      const result = await checkUserExists(email);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      // 2. Generar el Token (llama a la API de Go /request, que genera el código y el JWT inicial)
      const resetData = await generateResetTokene(email);

      // 3. Enviar el email (usando el código de 6 dígitos que vino de Go)
      await sendRecoveryEmail({
        email,
        token: resetData.code,
        name: resetData.name,
      });

      toast.success("¡Código enviado! Revisa tu correo");
      setResendCooldown(60);
    } catch {
      toast.error("Error al reenviar el código. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sección izquierda: Formulario */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <Card className="w-full max-w-md rounded-2xl border border-border bg-card shadow-md">
          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MailCheck className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">
                Verificar código
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Ingresa el código de 6 dígitos enviado a:
                <br />
                <span className="font-medium text-primary">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="code">Código de verificación</Label>
                <div className="relative mt-1">
                  <Key className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="code"
                    type="text"
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="Ej: 123456"
                    className="pl-10 py-6 font-mono text-lg tracking-widest"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 py-5 text-white"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? "Verificando..." : "Verificar código"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className={`text-sm font-medium ${
                    resendCooldown > 0
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-blue-600 hover:underline"
                  }`}
                  disabled={resendCooldown > 0 || isLoading}
                >
                  {resendCooldown > 0
                    ? `Reenviar código en ${resendCooldown}s`
                    : "Reenviar código"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-linear-to-br from-primary/80 to-primary/60 relative overflow-hidden">
        {/* Figuras decorativas */}
        <div className="absolute inset-0">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_2px,transparent_2px,transparent_10px)]" />
        </div>

        {/* Contenido */}
        <div className="relative z-10 text-center text-white px-8 max-w-md space-y-6">
          {/* Íconos grandes decorativos */}
          <div className="flex justify-center items-center gap-6">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
              <KeyRound className="h-10 w-10 text-white" />
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
              <Lock className="h-10 w-10 text-white" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Protegemos tu acceso
            </h2>
            <p className="text-white/90 text-sm leading-relaxed">
              Tu seguridad es nuestra prioridad. Verifica tu identidad antes de
              continuar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          Cargando...
        </div>
      }
    >
      <VerifyCodeContent />
    </Suspense>
  );
}
