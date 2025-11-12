export interface ActivoSimple {
  id: number;
  codigo: string;
  descripcion: string;
  responsable: string;
  documentType: string;
  valor: string;
}

export interface ActivoCompleto {
  id: number;
  oldLabel: string;
  patrimonialCode: string;
  description: string;
  purchaseOrder: string;
  purchaseValue: string;
  purchaseDate: string;
  documentType: string;
  pecosaNumber: string;
  registrationDate: string;
  location: string;
  costCenter: string;
  responsibleEmployee: string;
  finalEmployee?: string;
  locationType: string;
  locationSubtype: string;
  features?: string;
  model: string;
  dimensions: string;
  serialNumber: string;
  brand: string;
  chassisNumber?: string;
  engineNumber?: string;
  licensePlate?: string;
  createdAt: string;
  updatedAt: string;
}