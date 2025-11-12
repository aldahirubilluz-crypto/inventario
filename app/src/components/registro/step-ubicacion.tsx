import { MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function StepUbicacion({ register, errors }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <MapPin className="h-5 w-5 text-primary" />
          Ubicación
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Detalle físico y organizacional del activo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-sm font-medium">
              Sede <span className="text-destructive">*</span>
            </Label>
            <Input
              id="location"
              placeholder="Ej. 5"
              {...register("location")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.location &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.location && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.location.message?.toString()}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="costCenter" className="text-sm font-medium">
              Centro de Costo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="costCenter"
              placeholder="Ej. 91.12.08.04"
              {...register("costCenter")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.costCenter &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.costCenter && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.costCenter.message?.toString()}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="locationType" className="text-sm font-medium">
              Tipo Ubicación <span className="text-destructive">*</span>
            </Label>
            <Input
              id="locationType"
              placeholder="Ej. 5"
              {...register("locationType")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.locationType &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.locationType && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.locationType.message?.toString()}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="locationSubtype" className="text-sm font-medium">
              Subtipo Ubicación <span className="text-destructive">*</span>
            </Label>
            <Input
              id="locationSubtype"
              placeholder="Ej. 134"
              {...register("locationSubtype")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.locationSubtype &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.locationSubtype && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.locationSubtype.message?.toString()}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="responsibleEmployee" className="text-sm font-medium">
              Empleado Responsable (DNI) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="responsibleEmployee"
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="Ej. 71234567"
              {...register("responsibleEmployee", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^\d{8}$/,
                  message: "DNI debe tener 8 dígitos",
                },
              })}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.responsibleEmployee &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                const target = e.currentTarget;
                target.value = target.value.replace(/\D/g, "").slice(0, 8);
              }}
            />
            {errors.responsibleEmployee && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.responsibleEmployee.message?.toString()}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="finalEmployee" className="text-sm font-medium">
            Empleado Final (DNI) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="finalEmployee"
            type="text"
            inputMode="numeric"
            maxLength={8}
            placeholder="Ej. 76543210"
            {...register("finalEmployee", {
              required: "Este campo es obligatorio",
              pattern: {
                value: /^\d{8}$/,
                message: "DNI debe tener 8 dígitos",
              },
            })}
            className={cn(
              "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
              "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
              errors.finalEmployee &&
                "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
            )}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              const target = e.currentTarget;
              target.value = target.value.replace(/\D/g, "").slice(0, 8);
            }}
          />
          {errors.finalEmployee && (
            <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
              {errors.finalEmployee.message?.toString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}