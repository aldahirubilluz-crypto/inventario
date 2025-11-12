import { Wrench } from "lucide-react";
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

export default function StepTecnico({ register, errors }: any) {
  return (
    <Card className="border-0 shadow-sm gap-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Wrench className="h-5 w-5 text-primary" />
          Técnico
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Especificaciones técnicas y características del activo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="brand" className="text-sm font-medium">
              Marca <span className="text-destructive">*</span>
            </Label>
            <Input
              id="brand"
              placeholder="Ej. 1234"
              {...register("brand")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.brand &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.brand && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.brand.message?.toString()}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="model" className="text-sm font-medium">
              Modelo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="model"
              placeholder="Ej. H40-7"
              {...register("model")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.model &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.model && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.model.message?.toString()}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="serialNumber" className="text-sm font-medium">
              Nro. Serie <span className="text-destructive">*</span>
            </Label>
            <Input
              id="serialNumber"
              placeholder="Ej. SN123456789"
              {...register("serialNumber")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.serialNumber &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.serialNumber && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.serialNumber.message?.toString()}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dimensions" className="text-sm font-medium">
              Medidas <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dimensions"
              placeholder="Ej. 50x30x20 cm"
              {...register("dimensions")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.dimensions &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.dimensions && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.dimensions.message?.toString()}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="features" className="text-sm font-medium">
            Características
          </Label>
          <Input
            id="features"
            placeholder="Ej. i7, 16GB RAM, 512GB SSD, pantalla táctil"
            {...register("features")}
            className="h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="chassisNumber" className="text-sm font-medium">
              Nro. Chasis
            </Label>
            <Input
              id="chassisNumber"
              placeholder="Ej. 9BWZZZ1JZX1234567"
              {...register("chassisNumber")}
              className="h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="engineNumber" className="text-sm font-medium">
              Nro. Motor
            </Label>
            <Input
              id="engineNumber"
              placeholder="Ej. ABC123456"
              {...register("engineNumber")}
              className="h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="licensePlate" className="text-sm font-medium">
              Placa
            </Label>
            <Input
              id="licensePlate"
              placeholder="Ej. ABC-123"
              {...register("licensePlate")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200 uppercase",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
              )}
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                const target = e.currentTarget;
                target.value = target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}