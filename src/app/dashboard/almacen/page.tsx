// app/dashboard/almacen/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Package,
  Search,
  Building2,
  CheckCircle,
  Archive,
  Eye,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getActivos } from "@/actions/almacen";
import { ActivoSimple } from "@/types/almacen";

export default function Almacen() {
  const [activos, setActivos] = useState<ActivoSimple[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await getActivos();
      console.log(data);
      
      setActivos(data);
      setIsLoading(false);
    };
    load();
  }, []);

  // FILTRADO solo por campos reales
  const filtered = activos.filter(
    (a) =>
      a.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estado simple: si tiene responsable → asignado, sino → disponible
  const getEstadoBadge = (tieneResponsable: boolean) => {
    return tieneResponsable ? (
      <Badge className="bg-blue-100 text-blue-800 text-xs">
        <CheckCircle className="w-3 h-3 mr-1" />
        Asignado
      </Badge>
    ) : (
      <Badge className="bg-green-100 text-green-800 text-xs">
        <Package className="w-3 h-3 mr-1" />
        Disponible
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" />
            Almacén
          </h1>
          <p className="text-sm text-muted-foreground">
            {activos.length} activos registrados
          </p>
        </div>
        <Link href="/dashboard/registro">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Nuevo
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código, descripción, responsable o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-28">Código</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Responsable
                    </TableHead>
                    <TableHead className="w-32">Estado</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Valor
                    </TableHead>
                    <TableHead className="w-20 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-12 text-muted-foreground"
                      >
                        <Package className="h-10 w-10 mx-auto mb-3 opacity-50" />
                        <p>No se encontraron activos</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((activo) => (
                      <TableRow key={activo.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {activo.codigo}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {activo.descripcion}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">
                          {activo.responsable}
                        </TableCell>
                        <TableCell>
                          {getEstadoBadge(!!activo.responsable)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                          S/ {activo.valor}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/almacen/${activo.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
