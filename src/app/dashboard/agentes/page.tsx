// app/agentes/page.tsx
import { ManagerForm } from "@/components/form-register-manager";
import { ManagersTable } from "@/components/managers-table";
import { getManagerActions } from "@/actions/register-manager";

export default async function PageAgentes() {
  const managers = await getManagerActions();

  return (
    <div className="p-8 min-h-screen bg-linear-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            Gestión de Managers
          </h1>
          <p className="text-indigo-600">
            Administra los usuarios que Registran
          </p>
        </header>

        <div className="mb-12">
          <ManagerForm />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-3">
            <span className="inline-block w-3 h-3 bg-indigo-600 rounded-full"></span>
            Lista de Managers
          </h2>
          <ManagersTable initialData={managers} />
        </div>
      </div>
    </div>
  );
}
