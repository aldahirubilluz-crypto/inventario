"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ManagersTable } from "@/components/managers-table";
import { ManagerForm } from "@/components/form-register-manager";
import {
  deleteManagerAction,
  getManagerActions,
  resetManagerPasswordAction,
  toggleSuspendManagerAction,
} from "@/actions/register-manager";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";

export default function AgentesClient() {
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingManager, setEditingManager] = useState<any | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [refreshDialogOpen, setRefreshDialogOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  
  const fetchManagers = async () => {
    setLoading(true);
    try {
      const data = await getManagerActions();
      setManagers(data);
    } catch {
      toast.error("No se pudieron cargar los managers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleEdit = (manager: any) => {
    setEditingManager(manager);
    setShowForm(true);
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
    if (!pendingId) return;
    const result = await deleteManagerAction(pendingId);
    if (result.success) {
      toast.success(result.message || "Agente eliminado.");
      fetchManagers();
    } else {
      toast.error(result.error || "No se pudo eliminar.");
    }
    setDeleteDialogOpen(false);
    setPendingId(null);
  };

  const handleConfirmSuspend = async () => {
    if (!pendingId) return;
    const result = await toggleSuspendManagerAction(pendingId);
    if (result.success) {
      toast.success(result.message || "Estado actualizado.");
      fetchManagers();
    } else {
      toast.error(result.error || "No se pudo cambiar el estado.");
    }
    setSuspendDialogOpen(false);
    setPendingId(null);
  };

  const handleConfirmRefresh = async () => {
    if (!pendingId) return;
    const result = await resetManagerPasswordAction(pendingId);
    if (result.success) {
      toast.success(result.message || "Contraseña Actualiza.");
      fetchManagers();
    } else {
      toast.error(result.error || "No se pudo restablecer la contraseña.");
    }
    setRefreshDialogOpen(false);
    setPendingId(null);
  };

  const handleSave = async () => {
    await fetchManagers();
    setShowForm(false);
    setEditingManager(null);
    toast.success(editingManager ? "Usuario actualizado." : "Usuario creado.");
  };

  return (
    <div className="max-h-screen sm:p-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-muted-foreground">
              Gestión de Usuario
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
                  Cargando managers...
                </p>
              </div>
            ) : (
              <ManagersTable
                initialData={managers}
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
                  <h2 className="text-2xl font-bold">
                    {editingManager ? "Editar Usuario" : "Nuevo Usuario"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingManager(null);
                    }}
                    className="text-primary-foreground/80 hover:text-primary-foreground text-3xl font-light transition"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-8">
                <ManagerForm
                  manager={editingManager}
                  onSave={handleSave}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingManager(null);
                  }}
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
        description="¿Estás seguro de que deseas eliminar este Usuario? Esta acción no se puede deshacer."
        styleButton="bg-destructive hover:bg-destructive/90 text-white"
      />

      <ConfirmDialog
        isOpen={refreshDialogOpen}
        onClose={() => setRefreshDialogOpen(false)}
        onConfirm={handleConfirmRefresh}
        title="Refrescar Usuario"
        description="¿Estás seguro de que deseas restablecer la contraseña de este Usuario?"
        styleButton="bg-destructive hover:bg-destructive/90 text-white"
      />

      <ConfirmDialog
        isOpen={suspendDialogOpen}
        onClose={() => setSuspendDialogOpen(false)}
        onConfirm={handleConfirmSuspend}
        title="Cambiar estado"
        description="¿Deseas suspender o reactivar este manager?"
        styleButton="bg-primary hover:bg-primary/90 text-white"
      />
    </div>
  );
}
