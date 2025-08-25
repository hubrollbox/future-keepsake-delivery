
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

const AdminClients: React.FC = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClients = useCallback(async () => {
      setLoading(true);
      try {
        // Fetch profiles with admin status
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (profilesError) throw profilesError;

        // Fetch admin roles
        const { data: adminData, error: adminError } = await supabase
          .from("admin_roles")
          .select("user_id, role");

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
    }, []);

  useEffect(() => {
    if (profile?.role !== "admin") return;
    fetchClients();
  }, [profile?.role, fetchClients]);

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
      <h3 className="text-lg font-serif font-semibold text-gentle-black mb-4">
        Gestão de Clientes
      </h3>
      
      {loading ? (
        <div className="text-soft-gray">A carregar clientes...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-dusty-rose/20">
                <th className="text-left py-2 px-4 font-medium text-gentle-black">Nome</th>
                <th className="text-left py-2 px-4 font-medium text-gentle-black">Email</th>
                <th className="text-left py-2 px-4 font-medium text-gentle-black">Plano</th>
                <th className="text-left py-2 px-4 font-medium text-gentle-black">Pontos</th>
                <th className="text-left py-2 px-4 font-medium text-gentle-black">Nível</th>
                <th className="text-left py-2 px-4 font-medium text-gentle-black">Admin</th>
                <th className="text-left py-2 px-4 font-medium text-gentle-black">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="border-b border-dusty-rose/10">
                  <td className="py-2 px-4 text-gentle-black">
                    {client.full_name || "Nome não definido"}
                  </td>
                  <td className="py-2 px-4 text-gentle-black">
                    {client.email || "Email não definido"}
                  </td>
                  <td className="py-2 px-4 text-gentle-black capitalize">
                    {client.plan_type || "free"}
                  </td>
                  <td className="py-2 px-4 text-gentle-black">
                    {client.total_points || 0}
                  </td>
                  <td className="py-2 px-4 text-gentle-black">
                    {client.level || 1}
                  </td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      client.is_admin 
                        ? "bg-earthy-burgundy/20 text-earthy-burgundy" 
                        : "bg-misty-gray/20 text-misty-gray"
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
        </div>
      )}
    </div>
  );
};

export default AdminClients;
