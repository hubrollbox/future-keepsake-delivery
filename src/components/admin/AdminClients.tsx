
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Client {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  plan_type: string | null;
  total_points: number | null;
  level: number | null;
  created_at: string | null;
  updated_at: string | null;
  plan_id: string | null;
  is_admin: boolean;
}

const PAGE_SIZE = 25;

const AdminClients: React.FC = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      // Get total count for pagination
      const { count, error: countError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;
      setTotalCount(count || 0);

      // Fetch profiles with explicit field selection (security best practice)
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url, total_points, level, created_at, updated_at, plan_id")
        .order("created_at", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (profilesError) throw profilesError;

      // Fetch admin roles
      const { data: adminData, error: adminError } = await supabase
        .from("admin_roles")
        .select("user_id");

      if (adminError) throw adminError;

      // Combine data and map isAdmin to is_admin
      const adminUserIds = new Set(adminData?.map(admin => admin.user_id) || []);
      
      const clientsWithAdminStatus = profilesData?.map(profile => ({
        ...profile,
        plan_type: 'free', // Default plan type from profiles table
        is_admin: adminUserIds.has(profile.id)
      })) || [];

      setClients(clientsWithAdminStatus);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (profile?.role !== "admin") return;
    fetchClients();
  }, [profile?.role, fetchClients, page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const canGoNext = page < totalPages - 1;
  const canGoPrev = page > 0;

  const toggleAdminStatus = async (userId: string, currentIsAdmin: boolean) => {
    try {
      if (currentIsAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from("admin_roles")
          .delete()
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        // Add admin role
        const { error } = await supabase
          .from("admin_roles")
          .insert([{ user_id: userId, role: "admin" }]);

        if (error) throw error;
      }

      // Update local state
      setClients(prev => prev.map(client => 
        client.id === userId 
          ? { ...client, is_admin: !currentIsAdmin }
          : client
      ));
    } catch (error) {
      console.error("Error toggling admin status:", error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-white border border-dusty-rose/20 rounded-2xl shadow-soft p-6">
        <p className="text-soft-gray">Acesso negado. Apenas administradores podem ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-dusty-rose/20 rounded-2xl shadow-soft p-6">
      <h3 className="text-2xl font-fraunces font-semibold text-steel-blue mb-4">
        Gestão de Clientes
      </h3>
      
      {loading ? (
        <div className="text-misty-gray">A carregar clientes...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-dusty-rose/20">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Nome</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Plano</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Pontos</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Nível</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Admin</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="border-b border-dusty-rose/10">
                  <td className="py-2 px-4 text-gray-600">
                    {client.full_name || "Nome não definido"}
                  </td>
                  <td className="py-2 px-4 text-gray-600">
                    {client.email || "Email não definido"}
                  </td>
                  <td className="py-2 px-4 text-gray-600 capitalize">
                    {client.plan_type || "free"}
                  </td>
                  <td className="py-2 px-4 text-gray-600">
                    {client.total_points || 0}
                  </td>
                  <td className="py-2 px-4 text-gray-600">
                    {client.level || 1}
                  </td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      client.is_admin 
                        ? "bg-keepla-red/20 text-keepla-red" 
                        : "bg-keepla-gray-light/20 text-keepla-gray-light"
                    }`}>
                      {client.is_admin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => toggleAdminStatus(client.id, client.is_admin)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        client.is_admin
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {client.is_admin ? "Remover Admin" : "Tornar Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {clients.length === 0 && (
            <div className="text-center py-8 text-soft-gray">
              Nenhum cliente encontrado.
            </div>
          )}

          {/* Pagination controls */}
          {totalCount > PAGE_SIZE && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-dusty-rose/20">
              <span className="text-sm text-soft-gray">
                A mostrar {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, totalCount)} de {totalCount} clientes
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p - 1)}
                  disabled={!canGoPrev}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!canGoNext}
                >
                  Seguinte
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminClients;
