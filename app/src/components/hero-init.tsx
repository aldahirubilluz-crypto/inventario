/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { PackageOpen, Sparkles } from "lucide-react";
import Lottie from "lottie-react";

interface LottieAnimation {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: any[];
  layers: any[];
}

export default function LeftHero() {
  const [animationData, setAnimationData] = useState<LottieAnimation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch("/lottie/almacenaje.json");
        if (!response.ok) throw new Error("Failed to load animation");
        const data: LottieAnimation = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Error loading Lottie animation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnimation();
  }, []);

  return (
    <div className="hidden md:flex w-1/2 relative bg-linear-to-br from-primary to-primary/80 rounded-r-3xl overflow-hidden shadow-2xl">
      <div className="absolute inset-0 overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {animationData && !isLoading && (
          <div className="absolute inset-0 flex justify-center items-center opacity-40">
            <Lottie
              animationData={animationData}
              loop
              autoplay
              className="w-full h-full max-w-xl object-contain scale-125 blur-sm"
              style={{ filter: "blur(1px)" }}
            />
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex flex-col justify-center items-center text-center p-10 md:p-12 lg:p-16 max-w-lg mx-auto space-y-8">
        <div className="flex items-center gap-4 text-5xl md:text-6xl font-black tracking-tight">
          <div className="p-2 bg-amber-400/20 rounded-xl backdrop-blur-sm animate-pulse">
            <PackageOpen size={56} className="text-amber-300 drop-shadow-md" />
          </div>
          <span className="bg-linear-to-r from-amber-200 via-yellow-100 to-amber-100 bg-clip-text text-transparent">
            INVENTARIO
          </span>
        </div>

        <p className="text-lg md:text-xl text-amber-50 font-medium leading-relaxed max-w-md">
          Gestiona tu stock con <span className="font-bold text-amber-200">inteligencia</span>.
          Control total, en tiempo real, sin complicaciones.
        </p>

        <div className="flex items-center gap-3 text-amber-100 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full border border-amber-200/30 shadow-lg">
          <Sparkles size={20} className="text-amber-300" />
          <span className="text-base md:text-lg font-bold tracking-wide">
            +10,000 productos gestionados
          </span>
        </div>
      </div>
    </div>
  );
}