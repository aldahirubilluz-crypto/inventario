// src/components/activo/ubicacion-tab.tsx
import { Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UbicacionTabProps {
  activo: {
    location: string;
    costCenter: string;
    locationType: string;
    locationSubtype: string;
  };
}

export default function UbicacionTab({ activo }: UbicacionTabProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building className="h-5 w-5 text-primary" />
          Ubicación y Costo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Sede</p>
            <p className="font-medium">{activo.location}</p>
          </div>
          <div className="space-y-1">
            <p
              className="text-muted-�

System: foreground"
            >
              Centro de Costo
            </p>
            <p className="font-medium">{activo.costCenter}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Tipo de Ubicación</p>
            <p className="font-medium">{activo.locationType}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Subtipo</p>
            <p className="font-medium">{activo.locationSubtype}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
