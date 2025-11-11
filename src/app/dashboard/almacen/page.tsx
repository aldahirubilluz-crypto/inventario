// app/dashboard/almacen/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
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
  Eye,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { getActivos } from "@/actions/almacen";
import { ActivoSimple } from "@/types/almacen";

const ITEMS_PER_PAGE = 7;

export default function Almacen() {
  const [activos, setActivos] = useState<ActivoSimple[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await getActivos();
      setActivos(data);
      setIsLoading(false);
    };
    load();
  }, []);

  // Filtrado
  const filtered = useMemo(() => {
    return activos.filter(
      (a) =>
        a.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.documentType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activos, searchTerm]);

  // Paginación
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filtered.slice(start, end);
  }, [filtered, currentPage]);

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
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" />
            Almacén
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} de {activos.length} activos
          </p>
        </div>
        <Link href="/dashboard/registro">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Nuevo
          </Button>
        </Link>
      </div>

      {/* BUSCADOR + TABLA */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código, descripción, responsable o documento..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Resetear página al buscar
              }}
              className="max-w-sm"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-28">Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="hidden sm:table-cell">Responsable</TableHead>
                      <TableHead className="w-32">Estado</TableHead>
                      <TableHead className="hidden md:table-cell">Valor</TableHead>
                      <TableHead className="w-20 text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-lg">No se encontraron activos</p>
                          {searchTerm && (
                            <p className="text-sm mt-2">
                              Intenta con otros términos
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginated.map((activo) => (
                        <TableRow key={activo.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{activo.codigo}</TableCell>
                          <TableCell className="max-w-xs truncate">{activo.descripcion}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{activo.responsable}</TableCell>
                          <TableCell>{getEstadoBadge(!!activo.responsable)}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm">S/ {activo.valor}</TableCell>
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

              {/* PAGINACIÓN */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
                  <p className="text-xs text-muted-foreground">
                    Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                      if (!showPage) return null;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="h-8 w-8"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    }).filter(Boolean)}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2 text-xs text-muted-foreground">...</span>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}