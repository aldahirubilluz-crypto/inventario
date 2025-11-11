// types/registro.ts - Alternativa más simple y segura
import * as z from "zod";

// Paso 1: Datos básicos
export const step1Schema = z.object({
  oldLabel: z.string().min(1, "Pre etiqueta requerida"),
  patrimonialCode: z.string().min(1, "Código patrimonial requerido"),
  description: z.string().min(1, "Descripción requerida"),
});

// Paso 2: Ubicación
export const step2Schema = z.object({
  location: z.string().min(1, "Sede requerida"),
  costCenter: z.string().min(1, "Centro de costo requerido"),
  responsibleEmployee: z
    .string()
    .min(1, "Empleado responsable requerido")
    .regex(/^\d{8}$/, "DNI debe tener 8 dígitos"),
  finalEmployee: z.string().min(1, "Empleado final requerido"),
  locationType: z.string().min(1, "Tipo de ubicación requerido"),
  locationSubtype: z.string().min(1, "Subtipo de ubicación requerido"),
});

// Paso 3: Técnico
export const step3Schema = z.object({
  brand: z.string().min(1, "Marca requerida"),
  model: z.string().min(1, "Modelo requerido"),
  serialNumber: z.string().min(1, "Nro. serie requerido"),
  dimensions: z.string().min(1, "Medidas requeridas"),
  features: z.string().optional(),
  chassisNumber: z.string().optional(),
  engineNumber: z.string().optional(),
  licensePlate: z.string().optional(),
});

// Paso 4: Adquisición - Solución más simple
export const step4Schema = z.object({
  purchaseOrder: z.string().min(1, "Nro. orden requerido"),
  purchaseValue: z
    .string()
    .min(1, "Valor de compra requerido")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Valor debe ser un número positivo",
    }),
  purchaseDate: z.any().refine((val) => val instanceof Date, {
    message: "Fecha de compra requerida",
  }),
  registrationDate: z.any().refine((val) => val instanceof Date, {
    message: "Fecha de alta requerida",
  }),
  documentType: z.string().min(1, "Tipo de documento requerido"),
  pecosaNumber: z.string().min(1, "Nro. PECOSA requerido"),
});

// Schema completo
export const assetSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

// Tipo inferido del schema
export type AssetForm = z.infer<typeof assetSchema>;