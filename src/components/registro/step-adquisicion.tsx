import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import DatePicker from "./date-picker";

export default function StepAdquisicion({
  register,
  setValue,
  purchaseDate,
  registrationDate,
  errors,
}: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <DollarSign className="h-5 w-5 text-primary" />
          Adquisición
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Información esencial de adquisitivo
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="purchaseOrder" className="text-sm font-medium">
              Nro. Orden <span className="text-destructive">*</span>
            </Label>
            <Input
              id="purchaseOrder"
              placeholder="Ej. 1234"
              {...register("purchaseOrder")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.purchaseOrder &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.purchaseOrder && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.purchaseOrder.message?.toString()}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchaseOrder" className="text-sm font-medium">
              Valor Compra S/. <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              step="0.01"
              placeholder="Ingrese valor de compra"
              {...register("purchaseValue")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.purchaseOrder &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.purchaseOrder && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.purchaseOrder.message?.toString()}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DatePicker
            label="Fecha Compra *"
            date={purchaseDate}
            onSelect={(d: Date | undefined) => setValue("purchaseDate", d)}
            error={errors.purchaseDate}
            placeholder="Seleccione fecha"
            maxDate={registrationDate || undefined}
          />
          <DatePicker
            label="Fecha Alta *"
            date={registrationDate}
            onSelect={(d: Date | undefined) => {
              setValue("registrationDate", d);
              if (purchaseDate && d && purchaseDate > d) {
                setValue("purchaseDate", undefined);
              }
            }}
            error={errors.registrationDate}
            placeholder="Seleccione fecha"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="documentType" className="text-sm font-medium">
              Tipo Doc. Alta <span className="text-destructive">*</span>
            </Label>
            <Input
              id="documentType"
              placeholder="Ej. 046"
              {...register("documentType")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.documentType &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.documentType && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.documentType.message?.toString()}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pecosaNumber" className="text-sm font-medium">
              Nro. Pecosa <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pecosaNumber"
              placeholder="Ej. 2700"
              {...register("pecosaNumber")}
              className={cn(
                "h-11 text-sm placeholder:text-muted-foreground/70 transition-all duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                errors.pecosaNumber &&
                  "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
              )}
            />
            {errors.pecosaNumber && (
              <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.pecosaNumber.message?.toString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
