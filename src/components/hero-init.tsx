import { PackageOpen, Sparkles } from "lucide-react";

export default function LeftHero() {
  return (
    <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-linear-to-br from-primary/80 to-primary text-white p-12 relative overflow-hidden rounded-r-4xl">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-yellow-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center space-y-6 max-w-lg">
        <div className="flex items-center justify-center gap-3 text-6xl font-black tracking-tighter">
          <PackageOpen size={56} className="text-amber-400 drop-shadow-lg" />
          <span className="bg-linear-to-r from-amber-300 to-yellow-100 bg-clip-text text-transparent">
            INVENTARIO
          </span>
        </div>

        <p className="text-lg text-amber-50 font-medium leading-relaxed">
          Gestiona tu stock con inteligencia. Control total, en tiempo real,
          sin complicaciones.
        </p>

        <div className="flex items-center justify-center gap-2 text-amber-200">
          <Sparkles size={18} />
          <span className="text-sm font-semibold">
            +10,000 productos gestionados
          </span>
        </div>
      </div>
    </div>
  );
}