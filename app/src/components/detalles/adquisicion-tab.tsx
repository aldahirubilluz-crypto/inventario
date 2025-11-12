// src/components/activo/adquisicion-tab.tsx
import { DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdquisicionTabProps {
  activo: {
    purchaseOrder: string;
    purchaseValue: string;
    purchaseDate: string;
    documentType: string;
    pecosaNumber: string;
    registrationDate: string;
  };
  formatDate: (date: string) => string;
}

export default function AdquisicionTab({ activo, formatDate }: AdquisicionTabProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5 text-primary" />
          Datos de Adquisición
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">N° Orden de Compra</p>
              <p className="font-medium">{activo.purchaseOrder}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Valor de Compra</p>
              <p className="text-xl font-bold text-primary">S/ {activo.purchaseValue}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Fecha de Compra</p>
              <p className="flex items-center gap-2 font-medium">
                <Calendar className="h-4 w-4 text-primary" />
                {formatDate(activo.purchaseDate)}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tipo de Documento</p>
              <p className="font-medium">{activo.documentType}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">N° PECOSA</p>
              <p className="font-mono">{activo.pecosaNumber}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Fecha de Registro</p>
              <p className="flex items-center gap-2 font-medium">
                <Calendar className="h-4 w-4 text-primary" />
                {formatDate(activo.registrationDate)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}