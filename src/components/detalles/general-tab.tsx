// src/components/activo/general-tab.tsx
import { Package, User, CheckCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GeneralTabProps {
  activo: {
    patrimonialCode: string;
    oldLabel?: string;
    brand: string;
    model: string;
    responsibleEmployee: string;
    finalEmployee?: string;
    features?: string;
    serialNumber: string;
    description?: string;
  };
}

export default function GeneralTab({ activo }: GeneralTabProps) {
  return (
    <Card className="gap-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5 text-primary" />
          Información Básica
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Código Patrimonial</p>
              <p className="font-mono text-sm font-semibold text-foreground">{activo.patrimonialCode}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Etiqueta Anterior</p>
              <p className="text-sm">{activo.oldLabel || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Marca / Modelo</p>
              <p className="font-medium">{activo.brand} {activo.model}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Responsable</p>
              <p className="flex items-center gap-2 font-medium">
                <User className="h-4 w-4 text-primary" />
                {activo.responsibleEmployee}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Empleado Final</p>
              <p className="font-medium">
                {activo.finalEmployee ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {activo.finalEmployee}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Sin asignar</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Características</p>
              <p className="text-sm">{activo.features || "Sin especificar"}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">N° Serie</p>
              <p className="font-mono text-sm">{activo.serialNumber}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Descripción Completa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground">
          {activo.description || "Sin descripción"}
        </p>
      </CardContent>
    </Card>
  );
}