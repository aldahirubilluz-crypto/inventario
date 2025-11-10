"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, UserPlus } from "lucide-react";
import { createManagerAction } from "@/actions/register-manager";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ManagerForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const res = await createManagerAction(data);

    if (res.success) {
      toast.success("Manager creado con éxito");
      form.reset();
    } else {
      toast.error(res.error || "Error al crear el manager");
    }
  };

  return (
    <Card className="mx-auto max-w-2xl border-0 shadow-2xl bg-linear-to-br from-white via-indigo-50/60 to-purple-50/60 backdrop-blur-xl">
      <CardHeader className="p-6 bg-linear-to-r from-indigo-600 to-purple-600">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">
              Nuevo Manager
            </CardTitle>
            <p className="text-indigo-100 text-sm mt-1">
              Crea un usuario con rol MANAGER
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white/70 p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold text-indigo-800 mb-5 flex items-center gap-2">
                <UserPlus size={20} />
                Datos del Manager
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ana Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+58 412 1234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="ana@empresa.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex-1 h-12 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:shadow-xl text-white font-bold text-lg"
              >
                {form.formState.isSubmitting ? "Creando..." : "Crear Manager"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 rounded-xl border-indigo-400 text-indigo-700 hover:bg-indigo-50 font-bold"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
