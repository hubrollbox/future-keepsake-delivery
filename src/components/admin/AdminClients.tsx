import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, Search, Shield, User } from "lucide-react";
import { exportToCSV } from "@/lib/exportToCSV";

interface Client {
  id: string;
  email: string;
  full_name: string | null;
  plan_type: string;
  total_points: number;
  level: number;
  created_at: string;
  is_admin: boolean;
}

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      // Fetch profiles with admin status
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch admin roles
      const { data: adminRoles, error: adminError } = await supabase
        .from("admin_roles")
        .select("user_id");

      if (adminError) throw adminError;

      const adminUserIds = adminRoles?.map(role => role.user_id) || [];

      const clientsWithAdminStatus = profiles?.map(profile => ({
        ...profile,
        is_admin: adminUserIds.includes(profile.id)
      })) || [];

      setClients(clientsWithAdminStatus);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
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
          .insert({ user_id: userId, role: "admin" });

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: `Permissões ${isCurrentlyAdmin ? 'removidas' : 'concedidas'} com sucesso.`,
      });

      fetchClients();
    } catch (error) {
      console.error("Error updating admin status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as permissões.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client =>
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.full_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h1>
          <p className="text-gray-600">Gerir utilizadores e permissões</p>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="mb-4"
        onClick={() => exportToCSV(clients, "clientes.csv")}
        disabled={!clients.length}
      >
        Exportar CSV
      </Button>

      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gold/10 rounded-full">
                      {client.is_admin ? (
                        <Shield className="h-4 w-4 text-gold" />
                      ) : (
                        <User className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {client.full_name || "Nome não fornecido"}
                      </h3>
                      <p className="text-sm text-gray-600">{client.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant={client.is_admin ? "default" : "secondary"}>
                      {client.is_admin ? "Administrador" : "Utilizador"}
                    </Badge>
                    <Badge variant="outline">
                      Plano: {client.plan_type || "Free"}
                    </Badge>
                    <Badge variant="outline">
                      Nível: {client.level || 1}
                    </Badge>
                    <Badge variant="outline">
                      {client.total_points || 0} pontos
                    </Badge>
                  </div>

                  <p className="text-xs text-gray-500">
                    Registado em: {new Date(client.created_at).toLocaleDateString('pt-PT')}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant={client.is_admin ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleAdminStatus(client.id, client.is_admin)}
                    className={client.is_admin ? "" : "bg-gold hover:bg-gold/90 text-black"}
                  >
                    {client.is_admin ? "Remover Admin" : "Tornar Admin"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchTerm ? "Nenhum cliente encontrado com esse termo." : "Nenhum cliente encontrado."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminClients;
