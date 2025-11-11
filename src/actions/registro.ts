"use server";

import { prisma } from "@/config/prisma";
import { AssetForm } from "@/types/registro";
import { Prisma } from "@prisma/client";

// Helper: convierte a MAYÚSCULAS y garantiza string
const toUpper = (value: string | undefined): string =>
  (value ?? "").toUpperCase();

export async function createAsset(data: AssetForm) {
  try {
    const asset = await prisma.asset.create({
      data: {
        oldLabel: toUpper(data.oldLabel),
        patrimonialCode: toUpper(data.patrimonialCode),
        description: toUpper(data.description),
        purchaseOrder: toUpper(data.purchaseOrder),
        purchaseValue: new Prisma.Decimal(data.purchaseValue),
        purchaseDate: data.purchaseDate,
        documentType: toUpper(data.documentType),
        pecosaNumber: toUpper(data.pecosaNumber),
        registrationDate: data.registrationDate,
        location: toUpper(data.location),
        costCenter: toUpper(data.costCenter),
        responsibleEmployee: toUpper(data.responsibleEmployee),
        finalEmployee: toUpper(data.finalEmployee),
        locationType: toUpper(data.locationType),
        locationSubtype: toUpper(data.locationSubtype),
        features: data.features ? toUpper(data.features) : undefined,
        model: toUpper(data.model),
        dimensions: toUpper(data.dimensions),
        serialNumber: toUpper(data.serialNumber),
        brand: toUpper(data.brand),
        chassisNumber: data.chassisNumber
          ? toUpper(data.chassisNumber)
          : undefined,
        engineNumber: data.engineNumber
          ? toUpper(data.engineNumber)
          : undefined,
        licensePlate: data.licensePlate
          ? toUpper(data.licensePlate)
          : undefined,
      },
    });

    return {
      ...asset,
      purchaseValue: asset.purchaseValue.toString(),
    };
  } catch (error: any) {
    console.error("Error creando activo:", error);

    if (error.code === "P2002") {
      const target = error.meta?.target as string[] | undefined;
      if (target?.includes("patrimonialCode")) {
        throw new Error("Ya existe un activo con este Código Patrimonial.");
      }
      if (target?.includes("oldLabel")) {
        throw new Error("Ya existe un activo con esta Pre-Etiqueta.");
      }
    }

    throw new Error("No se pudo registrar el activo. Intenta nuevamente.");
  }
}
