// app/dashboard/agentes/layout.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AgentesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "MANAGER") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
