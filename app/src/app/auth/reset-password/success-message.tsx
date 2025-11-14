
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SuccessMessage({
  router,
}: {
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <Card className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary">
          Contraseña cambiada
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tu contraseña ha sido actualizada exitosamente.
        </p>
      </div>
      <Button
        onClick={() => router.push("/")}
        className="w-full bg-red-600 hover:bg-red-700 py-5 text-white"
      >
        Regresar a la página principal
      </Button>
    </Card>
  );
}