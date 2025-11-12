"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePasswordWithToken } from "@/actions/auth";
import { sendPasswordChangedEmail } from "@/actions/email-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SuccessMessage from "./success-message";
import PasswordStrengthMeter from "@/components/password-strength-meter";

export default function PasswordForm({
  email,
  token,
  router,
}: {
  email: string | null;
  token: string | null;
  router: ReturnType<typeof useRouter>;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !token) {
      toast.error("Enlace inválido o expirado");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      toast.error("Debe contener al menos una mayúscula");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      toast.error("Debe contener al menos un número");
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePasswordWithToken(email, token, newPassword);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      await sendPasswordChangedEmail({ email });
      toast.success("¡Contraseña actualizada con éxito!", {
        icon: <CheckCircle2 className="w-5 h-5" />,
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return <SuccessMessage router={router} />;
  }

  return (
    <div className="max-h-screen flex items-center justify-center px-4 py-12">
      <Card className="mx-auto w-full max-w-md rounded-2xl border-0 shadow-2xl bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
        <div className="p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Cambiar contraseña</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Crea una contraseña segura para proteger tu cuenta.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <CardContent className="space-y-6 p-0">
              {/* Nueva contraseña */}
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-12 h-12 text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-12 h-12 text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <PasswordStrengthMeter password={newPassword} />

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Actualizando...
                  </>
                ) : (
                  "Cambiar contraseña"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  ← Volver al inicio de sesión
                </Link>
              </div>
            </CardContent>
          </form>
        </div>
      </Card>
    </div>
  );
}