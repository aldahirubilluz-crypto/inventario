// src/components/almacen/detalles.tsx
"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, MapPin, User, Calendar, Wrench, Shield, FileText, ArrowLeft, QrCode, Camera, Clock, AlertCircle, CheckCircle, Tag, Cpu } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

interface Activo {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  ubicacion: string;
  estado: "disponible" | "asignado" | "bajo-mantenimiento" | "fuera-servicio";
  responsable?: string;
  ultimaActualizacion: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  fechaAdquisicion: string;
  fechaUltimoMantenimiento?: string;
  proximoMantenimiento?: string;
  descripcion: string;
  especificaciones: string;
  notas: string;
  etiquetas: string[];
  tieneGarantia: boolean;
  fechaFinGarantia?: string;
  esCritico: boolean;
  requiereMantenimiento: boolean;
}

const activoMock: Activo = {
  id: "1",
  codigo: "COMP-1001",
  nombre: "Laptop Dell XPS 13",
  categoria: "Computadoras",
  ubicacion: "Almacén Central - Pasillo A3",
  estado: "disponible",
  ultimaActualizacion: "2025-04-01",
  marca: "Dell",
  modelo: "XPS 13 9310",
  numeroSerie: "ABC123XYZ",
  fechaAdquisicion: "2023-06-15",
  fechaUltimoMantenimiento: "2025-01-10",
  proximoMantenimiento: "2025-07-10",
  descripcion: "Laptop de alto rendimiento para uso administrativo. Incluye cargador original y funda protectora.",
  especificaciones: "Procesador: Intel Core i7-1185G7\nRAM: 16GB LPDDR4x\nAlmacenamiento: 512GB SSD NVMe\nPantalla: 13.4\" 4K OLED táctil\nSistema: Windows 11 Pro",
  notas: "Equipo asignado a Dirección de TIC. Revisar batería cada 6 meses.",
  etiquetas: ["alto-rendimiento", "direccion-tic", "portatil"],
  tieneGarantia: true,
  fechaFinGarantia: "2026-06-15",
  esCritico: true,
  requiereMantenimiento: true
};

export default function Detalles() {
  const params = useParams();
  const id = params?.id as string;

  // Simulación de carga de datos
  const activo = activoMock;

  if (!activo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Activo no encontrado</h2>
          <p className="text-muted-foreground mt-2">El ID {id} no corresponde a ningún activo registrado.</p>
          <Button className="mt-4" asChild>
            <a href="/dashboard/almacen">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Almacén
            </a>
          </Button>
        </Card>
      </div>
    );
  }

  const getEstadoBadge = (estado: Activo["estado"]) => {
    switch (estado) {
      case "disponible":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Disponible</Badge>;
      case "asignado":
        return <Badge className="bg-blue-100 text-blue-800"><MapPin className="w-3 h-3 mr-1" />Asignado</Badge>;
      case "bajo-mantenimiento":
        return <Badge className="bg-yellow-100 text-yellow-800"><Wrench className="w-3 h-3 mr-1" />En Mantenimiento</Badge>;
      case "fuera-servicio":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Fuera de Servicio</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <a href="/dashboard/almacen">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              {activo.codigo}
            </h1>
            <p className="text-muted-foreground">{activo.nombre}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <QrCode className="mr-2 h-4 w-4" />
            Ver QR
          </Button>
          <Button variant="outline" size="sm">
            <Camera className="mr-2 h-4 w-4" />
            Fotos
          </Button>
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Generar Reporte
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estado Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {getEstadoBadge(activo.estado)}
              {activo.esCritico && (
                <Badge variant="destructive" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Crítico
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ubicación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{activo.ubicacion}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Última Actualización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(activo.ultimaActualizacion), "dd MMM yyyy, HH:mm")}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="tecnica">Especificaciones</TabsTrigger>
          <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Detalles del Activo
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Nombre Completo</Label>
                  <p className="font-medium">{activo.nombre}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Marca / Modelo</Label>
                  <p className="font-medium">{activo.marca} {activo.modelo}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Número de Serie</Label>
                  <p className="font-mono text-sm">{activo.numeroSerie}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Categoría</Label>
                  <Badge variant="outline">{activo.categoria}</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Fecha de Adquisición</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(activo.fechaAdquisicion), "dd MMMM yyyy")}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Responsable Actual</Label>
                  <p className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {activo.responsable || "Sin asignar"}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Garantía</Label>
                  <p className="font-medium flex items-center gap-2">
                    {activo.tieneGarantia ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Hasta {activo.fechaFinGarantia && format(new Date(activo.fechaFinGarantia), "dd MMM yyyy")}
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        Sin garantía
                      </>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Descripción
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-line">{activo.descripcion}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Etiquetas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {activo.etiquetas.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                {activo.etiquetas.length === 0 && (
                  <p className="text-sm text-muted-foreground">Sin etiquetas</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tecnica" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                Especificaciones Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
                {activo.especificaciones}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mantenimiento" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Mantenimiento Programado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs text-muted-foreground">Último Mantenimiento</Label>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {activo.fechaUltimoMantenimiento ? format(new Date(activo.fechaUltimoMantenimiento), "dd MMMM yyyy") : "No registrado"}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Próximo Mantenimiento</Label>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {activo.proximoMantenimiento ? format(new Date(activo.proximoMantenimiento), "dd MMMM yyyy") : "No programado"}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Notas de Mantenimiento</Label>
                <p className="text-sm mt-1 whitespace-pre-line">{activo.notas || "Sin observaciones"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Historial de Movimientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Ingreso al inventario</p>
                    <p className="text-sm text-muted-foreground">Registrado por sistema</p>
                  </div>
                  <span className="text-sm">15 Jun 2023</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Asignación inicial</p>
                    <p className="text-sm text-muted-foreground">Asignado a Ana López</p>
                  </div>
                  <span className="text-sm">20 Jun 2023</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Mantenimiento preventivo</p>
                    <p className="text-sm text-muted-foreground">Limpieza y actualización</p>
                  </div>
                  <span className="text-sm">10 Ene 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}