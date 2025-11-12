"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ShieldAlert, Lock, XCircle, Cog } from "lucide-react";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "AccessDenied":
        return {
          title: "Acceso Denegado",
          message: "No tienes una cuenta registrada en el sistema.",
          description:
            "Por favor, contacta al administrador para solicitar acceso.",
          icon: <ShieldAlert className="w-14 h-14 text-red-600" />,
        };
      case "Configuration":
        return {
          title: "Error de Configuración",
          message: "Hay un problema con la configuración del servidor.",
          description: "Por favor, contacta al administrador del sistema.",
          icon: <AlertTriangle className="w-14 h-14 text-orange-500" />,
        };
      case "Verification":
        return {
          title: "Error de Verificación",
          message: "No se pudo verificar tu identidad.",
          description: "El enlace puede haber expirado. Intenta nuevamente.",
          icon: <Lock className="w-14 h-14 text-yellow-500" />,
        };
      default:
        return {
          title: "Error de Autenticación",
          message: "Ocurrió un error durante el inicio de sesión.",
          description: "Por favor, intenta nuevamente.",
          icon: <XCircle className="w-14 h-14 text-red-600" />,
        };
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
        {/* Icono del error */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center shadow-inner">
            {errorInfo.icon}
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
          {errorInfo.title}
        </h1>

        {/* Mensaje */}
        <p className="text-gray-700 text-center font-medium mb-2">
          {errorInfo.message}
        </p>

        <p className="text-gray-500 text-center text-sm mb-6">
          {errorInfo.description}
        </p>

        {/* Contacto del admin */}
        {error === "AccessDenied" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 text-center">
              <strong>Contacto del administrador:</strong>
              <br />
              <a
                href={`mailto:${process.env.FROM_EMAIL}`}
                className="text-blue-600 hover:underline"
              >
                {process.env.FROM_EMAIL || "admin@tuempresa.com"}
              </a>
            </p>
          </div>
        )}

        {/* Botones */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white text-center font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            Volver al inicio
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="block w-full bg-gray-100 text-gray-700 text-center font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all"
          >
            Intentar nuevamente
          </button>
        </div>

        {/* Código de error */}
        {error && (
          <p className="text-xs text-gray-400 text-center mt-6">
            Código: {error}
          </p>
        )}
      </div>
    </div>
  );
}
