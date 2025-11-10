"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
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

export default function PasswordForm({
  email,
  token,
  router,
}: {
  email: string | null;
  token: string | null;
  router: ReturnType<typeof useRouter>;
}) {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token) {
      toast.error("Parámetros de URL inválidos");
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

    setIsLoading(true);
    try {
      const result = await updatePasswordWithToken(email, token, newPassword);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      await sendPasswordChangedEmail({ email });
      toast.success("Contraseña actualizada correctamente");
      setIsSuccess(true);
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      toast.error(
        "Error al cambiar la contraseña. Por favor intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return <SuccessMessage router={router} />;
  }

  return (
    <Card className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary">
          Cambiar contraseña
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ingresa tu nueva contraseña para completar el proceso.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-0">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                className="pl-10 py-6"
                required
              />
              <Button
                type="button"
                variant="link"
                size="icon"
                className="absolute right-0 top-1.5 h-10 w-10 text-muted-foreground hover:text-muted-foreground/80 hover:cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                </span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                className="pl-10 py-6"
                required
              />
              <Button
                type="button"
                variant="link"
                size="icon"
                className="absolute right-0 top-1.5 h-10 w-10 text-muted-foreground hover:text-muted-foreground/80 hover:cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"}
                </span>
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 py-5 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Lock className="mr-2 h-4 w-4 animate-pulse" />
                Actualizando...
              </>
            ) : (
              "Cambiar contraseña"
            )}
          </Button>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-blue-500 hover:underline">
              Volver al inicio de sesión
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
