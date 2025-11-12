// components/PasswordStrengthMeter.tsx
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export default function PasswordStrengthMeter({
  password,
  className,
}: PasswordStrengthMeterProps) {
  const strength = password
    ? [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        password.length >= 12,
      ].filter(Boolean).length
    : 0;

  const strengthLabel = strength <= 1 ? "Débil" : strength === 2 ? "Regular" : strength === 3 ? "Buena" : "Fuerte";

  const strengthColor = strength <= 1 ? "bg-destructive" : strength === 2 ? "bg-orange-500" : strength === 3 ? "bg-yellow-500" : "bg-green-500";

  const strengthWidth = strength <= 1 ? "w-1/4" : strength === 2 ? "w-2/4" : strength === 3 ? "w-3/4" : "w-full";

  if (!password) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Fuerza de la contraseña</span>
        <span
          className={cn(
            strength <= 1 && "text-destructive",
            strength === 2 && "text-orange-500",
            strength >= 3 && "text-green-500"
          )}
        >
          {strengthLabel}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300",
            strengthColor,
            strengthWidth
          )}
        />
      </div>
    </div>
  );
}