// app/dashboard/almacen/[id]/page.tsx
import { generarReportePDF, getActivoById } from "@/actions/almacen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  MapPin,
  User,
  Calendar,
  FileText,
  ArrowLeft,
  Clock,
  CheckCircle,
  Cpu,
  Building,
  DollarSign,
  Shield,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivoCompleto } from "@/types/almacen";
import { saveAs } from "file-saver";
import ReportButton from "@/components/report-button";
import { cn } from "@/lib/utils";
export default async function Detalles({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (isNaN(numericId)) notFound();

  const activo = await getActivoById(numericId);
  if (!activo) notFound();

  const formatDate = (date: string) => format(new Date(date), "dd MMMM yyyy");

  const isAssigned = !!activo.finalEmployee;

  const reportpdf = async (activo: ActivoCompleto) => {
    try {
      const base64PDF = await generarReportePDF(activo);

      const binaryString = atob(base64PDF);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });

      saveAs(blob, `Reporte_${activo.patrimonialCode}.pdf`);
    } catch (error) {
      console.error("Error generando el reporte:", error);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/dashboard/almacen">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
              <Package className="h-9 w-9 text-primary" />
              {activo.patrimonialCode}
            </h1>
            <p className="text-muted-foreground mt-1">{activo.description}</p>
          </div>
        </div>

        <ReportButton activo={activo} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* ESTADO */}
        <Card className="overflow-hidden border-l-4 border-l-primary">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Estado
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {isAssigned ? "Asignado" : "Disponible"}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-medium border-0",
                isAssigned
                  ? "bg-primary/10 text-primary"
                  : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              )}
            >
              {isAssigned ? (
                <MapPin className="h-3 w-3" />
              ) : (
                <CheckCircle className="h-3 w-3" />
              )}
            </Badge>
          </div>
        </Card>

        {/* UBICACIÓN */}
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-primary/10 p-2">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Ubicación
              </p>
              <p className="text-sm font-semibold text-foreground truncate">
                {activo.location}
              </p>
              {activo.locationSubtype && (
                <p className="text-xs text-muted-foreground truncate">
                  {activo.locationType} • {activo.locationSubtype}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* ÚLTIMA ACTUALIZACIÓN */}
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-muted p-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Actualización
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(activo.updatedAt)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="general" className="text-xs md:text-sm">
            General
          </TabsTrigger>
          <TabsTrigger value="adquisicion" className="text-xs md:text-sm">
            Adquisición
          </TabsTrigger>
          <TabsTrigger value="tecnica" className="text-xs md:text-sm">
            Técnica
          </TabsTrigger>
          <TabsTrigger value="ubicacion" className="text-xs md:text-sm">
            Ubicación
          </TabsTrigger>
        </TabsList>

        {/* === GENERAL === */}
        <TabsContent value="general" className="space-y-5 mt-6">
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
                    <p className="text-xs font-medium text-muted-foreground">
                      Código Patrimonial
                    </p>
                    <p className="font-mono text-sm font-semibold text-foreground">
                      {activo.patrimonialCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Etiqueta Anterior
                    </p>
                    <p className="text-sm">{activo.oldLabel || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Marca / Modelo
                    </p>
                    <p className="font-medium">
                      {activo.brand} {activo.model}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Responsable
                    </p>
                    <p className="flex items-center gap-2 font-medium">
                      <User className="h-4 w-4 text-primary" />
                      {activo.responsibleEmployee}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Empleado Final
                    </p>
                    <p className="font-medium">
                      {activo.finalEmployee ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {activo.finalEmployee}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Sin asignar
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Características
                    </p>
                    <p className="text-sm">
                      {activo.features || "Sin especificar"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      N° Serie
                    </p>
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
        </TabsContent>

        {/* === ADQUISICIÓN === */}
        <TabsContent value="adquisicion" className="mt-6">
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
                    <p className="text-xs font-medium text-muted-foreground">
                      N° Orden de Compra
                    </p>
                    <p className="font-medium">{activo.purchaseOrder}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Valor de Compra
                    </p>
                    <p className="text-xl font-bold text-primary">
                      S/ {activo.purchaseValue}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Fecha de Compra
                    </p>
                    <p className="flex items-center gap-2 font-medium">
                      <Calendar className="h-4 w-4 text-primary" />
                      {formatDate(activo.purchaseDate)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Tipo de Documento
                    </p>
                    <p className="font-medium">{activo.documentType}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      N° PECOSA
                    </p>
                    <p className="font-mono">{activo.pecosaNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Fecha de Registro
                    </p>
                    <p className="flex items-center gap-2 font-medium">
                      <Calendar className="h-4 w-4 text-primary" />
                      {formatDate(activo.registrationDate)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === TÉCNICA === */}
        <TabsContent value="tecnica" className="mt-6">
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
        </TabsContent>

        {/* === UBICACIÓN === */}
        <TabsContent value="ubicacion" className="mt-6">
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
                  <p className="text-muted-foreground">Centro de Costo</p>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
