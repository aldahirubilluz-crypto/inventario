// src/components/activo/tecnica-tab.tsx
import { Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TecnicaTabProps {
  activo: {
    dimensions: string;
    chassisNumber?: string;
    engineNumber?: string;
    licensePlate?: string;
  };
}

export default function TecnicaTab({ activo }: TecnicaTabProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cpu className="h-5 w-5 text-primary" />
          Especificaciones Técnicas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Dimensiones</p>
            <p className="font-medium">{activo.dimensions}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">N° Chasis</p>
            <p className="font-mono">{activo.chassisNumber || "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">N° Motor</p>
            <p className="font-mono">{activo.engineNumber || "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Placa</p>
            <p className="font-mono">{activo.licensePlate || "—"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}