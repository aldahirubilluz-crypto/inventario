"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PasswordForm from "./password-form";
import { Lock, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sección izquierda: formulario */}
      <div className="flex w-full h-full justify-center flex-col p-6 lg:w-1/2">
        <div className="flex flex-1 items-center justify-center">
          <PasswordForm email={email} token={token} router={router} />
        </div>
      </div>

      {/* Sección derecha: diseño visual */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-primary/90 to-primary/60 text-white items-center justify-center relative overflow-hidden">
        {/* Capa de diseño decorativo */}
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10 bg-cover bg-center"></div>

        <div className="relative z-10 text-center max-w-md p-10">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-md border border-white/20">
              <ShieldCheck className="h-12 w-12 text-white animate-bounce" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Restablece tu contraseña</h1>
          <p className="text-white/90 text-lg">
            Protege tu cuenta creando una nueva contraseña segura. Mantén tu
            información a salvo con nosotros.
          </p>
          <div className="mt-8 flex justify-center">
            <Lock className="h-6 w-6 text-white/70 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
