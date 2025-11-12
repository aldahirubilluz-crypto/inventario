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
import ReportButton from "@/components/report-button";
import ActivoDetailTabs from "@/components/detalles/activo-detail-tabs";

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

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
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
          </div>
        </Card>

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

      <div>
        <ActivoDetailTabs activo={activo} formatDate={formatDate} />
      </div>

    </div>
  );
}
