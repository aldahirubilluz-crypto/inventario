// components/managers-table.tsx
"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  PauseCircle,
  PlayCircle,
  Key,
  Briefcase,
  Building2,
} from "lucide-react";

type UserData = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  office: string | null;
  isActive: boolean;
  createdAt: string;
};

interface ManagersTableProps {
  initialData: UserData[];
  onEdit?: (user: UserData) => void;
  onDelete?: (id: string) => void;
  onSuspend?: (id: string) => void;
  onRefresh?: (id: string) => void;
}

export function ManagersTable({
  initialData,
  onEdit,
  onDelete,
  onSuspend,
  onRefresh,
}: ManagersTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-border shadow-lg bg-card/90 backdrop-blur-sm">
      <table className="w-full text-sm text-left text-foreground">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
          <tr>
            <th className="px-6 py-4 font-semibold">Nombre</th>
            <th className="px-6 py-4 font-semibold">Correo</th>
            <th className="px-6 py-4 font-semibold">Rol</th>
            <th className="px-6 py-4 font-semibold">Oficina</th>
            <th className="px-6 py-4 font-semibold">Teléfono</th>
            <th className="px-6 py-4 font-semibold">Creado</th>
            <th className="px-6 py-4 font-semibold text-center">Estado</th>
            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {initialData.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="text-center py-12 text-muted-foreground italic bg-muted/30 rounded-b-3xl"
              >
                No hay usuarios registrados aún.
              </td>
            </tr>
          ) : (
            initialData.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  {user.name || "Sin nombre"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-muted-foreground" />
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-muted-foreground" />
                    <span className={`font-medium ${user.role === 'MANAGER' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                      {user.role === 'MANAGER' ? 'Manager' : 'Empleado'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.office ? (
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-muted-foreground" />
                      {user.office}
                    </div>
                  ) : (
                    <span className="text-muted-foreground/70 italic">No asignada</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {user.phone ? (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-muted-foreground" />
                      {user.phone}
                    </div>
                  ) : (
                    <span className="text-muted-foreground/70 italic">No registrado</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-muted-foreground" />
                    {format(new Date(user.createdAt), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${user.isActive
                        ? "bg-green-500/10 text-green-500 dark:bg-green-500/20"
                        : "bg-red-500/10 text-red-500 dark:bg-red-500/20"
                      }`}
                  >
                    {user.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 rounded-full hover:bg-primary/10 text-primary hover:scale-110 transition-all"
                        title="Editar Usuario"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    {onSuspend && (
                      <button
                        onClick={() => onSuspend(user.id)}
                        className={`p-2 rounded-full transition-all hover:scale-110 ${user.isActive
                            ? "hover:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                            : "hover:bg-green-500/10 text-green-600 dark:text-green-400"
                          }`}
                        title={
                          user.isActive ? "Desactivar Usuario" : "Activar Usuario"
                        }
                      >
                        {user.isActive ? (
                          <PauseCircle size={18} />
                        ) : (
                          <PlayCircle size={18} />
                        )}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(user.id)}
                        className="p-2 rounded-full hover:bg-destructive/10 text-destructive hover:scale-110 transition-all"
                        title="Eliminar Usuario"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    {onRefresh && (
                      <button
                        onClick={() => onRefresh(user.id)}
                        className="p-2 rounded-full hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:scale-110 transition-all"
                        title="Refrescar Contraseña"
                      >
                        <Key size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}