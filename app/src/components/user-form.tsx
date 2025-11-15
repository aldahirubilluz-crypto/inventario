// components/user-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, Phone, User, Building2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { createUserAction } from "@/actions/agentes";

interface UserFormProps {
  onSave: () => void;
  onCancel: () => void;
}

export function UserForm({ onSave, onCancel }: UserFormProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role as string | undefined;
  const userOffice = session?.user?.office as string | undefined;

  const isAdmin = userRole === "ADMIN";
  const isManager = userRole === "MANAGER";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    office: isManager ? userOffice || "OTIC" : "OTIC",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!session?.user?.id) {
        toast.error("Usuario no autenticado");
        return;
      }

      const role = isAdmin ? "MANAGER" : "EMPLOYEE";

      const result = await createUserAction({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role,
        office: formData.office,
        createdByID: session.user.id,
      });

      if (!result.success) throw new Error(result.error);

      toast.success("Usuario creado y correo enviado exitosamente");
      onSave();
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            id="name"
            name="name"
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={handleChange}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="usuario@empresa.com"
            value={formData.email}
            onChange={handleChange}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono (opcional)</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            id="phone"
            name="phone"
            placeholder="987 654 321"
            value={formData.phone}
            onChange={handleChange}
            className="pl-10"
          />
        </div>
      </div>

      {isAdmin && (
        <div className="space-y-2">
          <Label htmlFor="office">Oficina del Manager</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground z-10" />
            <select
              id="office"
              name="office"
              value={formData.office}
              onChange={handleChange}
              className="w-full h-11 pl-10 pr-3 rounded-md border border-input bg-background appearance-none"
              required
            >
              <option value="OTIC">OTIC</option>
              <option value="PATRIMONIO">PATRIMONIO</option>
              <option value="ABASTECIMIENTO">ABASTECIMIENTO</option>
            </select>
          </div>
          <p className="text-xs text-muted-foreground">
            El usuario será creado como Manager de esta oficina
          </p>
        </div>
      )}

      {isManager && (
        <div className="bg-muted/50 p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Rol:</strong> Empleado
            <br />
            <strong>Oficina:</strong> {userOffice || "No asignada"}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando...
            </>
          ) : isAdmin ? (
            "Crear Manager"
          ) : (
            "Crear Empleado"
          )}
        </Button>
      </div>
    </form>
  );
}