import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" /> Adquisición
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nro. Orden *</Label>
            <Input
              placeholder="Ingrese número de orden"
              {...register("purchaseOrder")}
              className={cn(errors.purchaseOrder && "border-destructive")}
            />
            {errors.purchaseOrder && (
              <p className="text-sm text-destructive">
                {errors.purchaseOrder.message?.toString()}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Valor Compra S/. *</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="Ingrese valor de compra"
              {...register("purchaseValue")}
              className={cn(errors.purchaseValue && "border-destructive")}
            />
            {errors.purchaseValue && (
              <p className="text-sm text-destructive">
                {errors.purchaseValue.message?.toString()}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            label="Fecha Compra *"
            date={purchaseDate}
            onSelect={(d: Date | undefined) => setValue("purchaseDate", d)}
            error={errors.purchaseDate}
          />
          <DatePicker
            label="Fecha Alta *"
            date={registrationDate}
            onSelect={(d: Date | undefined) => setValue("registrationDate", d)}
            error={errors.registrationDate}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo Doc. Alta *</Label>
            <Input
              placeholder="Ingrese tipo de documento"
              {...register("documentType")}
              className={cn(errors.documentType && "border-destructive")}
            />
            {errors.documentType && (
              <p className="text-sm text-destructive">
                {errors.documentType.message?.toString()}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Nro. Pecosa *</Label>
            <Input
              placeholder="Ingrese número de pecosa"
              {...register("pecosaNumber")}
              className={cn(errors.pecosaNumber && "border-destructive")}
            />
            {errors.pecosaNumber && (
              <p className="text-sm text-destructive">
                {errors.pecosaNumber.message?.toString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
