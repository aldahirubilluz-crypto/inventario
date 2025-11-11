import { Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function StepDatosBasicos({ register, errors }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Package className="h-5 w-5 text-primary" />
          Datos Básicos
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Información esencial del activo fijo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="oldLabel" className="text-sm font-medium">
              Pre Etiqueta <span className="text-destructive">*</span>
            </Label>
            <Input
              id="oldLabel"
              placeholder="Ej. 12456"
              {...register("oldLabel")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.oldLabel &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.oldLabel && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.oldLabel.message?.toString()}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="patrimonialCode" className="text-sm font-medium">
              Código Patrimonial <span className="text-destructive">*</span>
            </Label>
            <Input
              id="patrimonialCode"
              placeholder="Ej. 675011300013"
              {...register("patrimonialCode")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.patrimonialCode &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.patrimonialCode && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.patrimonialCode.message?.toString()}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-sm font-medium">
            Descripción <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe detalladamente el activo fijo..."
            {...register("description")}
            className={cn(
              "min-h-[100px] max-h-[200px] resize-none text-sm placeholder:text-muted-foreground/70",
              "transition-all duration-200",
              "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
              errors.description &&
                "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
            )}
            onInput={(e) => {
              const target = e.currentTarget;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
          />
          {errors.description && (
            <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
              {errors.description.message?.toString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}