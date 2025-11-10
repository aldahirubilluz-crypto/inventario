"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, Phone, User, Lock, Eye, EyeOff } from "lucide-react";
import {
  createManagerAction,
  updateManagerAction,
} from "@/actions/register-manager";

interface Manager {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

interface ManagerFormProps {
  manager?: Manager | null;
  onSave: () => void;
  onCancel: () => void;
}

export function ManagerForm({ manager, onSave, onCancel }: ManagerFormProps) {
  const [formData, setFormData] = useState({
    name: manager?.name ?? "",
    email: manager?.email ?? "",
    phone: manager?.phone ?? "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (manager) {
        const result = await updateManagerAction({
          id: manager.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password || undefined,
        });

        if (!result.success) throw new Error(result.error);
      } else {
        if (!formData.password.trim()) {
          toast.error("Debes ingresar una contraseña para el nuevo manager.");
          return;
        }

        const result = await createManagerAction({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
        });

        if (!result.success) throw new Error(result.error);
      }

      onSave();
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error al guardar el manager.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground font-medium">
          Nombre completo
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            id="name"
            name="name"
            placeholder="Ej. Aldahir Ubilluz"
            value={formData.name}
            onChange={handleChange}
            className="pl-10 h-11 rounded-xl border-input bg-background focus-visible:ring-primary"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground font-medium">
          Correo electrónico
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="usuario@empresa.com"
            value={formData.email}
            onChange={handleChange}
            className="pl-10 h-11 rounded-xl border-input bg-background focus-visible:ring-primary"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground font-medium">
          Teléfono (opcional)
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            id="phone"
            name="phone"
            type="text"
            placeholder="987 654 321"
            value={formData.phone}
            onChange={handleChange}
            className="pl-10 h-11 rounded-xl border-input bg-background focus-visible:ring-primary"
          />
        </div>
      </div>

      {!manager && (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground font-medium">
            Contraseña
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-12 h-11 rounded-xl border-input bg-background focus-visible:ring-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-xl px-6 font-medium hover:bg-muted/50 transition"
          disabled={loading}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-7 font-semibold shadow-lg transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : manager ? (
            "Actualizar"
          ) : (
            "Crear Manager"
          )}
        </Button>
      </div>
    </form>
  );
}