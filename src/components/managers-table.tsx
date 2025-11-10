// components/managers-table.tsx
"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { User, Mail, Phone, Calendar } from "lucide-react";

type Manager = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  createdAt: Date;
  lastLogin: Date | null;
};

export function ManagersTable({ initialData }: { initialData: Manager[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-indigo-100 text-indigo-700">
          <tr>
            <th className="px-6 py-4">Nombre</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Teléfono</th>
            <th className="px-6 py-4">Creado</th>
            <th className="px-6 py-4">Último acceso</th>
          </tr>
        </thead>
        <tbody>
          {initialData.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-500">
                No hay managers registrados aún.
              </td>
            </tr>
          ) : (
            initialData.map((manager) => (
              <tr
                key={manager.id}
                className="bg-white border-b hover:bg-indigo-50/50 transition"
              >
                <td className="px-6 py-4 font-medium flex items-center gap-2">
                  <User size={16} className="text-indigo-600" />
                  {manager.name || "Sin nombre"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-500" />
                    {manager.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {manager.phone ? (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-500" />
                      {manager.phone}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No registrado</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-500" />
                    {format(new Date(manager.createdAt), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {manager.lastLogin ? (
                    format(new Date(manager.lastLogin), "dd MMM, HH:mm", {
                      locale: es,
                    })
                  ) : (
                    <span className="text-gray-400">Nunca</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}