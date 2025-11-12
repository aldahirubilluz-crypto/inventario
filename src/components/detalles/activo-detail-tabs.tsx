// src/components/activo/activo-detail-tabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralTab from "./general-tab";
import AdquisicionTab from "./adquisicion-tab";
import TecnicaTab from "./tecnica-tab";
import UbicacionTab from "./ubicacion-tab";

interface ActivoDetailTabsProps {
  activo: any;
  formatDate: (date: string) => string;
}

export default function ActivoDetailTabs({ activo, formatDate }: ActivoDetailTabsProps) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
        <TabsTrigger value="general" className="text-xs md:text-sm">General</TabsTrigger>
        <TabsTrigger value="adquisicion" className="text-xs md:text-sm">Adquisición</TabsTrigger>
        <TabsTrigger value="tecnica" className="text-xs md:text-sm">Técnica</TabsTrigger>
        <TabsTrigger value="ubicacion" className="text-xs md:text-sm">Ubicación</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralTab activo={activo} />
      </TabsContent>

      <TabsContent value="adquisicion" className="mt-6">
        <AdquisicionTab activo={activo} formatDate={formatDate} />
      </TabsContent>

      <TabsContent value="tecnica" className="mt-6">
        <TecnicaTab activo={activo} />
      </TabsContent>

      <TabsContent value="ubicacion" className="mt-6">
        <UbicacionTab activo={activo} />
      </TabsContent>
    </Tabs>
  );
}