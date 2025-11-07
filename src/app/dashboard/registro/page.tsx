"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Monitor, Cpu, Keyboard, Mouse, Building2, MapPin, User, CalendarIcon,
  Package, AlertCircle, CheckCircle, XCircle, Plus, X, Camera, QrCode,
  Shield, Wrench, FileText, Tag, Clock, Home, School, Hospital, Archive,
  Barcode, Hash, Globe, Smartphone, Laptop, Printer, Router, Server
} from "lucide-react";

const categorias = [
  { value: "computadoras", label: "Computadoras", icon: Laptop },
  { value: "perifericos", label: "Periféricos", icon: Keyboard },
  { value: "muebles", label: "Muebles", icon: Building2 },
  { value: "redes", label: "Redes y Comunicaciones", icon: Router },
  { value: "impresion", label: "Impresión", icon: Printer },
  { value: "servidores", label: "Servidores", icon: Server },
  { value: "otros", label: "Otros", icon: Package }
];

const ubicaciones = [
  { value: "edificio-a", label: "Edificio A - Piso 1", area: "Administración" },
  { value: "edificio-a-p2", label: "Edificio A - Piso 2", area: "Recursos Humanos" },
  { value: "edificio-b", label: "Edificio B - Sala de Juntas", area: "Dirección" },
  { value: "edificio-c", label: "Edificio C - Laboratorio", area: "TIC" },
  { value: "almacen-central", label: "Almacén Central", area: "Logística" },
  { value: "oficina-externa", label: "Oficina Externa - Campo", area: "Operaciones" }
];

const responsables = [
  { id: 1, nombre: "Ana María López", cargo: "Jefe de TIC", dependencia: "Dirección de Tecnología" },
  { id: 2, nombre: "Carlos Ruiz", cargo: "Coordinador de Mantenimiento", dependencia: "Logística" },
  { id: 3, nombre: "Laura Gómez", cargo: "Directora Administrativa", dependencia: "Administración" },
  { id: 4, nombre: "Miguel Torres", cargo: "Técnico de Soporte", dependencia: "TIC" }
];

const condiciones = [
  { value: "nuevo", label: "Nuevo", color: "bg-green-100 text-green-800" },
  { value: "bueno", label: "Bueno", color: "bg-blue-100 text-blue-800" },
  { value: "regular", label: "Regular", color: "bg-yellow-100 text-yellow-800" },
  { value: "malo", label: "Malo", color: "bg-red-100 text-red-800" },
  { value: "fuera-servicio", label: "Fuera de Servicio", color: "bg-gray-100 text-gray-800" }
];

export default function Page() {
  const [codigoInterno, setCodigoInterno] = useState("");
  const [nombreActivo, setNombreActivo] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ubicacionActual, setUbicacionActual] = useState("");
  const [responsable, setResponsable] = useState("");
  const [condicion, setCondicion] = useState("");
  const [fechaAdquisicion, setFechaAdquisicion] = useState<Date | undefined>();
  const [fechaUltimoMantenimiento, setFechaUltimoMantenimiento] = useState<Date | undefined>();
  const [proximoMantenimiento, setProximoMantenimiento] = useState<Date | undefined>();
  const [descripcion, setDescripcion] = useState("");
  const [especificaciones, setEspecificaciones] = useState("");
  const [notas, setNotas] = useState("");
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState("");
  const [tieneGarantia, setTieneGarantia] = useState(false);
  const [fechaFinGarantia, setFechaFinGarantia] = useState<Date | undefined>();
  const [esCritico, setEsCritico] = useState(false);
  const [requiereMantenimiento, setRequiereMantenimiento] = useState(false);

  const agregarEtiqueta = () => {
    if (nuevaEtiqueta.trim() && !etiquetas.includes(nuevaEtiqueta.trim())) {
      setEtiquetas([...etiquetas, nuevaEtiqueta.trim()]);
      setNuevaEtiqueta("");
    }
  };

  const eliminarEtiqueta = (tag: string) => {
    setEtiquetas(etiquetas.filter(t => t !== tag));
  };

  const generarCodigoInterno = () => {
    const prefix = categoria ? categoria.substring(0, 3).toUpperCase() : "ACT";
    const random = Math.floor(1000 + Math.random() * 9000);
    setCodigoInterno(`${prefix}-${random}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activo = {
      codigoInterno,
      nombreActivo,
      marca,
      modelo,
      numeroSerie,
      categoria,
      ubicacionActual,
      responsable,
      condicion,
      fechaAdquisicion: fechaAdquisicion?.toISOString(),
      fechaUltimoMantenimiento: fechaUltimoMantenimiento?.toISOString(),
      proximoMantenimiento: proximoMantenimiento?.toISOString(),
      descripcion,
      especificaciones,
      notas,
      etiquetas,
      tieneGarantia,
      fechaFinGarantia: fechaFinGarantia?.toISOString(),
      esCritico,
      requiereMantenimiento,
      fechaRegistro: new Date().toISOString()
    };
    console.log("Activo registrado:", activo);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Registro de Activo Fijo</h1>
          <p className="text-muted-foreground mt-1">Catálogo institucional de bienes públicos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <QrCode className="mr-2 h-4 w-4" />
            Escanear QR
          </Button>
          <Button variant="outline" size="sm">
            <Camera className="mr-2 h-4 w-4" />
            Subir Foto
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basico" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basico">Información Básica</TabsTrigger>
            <TabsTrigger value="ubicacion">Ubicación y Responsable</TabsTrigger>
            <TabsTrigger value="tecnico">Especificaciones Técnicas</TabsTrigger>
            <TabsTrigger value="mantenimiento">Mantenimiento y Garantía</TabsTrigger>
          </TabsList>

          <TabsContent value="basico" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Datos Principales del Activo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código Interno *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="codigo"
                        placeholder="AUTOGENERADO"
                        value={codigoInterno}
                        readOnly
                        className="bg-muted"
                      />
                      <Button type="button" size="icon" variant="outline" onClick={generarCodigoInterno}>
                        <Hash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Activo *</Label>
                    <Input
                      id="nombre"
                      placeholder="Ej: Computadora de Escritorio - Oficina 203"
                      value={nombreActivo}
                      onChange={(e) => setNombreActivo(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca *</Label>
                    <Input
                      id="marca"
                      placeholder="Dell, HP, Lenovo..."
                      value={marca}
                      onChange={(e) => setMarca(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      placeholder="XPS 13, EliteBook..."
                      value={modelo}
                      onChange={(e) => setModelo(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serie">Número de Serie</Label>
                    <div className="relative">
                      <Barcode className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="serie"
                        placeholder="ABC123XYZ"
                        className="pl-10"
                        value={numeroSerie}
                        onChange={(e) => setNumeroSerie(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría *</Label>
                    <Select value={categoria} onValueChange={setCategoria} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map(cat => {
                          const Icon = cat.icon;
                          return (
                            <SelectItem key={cat.value} value={cat.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {cat.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condicion">Condición Actual *</Label>
                    <Select value={condicion} onValueChange={setCondicion} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {condiciones.map(cond => (
                          <SelectItem key={cond.value} value={cond.value}>
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", cond.color)} />
                              {cond.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción Detallada</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Uso, características físicas, accesorios incluidos, etc."
                    rows={3}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ubicacion" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Ubicación en Tiempo Real y Responsable
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación Actual *</Label>
                    <Select value={ubicacionActual} onValueChange={setUbicacionActual} required>
                      <SelectTrigger>
                        <MapPin className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Seleccionar ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        {ubicaciones.map(ubi => (
                          <SelectItem key={ubi.value} value={ubi.value}>
                            <div className="space-y-1">
                              <div className="font-medium">{ubi.label}</div>
                              <div className="text-xs text-muted-foreground">{ubi.area}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsable">Responsable del Activo *</Label>
                    <Select value={responsable} onValueChange={setResponsable} required>
                      <SelectTrigger>
                        <User className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Seleccionar responsable" />
                      </SelectTrigger>
                      <SelectContent>
                        {responsables.map(resp => (
                          <SelectItem key={resp.id} value={resp.id.toString()}>
                            <div className="space-y-1">
                              <div className="font-medium">{resp.nombre}</div>
                              <div className="text-xs text-muted-foreground">{resp.cargo} • {resp.dependencia}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="critico" checked={esCritico} onCheckedChange={setEsCritico} />
                    <Label htmlFor="critico" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-orange-600" />
                        Activo Crítico para Operaciones
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="gps" />
                    <Label htmlFor="gps" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        Seguimiento GPS en Tiempo Real
                      </div>
                    </Label>
                  </div>
                </div>

                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Última actualización de ubicación:</span>
                      </div>
                      <span className="font-medium">Hace 5 minutos</span>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tecnico" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  Especificaciones Técnicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="especificaciones">Especificaciones Detalladas</Label>
                  <Textarea
                    id="especificaciones"
                    placeholder="Procesador: Intel i7-12700H\nRAM: 16GB DDR5\nAlmacenamiento: 512GB SSD\nSistema: Windows 11 Pro\n..."
                    rows={6}
                    value={especificaciones}
                    onChange={(e) => setEspecificaciones(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adquisicion">Fecha de Adquisición *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !fechaAdquisicion && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fechaAdquisicion ? format(fechaAdquisicion, "PPP") : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={fechaAdquisicion}
                          onSelect={setFechaAdquisicion}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Valor Estimado</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-sm text-muted-foreground">$</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-8"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Origen de Adquisición</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar origen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compra">Compra Directa</SelectItem>
                        <SelectItem value="donacion">Donación</SelectItem>
                        <SelectItem value="transferencia">Transferencia Interna</SelectItem>
                        <SelectItem value="herencia">Herencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Etiquetas Personalizadas</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ej: equipo-directivo, backup-diario..."
                      value={nuevaEtiqueta}
                      onChange={(e) => setNuevaEtiqueta(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), agregarEtiqueta())}
                    />
                    <Button type="button" size="icon" onClick={agregarEtiqueta}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {etiquetas.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => eliminarEtiqueta(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mantenimiento" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  Mantenimiento y Garantía
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="mantenimiento" checked={requiereMantenimiento} onCheckedChange={setRequiereMantenimiento} />
                  <Label htmlFor="mantenimiento" className="cursor-pointer">
                    Requiere Mantenimiento Periódico
                  </Label>
                </div>

                {requiereMantenimiento && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-2">
                      <Label>Último Mantenimiento</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn("w-full justify-start text-left font-normal", !fechaUltimoMantenimiento && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fechaUltimoMantenimiento ? format(fechaUltimoMantenimiento, "PPP") : "Seleccionar"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={fechaUltimoMantenimiento}
                            onSelect={setFechaUltimoMantenimiento}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Próximo Mantenimiento</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn("w-full justify-start text-left font-normal", !proximoMantenimiento && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {proximoMantenimiento ? format(proximoMantenimiento, "PPP") : "Seleccionar"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={proximoMantenimiento}
                            onSelect={setProximoMantenimiento}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch id="garantia" checked={tieneGarantia} onCheckedChange={setTieneGarantia} />
                  <Label htmlFor="garantia" className="cursor-pointer">
                    Tiene Garantía Activa
                  </Label>
                </div>

                {tieneGarantia && (
                  <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                    <Label>Fecha de Vencimiento de Garantía</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !fechaFinGarantia && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fechaFinGarantia ? format(fechaFinGarantia, "PPP") : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={fechaFinGarantia}
                          onSelect={setFechaFinGarantia}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notas">Notas de Mantenimiento / Observaciones</Label>
                  <Textarea
                    id="notas"
                    placeholder="Historial de reparaciones, fallas comunes, recomendaciones..."
                    rows={4}
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex gap-2">
            <Button type="button" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Guardar como Borrador
            </Button>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </div>
          <Button type="submit" size="lg" className="gap-2">
            <CheckCircle className="h-5 w-5" />
            Registrar Activo Fijo
          </Button>
        </div>
      </form>
    </div>
  );
}