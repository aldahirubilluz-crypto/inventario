"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { saveAs } from "file-saver";
import { generarReportePDF } from "@/actions/almacen";
import { ActivoCompleto } from "@/types/almacen";

interface ReportButtonProps {
  activo: ActivoCompleto;
}

export default function ReportButton({ activo }: ReportButtonProps) {
  const reportpdf = async () => {
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
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={reportpdf}
    >
      <FileText className="h-4 w-4" />
      Reporte
    </Button>
  );
}
