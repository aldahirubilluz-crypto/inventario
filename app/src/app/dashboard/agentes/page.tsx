// app/dashboard/agentes/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ManagersTable } from "@/components/managers-table";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";
import { useSession } from "next-auth/react";
import { User } from "@/types/agentes";
import { getUsersAction } from "@/actions/agentes";
import { UserForm } from "@/components/user-form";

export default function AgentesClient() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [refreshDialogOpen, setRefreshDialogOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const data = await getUsersAction(session.user.id);
      setUsers(data);
    } catch {
      toast.error("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: User) => {
    console.log("Editar usuario:", user);
    toast.info("Función de edición en desarrollo");
  };

  const openDeleteDialog = (id: string) => {
    setPendingId(id);
    setDeleteDialogOpen(true);
  };

  const openSuspendDialog = (id: string) => {
    setPendingId(id);
    setSuspendDialogOpen(true);
  };

  const openRefreshDialog = (id: string) => {
    setPendingId(id);
    setRefreshDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    console.log("Eliminar usuario:", pendingId);
    setDeleteDialogOpen(false);
  };

  const handleConfirmSuspend = async () => {
    console.log("Suspender usuario:", pendingId);
    setSuspendDialogOpen(false);
  };

  const handleConfirmRefresh = async () => {
    console.log("Refrescar contraseña:", pendingId);
    setRefreshDialogOpen(false);
  };

  const handleSave = async () => {
    await fetchUsers();
    setShowForm(false);
    toast.success("Usuario creado.");
  };

  return (
    <div className="max-h-screen w-full sm:p-4">
      <div className="mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-muted-foreground">
              Gestión de Usuarios
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Administra los usuarios responsables del registro
            </p>
          </div>

          <Button
            onClick={() => setShowForm(true)}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xl rounded-xl flex items-center gap-2.5 transition-all duration-200 my-auto"
          >
            <Plus className="w-5 h-5" />
            Agregar nuevo
          </Button>
        </div>

        <Card className="overflow-hidden border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">
                  Cargando usuarios...
                </p>
              </div>
            ) : (
              <ManagersTable
                initialData={users}
                onEdit={handleEdit}
                onDelete={openDeleteDialog}
                onSuspend={openSuspendDialog}
                onRefresh={openRefreshDialog}
              />
            )}
          </div>
        </Card>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="relative w-full max-w-2xl">
            <Card className="bg-card shadow-2xl rounded-3xl border-0 overflow-hidden p-0">
              <div className="bg-primary p-6 text-primary-foreground">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Nuevo Usuario</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-primary-foreground/80 hover:text-primary-foreground text-3xl font-light transition"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-8">
                <UserForm
                  onSave={handleSave}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </Card>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        description="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
        styleButton="bg-destructive hover:bg-destructive/90 text-white"
      />

      <ConfirmDialog
        isOpen={refreshDialogOpen}
        onClose={() => setRefreshDialogOpen(false)}
        onConfirm={handleConfirmRefresh}
        title="Refrescar Contraseña"
        description="¿Estás seguro de que deseas restablecer la contraseña de este usuario?"
        styleButton="bg-destructive hover:bg-destructive/90 text-white"
      />

      <ConfirmDialog
        isOpen={suspendDialogOpen}
        onClose={() => setSuspendDialogOpen(false)}
        onConfirm={handleConfirmSuspend}
        title="Cambiar estado"
        description="¿Deseas suspender o reactivar este usuario?"
        styleButton="bg-primary hover:bg-primary/90 text-white"
      />
    </div>
  );
}