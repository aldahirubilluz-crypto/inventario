// app/registro/AssetWizardForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createAsset } from "@/actions/registro";
import StepDatosBasicos from "@/components/registro/step-datos-basicos";
import StepUbicacion from "@/components/registro/step-ubicacion";
import StepTecnico from "@/components/registro/step-tecnico";
import StepAdquisicion from "@/components/registro/step-adquisicion"
import { assetSchema, AssetForm } from "@/types/registro";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";

export default function AssetWizardForm() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [touchedSteps, setTouchedSteps] = useState<Set<number>>(new Set([0]));
  const [showErrorsForStep, setShowErrorsForStep] = useState<Set<number>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<AssetForm | null>(null);

  const steps = ["Datos Básicos", "Ubicación", "Técnico", "Adquisición"];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<AssetForm>({
    resolver: zodResolver(assetSchema),
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      oldLabel: "",
      patrimonialCode: "",
      description: "",
      location: "",
      costCenter: "",
      responsibleEmployee: "",
      finalEmployee: "",
      locationType: "",
      locationSubtype: "",
      brand: "",
      model: "",
      serialNumber: "",
      dimensions: "",
      features: "",
      chassisNumber: "",
      engineNumber: "",
      licensePlate: "",
      purchaseOrder: "",
      purchaseValue: "",
      documentType: "",
      pecosaNumber: "",
      purchaseDate: undefined,
      registrationDate: undefined,
    },
  });

  const purchaseDate = watch("purchaseDate");
  const registrationDate = watch("registrationDate");

  // Reinicia todo después de éxito
  const resetForm = () => {
    reset();
    setStep(0);
    setTouchedSteps(new Set([0]));
    setShowErrorsForStep(new Set());
    setError(null);
    setSuccess("¡Activo registrado correctamente!");
    setTimeout(() => setSuccess(null), 4000);
  };

  // Esto lo llama TU ConfirmDialog
  const handleConfirm = async () => {
    if (!pendingData) return;

    await createAsset(pendingData);
    resetForm();
    setConfirmOpen(false);
    setPendingData(null);
  };

  const onSubmit: SubmitHandler<AssetForm> = (data) => {
    setPendingData(data);
    setConfirmOpen(true);
  };

  const handleFieldFocus = () => {
    setShowErrorsForStep((prev) => new Set(prev).add(step));
  };

  const nextStep = async () => {
    const stepFields: Record<number, Array<keyof AssetForm>> = {
      0: ["oldLabel", "patrimonialCode", "description"],
      1: ["location", "costCenter", "responsibleEmployee", "finalEmployee", "locationType", "locationSubtype"],
      2: ["brand", "model", "serialNumber", "dimensions"],
      3: ["purchaseOrder", "purchaseValue", "purchaseDate", "registrationDate", "documentType", "pecosaNumber"],
    };

    const valid = await trigger(stepFields[step], { shouldFocus: true });
    if (valid) {
      const next = step + 1;
      setStep(next);
      setTouchedSteps((prev) => new Set(prev).add(next));
    }
  };

  // Errores por paso (sin errores de TS)
  const getStepErrors = (): Partial<Record<keyof AssetForm, any>> => {
    if (!showErrorsForStep.has(step)) return {};

    const stepFields: Record<number, Array<keyof AssetForm>> = {
      0: ["oldLabel", "patrimonialCode", "description"],
      1: ["location", "costCenter", "responsibleEmployee", "finalEmployee", "locationType", "locationSubtype"],
      2: ["brand", "model", "serialNumber", "dimensions"],
      3: ["purchaseOrder", "purchaseValue", "purchaseDate", "registrationDate", "documentType", "pecosaNumber"],
    };

    return (stepFields[step] || []).reduce((acc, field) => {
      if (errors[field]) acc[field] = errors[field];
      return acc;
    }, {} as Partial<Record<keyof AssetForm, any>>);
  };

  const visibleErrors = getStepErrors();

  return (
    <>
      <div className="mx-auto max-w-4xl p-6 space-y-8">
        {/* Indicador de pasos */}
        <div className="flex justify-between mb-8">
          {steps.map((label, idx) => (
            <div key={idx} className="flex-1 text-center">
              <div
                className={cn(
                  "rounded-full w-10 h-10 mx-auto flex items-center justify-center font-bold text-sm transition-all",
                  step === idx
                    ? "bg-primary text-white"
                    : touchedSteps.has(idx)
                    ? "bg-primary/50 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {idx + 1}
              </div>
              <p className="mt-2 text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Mensaje de éxito */}
        {success && (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 flex items-center gap-3 animate-in slide-in-from-top">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {step === 0 && <StepDatosBasicos register={register} errors={visibleErrors} onFocus={handleFieldFocus} />}
          {step === 1 && <StepUbicacion register={register} errors={visibleErrors} onFocus={handleFieldFocus} />}
          {step === 2 && <StepTecnico register={register} errors={visibleErrors} onFocus={handleFieldFocus} />}
          {step === 3 && (
            <StepAdquisicion
              register={register}
              setValue={setValue}
              purchaseDate={purchaseDate}
              registrationDate={registrationDate}
              errors={visibleErrors}
              onFocus={handleFieldFocus}
            />
          )}

          <div className="flex justify-between pt-8 border-t">
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                Anterior
              </Button>
            ) : (
              <div />
            )}

            {step < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Siguiente
              </Button>
            ) : (
              <Button type="submit" className="gap-2">
                <FileText className="h-5 w-5" />
                Registrar Activo
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* TU ConfirmDialog - SIN CAMBIOS */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingData(null);
        }}
        onConfirm={handleConfirm}
        title="Confirmar registro"
        description={`¿Estás seguro de registrar el activo con código patrimonial "${pendingData?.patrimonialCode || ""}"?`}
        styleButton="bg-primary hover:bg-primary/90 text-white"
      />
    </>
  );
}