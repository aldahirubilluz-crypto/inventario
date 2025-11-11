import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

export default function StepUbicacion({ register, errors }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Sede *</Label>
            <Input
              placeholder="Ingrese la sede"
              {...register("location")}
              className={cn(errors.location && "border-destructive")}
            />
            {errors.location && (
              <p className="text-sm text-destructive">
                {errors.location.message?.toString()}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Centro de Costo *</Label>
            <Input
              placeholder="Ingrese el centro de costo"
              {...register("costCenter")}
              className={cn(errors.costCenter && "border-destructive")}
            />
            {errors.costCenter && (
              <p className="text-sm text-destructive">
                {errors.costCenter.message?.toString()}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Tipo Ubicación *</Label>
            <Input
              placeholder="Ingrese el tipo de ubicación"
              {...register("locationType")}
              className={cn(errors.locationType && "border-destructive")}
            />
            {errors.locationType && (
              <p className="text-sm text-destructive">
                {errors.locationType.message?.toString()}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Subtipo Ubicación *</Label>
            <Input
              placeholder="Ingrese el subtipo de ubicación"
              {...register("locationSubtype")}
              className={cn(errors.locationSubtype && "border-destructive")}
            />
            {errors.locationSubtype && (
              <p className="text-sm text-destructive">
                {errors.locationSubtype.message?.toString()}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Empleado Responsable (DNI) *</Label>
            <Input
              {...register("responsibleEmployee", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^[0-9]*$/, // solo dígitos
                  message: "Solo se permiten números",
                },
              })}
              type="text"
              inputMode="numeric"
              placeholder="Ingrese DNI (8 dígitos)"
              maxLength={8}
              className={cn(errors.responsibleEmployee && "border-destructive")}
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                const target = e.currentTarget;
                target.value = target.value.replace(/\D/g, "");
              }}
            />
            {errors.responsibleEmployee && (
              <p className="text-sm text-destructive">
                {errors.responsibleEmployee.message?.toString()}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Empleado Final *</Label>
          <Input
            {...register("finalEmployee", {
              required: "Este campo es obligatorio",
              pattern: {
                value: /^[0-9]*$/,
                message: "Solo se permiten números",
              },
            })}
            type="text"
            inputMode="numeric"
            placeholder="Ingrese DNI (8 dígitos)"
            className={cn(errors.finalEmployee && "border-destructive")}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              const target = e.currentTarget;
              target.value = target.value.replace(/\D/g, "");
            }}
          />
          {errors.finalEmployee && (
            <p className="text-sm text-destructive">
              {errors.finalEmployee.message?.toString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
