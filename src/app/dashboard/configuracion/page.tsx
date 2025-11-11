"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { updatePasswordById } from "@/actions/auth";
import { cn } from "@/lib/utils";
import PasswordStrengthMeter from "@/components/password-strength-meter";
import { signOut } from "next-auth/react";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export default function Configuracion() {
  const { data: session } = useSession();
  const user = session?.user as
    | { id: string; name?: string; email?: string }
    | undefined;

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: PasswordForm) => {
    if (!user?.id) {
      toast.error("Usuario no identificado");
      return;
    }

    setIsLoading(true);
    const result = await updatePasswordById(
      user.id,
      data.currentPassword,
      data.newPassword
    );

    if (result.success) {
      toast.success("¡Contraseña actualizada con éxito!", {
        icon: <CheckCircle2 className="w-5 h-5" />,
      });
      reset();
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);

      // 🔹 Cerrar sesión automáticamente
      await signOut({ callbackUrl: "/" }); // redirige al login
    } else {
      toast.error(result.error || "Error al actualizar la contraseña", {
        icon: <AlertCircle className="w-5 h-5" />,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="max-h-screen px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        <Card className="overflow-hidden border-0 shadow-xl bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80 p-0">
          <CardHeader className="bg-linear-to-r from-primary/10 to-destructive/5 p-4">
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-6 h-6" />
              </div>
              Datos Personales
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-foreground/80">Nombre completo</Label>
                <div className="flex items-center gap-3 text-foreground">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <p className="font-medium">{user?.name || "—"}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Correo electrónico</Label>
                <div className="flex items-center gap-3 text-foreground">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <p className="font-medium">{user?.email || "—"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-xl bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80 p-0">
          <CardHeader className="bg-linear-to-r from-primary/10 to-destructive/5 p-4">
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lock className="w-6 h-6" />
              </div>
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña actual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    placeholder="••••••••"
                    className={cn(
                      "pr-10",
                      errors.currentPassword &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      placeholder="••••••••"
                      className={cn(
                        "pr-10",
                        errors.newPassword &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                      {...register("newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className={cn(
                        "pr-10",
                        errors.confirmPassword &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <PasswordStrengthMeter password={newPassword} />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Actualizando...
                    </>
                  ) : (
                    "Actualizar contraseña"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
