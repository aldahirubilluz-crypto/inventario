import { Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

export default function StepTecnico({ register, errors }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" /> Técnico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Marca *</Label>
            <Input
              placeholder="Ingrese la marca"
              {...register("brand")}
              className={cn(errors.brand && "border-destructive")}
            />
            {errors.brand && (
              <p className="text-sm text-destructive">
                {errors.brand.message?.toString()}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Modelo *</Label>
            <Input
              placeholder="Ingrese el modelo"
              {...register("model")}
              className={cn(errors.model && "border-destructive")}
            />
            {errors.model && (
              <p className="text-sm text-destructive">
                {errors.model.message?.toString()}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nro. Serie *</Label>
            <Input
              placeholder="Ingrese el número de serie"
              {...register("serialNumber")}
              className={cn(errors.serialNumber && "border-destructive")}
            />
            {errors.serialNumber && (
              <p className="text-sm text-destructive">
                {errors.serialNumber.message?.toString()}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Medidas *</Label>
            <Input
              placeholder="Ingrese las medidas"
              {...register("dimensions")}
              className={cn(errors.dimensions && "border-destructive")}
            />
            {errors.dimensions && (
              <p className="text-sm text-destructive">
                {errors.dimensions.message?.toString()}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Características</Label>
          <Textarea
            placeholder="Describa las características"
            {...register("features")}
            rows={3}
            className={cn(
              "overflow-auto max-h-[100px] resize-y",
              errors.description && "border-destructive"
            )}
            style={{ height: "auto" }}
            onInput={(e) => {
              const target = e.currentTarget;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Nro. Chasis</Label>
            <Input
              placeholder="Ingrese número de chasis"
              {...register("chassisNumber")}
            />
          </div>
          <div className="space-y-2">
            <Label>Nro. Motor</Label>
            <Input
              placeholder="Ingrese número de motor"
              {...register("engineNumber")}
            />
          </div>
          <div className="space-y-2">
            <Label>Placa</Label>
            <Input
              placeholder="Ingrese placa"
              {...register("licensePlate")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
