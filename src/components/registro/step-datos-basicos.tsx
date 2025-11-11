import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

export default function StepDatosBasicos({ register, errors }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" /> Datos Básicos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Pre Etiqueta *</Label>
            <Input
              placeholder="Ingrese la pre etiqueta"
              {...register("oldLabel")}
              className={cn(errors.oldLabel && "border-destructive")}
            />
            {errors.oldLabel && (
              <p className="text-sm text-destructive">
                {errors.oldLabel.message?.toString()}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Código Patrimonial *</Label>
            <Input
              placeholder="Ingrese el código patrimonial"
              {...register("patrimonialCode")}
              className={cn(errors.patrimonialCode && "border-destructive")}
            />
            {errors.patrimonialCode && (
              <p className="text-sm text-destructive">
                {errors.patrimonialCode.message?.toString()}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Descripción *</Label>
          <Textarea
            placeholder="Ingrese la descripción del activo"
            {...register("description")}
            rows={3}
            className={cn(
              "overflow-auto max-h-[200px] resize-y",
              errors.description && "border-destructive"
            )}
            style={{ height: "auto" }}
            onInput={(e) => {
              const target = e.currentTarget;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message?.toString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
