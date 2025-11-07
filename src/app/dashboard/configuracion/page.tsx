"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Lock } from "lucide-react";

export default function Configuracion() {
  return (
    <div className="flex flex-col items-center bg-background space-y-10">
      {/* Datos personales */}
      <Card className="w-full max-w-3xl shadow-lg border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#5b0e0e]">
            Datos Personales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nombre" className="flex items-center gap-1">
                  <User size={16} /> Nombre completo
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Juan Pérez"
                  className="mt-1 bg-muted/40 border-input focus-visible:ring-primary"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail size={16} /> Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@correo.com"
                  className="mt-1 bg-muted/40 border-input focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="border border-[#5b0e0e] text-[#5b0e0e] hover:bg-[#5b0e0e] hover:text-white transition-all"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#5b0e0e] hover:bg-[#7a0f0f] text-white transition-all"
              >
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Seguridad */}
      <Card className="w-full max-w-3xl shadow-lg border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#5b0e0e]">
            Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div>
              <Label htmlFor="password-actual" className="flex items-center gap-1">
                <Lock size={16} /> Contraseña actual
              </Label>
              <Input
                id="password-actual"
                type="password"
                placeholder="••••••••"
                className="mt-1 bg-muted/40 border-input focus-visible:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nueva-password">Nueva contraseña</Label>
                <Input
                  id="nueva-password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 bg-muted/40 border-input focus-visible:ring-primary"
                />
              </div>

              <div>
                <Label htmlFor="confirmar-password">Confirmar contraseña</Label>
                <Input
                  id="confirmar-password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 bg-muted/40 border-input focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-[#5b0e0e] hover:bg-[#7a0f0f] text-white transition-all"
              >
                Actualizar contraseña
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
