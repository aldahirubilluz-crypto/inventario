"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AuthError() {
  const errorInfo = {
    title: "Acceso no permitido",
    message: "No cuentas con el acceso necesario para continuar.",
    description:
      "Por favor, contacta al administrador para obtener acceso o verifica tus credenciales.",
    icon: <ShieldAlert className="w-16 h-16 text-red-600" />,
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-blue-50 via-blue-100 to-blue-200 px-6 py-10">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-gray-200">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center shadow-xl">
            {errorInfo.icon}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          {errorInfo.title}
        </h1>

        <p className="text-lg text-gray-700 text-center mb-3">
          {errorInfo.message}
        </p>

        <p className="text-gray-500 text-center text-sm mb-6">
          {errorInfo.description}
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900 text-center">
            <strong>¿Necesitas ayuda?</strong>
            <br />
            <a
              href={`mailto:${process.env.FROM_EMAIL}`}
              className="text-blue-600 hover:underline"
            >
              {process.env.FROM_EMAIL || "admin@tuempresa.com"}
            </a>
          </p>
        </div>

        <div className="space-y-4">
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
      </div>
    </div>
  );
}
