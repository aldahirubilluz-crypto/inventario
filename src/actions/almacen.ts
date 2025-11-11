//src/actions/almacen.tsx
"use server";

import { prisma } from "@/config/prisma";
import { ActivoCompleto, ActivoSimple } from "@/types/almacen";
import { renderToBuffer } from "@react-pdf/renderer";
import ActivoReportePDF from "@/components/pdf/activo-reporte-pdf";

export async function generarReportePDF(activo: ActivoCompleto) {
  const component = ActivoReportePDF({ activo });
  
  const buffer = await renderToBuffer(component);
  
  const base64 = buffer.toString('base64');
  
  return base64;
}

export async function getActivos(): Promise<ActivoSimple[]> {
  try {
    const assets = await prisma.asset.findMany({
      select: {
        id: true,
        patrimonialCode: true,
        description: true,
        documentType: true,
        responsibleEmployee: true,
        purchaseValue: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    return assets.map((asset) => ({
      id: asset.id,
      codigo: asset.patrimonialCode,
      descripcion: asset.description,
      responsable: asset.responsibleEmployee,
      documentType: asset.documentType,
      valor: asset.purchaseValue.toString(),
    }));
  } catch (error) {
    console.error("Error cargando activos:", error);
    return [];
  }
}

export async function getActivoById(id: number): Promise<ActivoCompleto | null> {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!asset) return null;

    return {
      id: asset.id,
      oldLabel: asset.oldLabel,
      patrimonialCode: asset.patrimonialCode,
      description: asset.description,
      purchaseOrder: asset.purchaseOrder,
      purchaseValue: asset.purchaseValue.toString(),
      purchaseDate: asset.purchaseDate.toISOString().split("T")[0],
      documentType: asset.documentType,
      pecosaNumber: asset.pecosaNumber,
      registrationDate: asset.registrationDate.toISOString().split("T")[0],
      location: asset.location,
      costCenter: asset.costCenter,
      responsibleEmployee: asset.responsibleEmployee,
      finalEmployee: asset.finalEmployee || undefined,
      locationType: asset.locationType,
      locationSubtype: asset.locationSubtype,
      features: asset.features || undefined,
      model: asset.model,
      dimensions: asset.dimensions,
      serialNumber: asset.serialNumber,
      brand: asset.brand,
      chassisNumber: asset.chassisNumber || undefined,
      engineNumber: asset.engineNumber || undefined,
      licensePlate: asset.licensePlate || undefined,
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error cargando activo:", error);
    return null;
  }
}

