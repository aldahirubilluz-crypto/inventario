"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Package,
  Search,
  Filter,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Building2,
  Archive,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface Activo {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  ubicacion: string;
  estado: "disponible" | "asignado" | "bajo-mantenimiento" | "fuera-servicio";
  responsable?: string;
  ultimaActualizacion: string;
}

const activos: Activo[] = [
  {
    id: "1",
    codigo: "COMP-1001",
    nombre: "Laptop Dell XPS 13",
    categoria: "Computadoras",
    ubicacion: "Almacén Central",
    estado: "disponible",
    ultimaActualizacion: "2025-04-01",
  },
  {
    id: "2",
    codigo: "MUEB-2005",
    nombre: "Escritorio Ejecutivo",
    categoria: "Muebles",
    ubicacion: "Almacén Central",
    estado: "asignado",
    responsable: "Ana López",
    ultimaActualizacion: "2025-03-28",
  },
  {
    id: "3",
    codigo: "PER-3002",
    nombre: 'Monitor 27" 4K',
    categoria: "Periféricos",
    ubicacion: "Oficina Principal",
    estado: "asignado",
    responsable: "Carlos Ruiz",
    ultimaActualizacion: "2025-04-02",
  },
  {
    id: "4",
    codigo: "COMP-1002",
    nombre: "PC de Escritorio i7",
    categoria: "Computadoras",
    ubicacion: "Almacén Norte",
    estado: "bajo-mantenimiento",
    ultimaActualizacion: "2025-03-30",
  },
  {
    id: "5",
    codigo: "MUEB-2010",
    nombre: "Silla Ergonómica",
    categoria: "Muebles",
    ubicacion: "Almacén Sur",
    estado: "disponible",
    ultimaActualizacion: "2025-04-03",
  },
  {
    id: "6",
    codigo: "RED-4001",
    nombre: "Switch 24 Puertos",
    categoria: "Redes",
    ubicacion: "Almacén Central",
    estado: "disponible",
    ultimaActualizacion: "2025-03-31",
  },
  {
    id: "7",
    codigo: "MUEB-2015",
    nombre: "Archivador 4 Gavetas",
    categoria: "Muebles",
    ubicacion: "Almacén Sur",
    estado: "fuera-servicio",
    ultimaActualizacion: "2025-02-15",
  },
  {
    id: "8",
    codigo: "PER-3010",
    nombre: "Teclado Mecánico",
    categoria: "Periféricos",
    ubicacion: "Oficina Principal",
    estado: "asignado",
    responsable: "Laura Gómez",
    ultimaActualizacion: "2025-04-01",
  },
  {
    id: "9",
    codigo: "COMP-1003",
    nombre: "Laptop Lenovo ThinkPad",
    categoria: "Computadoras",
    ubicacion: "Almacén Norte",
    estado: "disponible",
    ultimaActualizacion: "2025-04-03",
  },
  {
    id: "10",
    codigo: "MUEB-2020",
    nombre: "Silla de Conferencia",
    categoria: "Muebles",
    ubicacion: "Sala de Juntas",
    estado: "asignado",
    responsable: "Miguel Torres",
    ultimaActualizacion: "2025-03-29",
  },
];

const ITEMS_PER_PAGE = 5;

const COLUMNS = [
  { key: "codigo", label: "Código", default: true },
  { key: "nombre", label: "Nombre del Activo", default: true },
  { key: "categoria", label: "Categoría", default: true },
  { key: "ubicacion", label: "Ubicación", default: true },
  { key: "estado", label: "Estado", default: true },
  { key: "responsable", label: "Responsable", default: false },
  { key: "acciones", label: "Acciones", default: true },
] as const;

type ColumnKey = (typeof COLUMNS)[number]["key"];

export default function Almacen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(
    COLUMNS.filter((c) => c.default).map((c) => c.key)
  );

  const filteredActivos = useMemo(() => {
    return activos.filter((activo) => {
      const matchesSearch =
        activo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activo.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredActivos.length / ITEMS_PER_PAGE);
  const paginatedActivos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredActivos.slice(start, end);
  }, [filteredActivos, currentPage]);

  const getEstadoBadge = (estado: Activo["estado"]) => {
    switch (estado) {
      case "disponible":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Disponible
          </Badge>
        );
      case "asignado":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <MapPin className="w-3 h-3 mr-1" />
            Asignado
          </Badge>
        );
      case "bajo-mantenimiento":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            En Mantenimiento
          </Badge>
        );
      case "fuera-servicio":
        return (
          <Badge className="bg-red-100 text-red-800">
            <Archive className="w-3 h-3 mr-1" />
            Fuera de Servicio
          </Badge>
        );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Almacén
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestión y visualización de activos almacenados
          </p>
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-48">
              <Settings className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Columnas" />
            </SelectTrigger>
            <SelectContent>
              {COLUMNS.map((col) => (
                <div key={col.key} className="flex items-center space-x-2 p-2">
                  <Checkbox
                    id={col.key}
                    checked={visibleColumns.includes(col.key)}
                    onCheckedChange={() => toggleColumn(col.key)}
                  />
                  <label
                    htmlFor={col.key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {col.label}
                  </label>
                </div>
              ))}
            </SelectContent>
          </Select>
          <Link href="/dashboard/registro" className="ml-auto">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ingreso
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por código, nombre o ubicación..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.includes("codigo") && (
                    <TableHead className="w-32">Código</TableHead>
                  )}
                  {visibleColumns.includes("nombre") && (
                    <TableHead>Nombre del Activo</TableHead>
                  )}
                  {visibleColumns.includes("categoria") && (
                    <TableHead className="hidden md:table-cell">
                      Categoría
                    </TableHead>
                  )}
                  {visibleColumns.includes("ubicacion") && (
                    <TableHead className="hidden lg:table-cell">
                      Ubicación
                    </TableHead>
                  )}
                  {visibleColumns.includes("estado") && (
                    <TableHead>Estado</TableHead>
                  )}
                  {visibleColumns.includes("responsable") && (
                    <TableHead className="hidden sm:table-cell">
                      Responsable
                    </TableHead>
                  )}
                  {visibleColumns.includes("acciones") && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedActivos.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumns.length}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <Package className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                      <p>No se encontraron activos con los filtros aplicados</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedActivos.map((activo) => (
                    <TableRow
                      key={activo.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      {visibleColumns.includes("codigo") && (
                        <TableCell className="font-medium">
                          {activo.codigo}
                        </TableCell>
                      )}
                      {visibleColumns.includes("nombre") && (
                        <TableCell className="font-medium">
                          {activo.nombre}
                        </TableCell>
                      )}
                      {visibleColumns.includes("categoria") && (
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {activo.categoria}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.includes("ubicacion") && (
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {activo.ubicacion}
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.includes("estado") && (
                        <TableCell>{getEstadoBadge(activo.estado)}</TableCell>
                      )}
                      {visibleColumns.includes("responsable") && (
                        <TableCell className="hidden sm:table-cell">
                          {activo.responsable ? (
                            <span className="text-sm">
                              {activo.responsable}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </TableCell>
                      )}
                      {visibleColumns.includes("acciones") && (
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/almacen/${activo.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Detalles
                            </Link>
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando{" "}
            <span className="font-medium">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredActivos.length)}
            </span>{" "}
            de <span className="font-medium">{filteredActivos.length}</span>{" "}
            activos
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
