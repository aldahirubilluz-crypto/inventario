"use server";

import { prisma } from "@/config/prisma";
import { AssetForm } from "@/types/registro";
import { Prisma } from "@prisma/client";

export async function createAsset(data: AssetForm) {
  try {
    const asset = await prisma.asset.create({
      data: {
        oldLabel: data.oldLabel,
        patrimonialCode: data.patrimonialCode,
        description: data.description,
        purchaseOrder: data.purchaseOrder,
        purchaseValue: new Prisma.Decimal(data.purchaseValue),
        purchaseDate: data.purchaseDate,
        documentType: data.documentType,
        pecosaNumber: data.pecosaNumber,
        registrationDate: data.registrationDate,
        location: data.location,
        costCenter: data.costCenter,
        responsibleEmployee: data.responsibleEmployee,
        finalEmployee: data.finalEmployee,
        locationType: data.locationType,
        locationSubtype: data.locationSubtype,
        features: data.features || undefined,
        model: data.model,
        dimensions: data.dimensions,
        serialNumber: data.serialNumber,
        brand: data.brand,
        chassisNumber: data.chassisNumber || undefined,
        engineNumber: data.engineNumber || undefined,
        licensePlate: data.licensePlate || undefined,
      },
    });

    return {
      ...asset,
      purchaseValue: asset.purchaseValue.toString(),
    };
  } catch (error) {
    console.error("Error creating asset:", error);
    throw new Error("No se pudo registrar el activo");
  }
}