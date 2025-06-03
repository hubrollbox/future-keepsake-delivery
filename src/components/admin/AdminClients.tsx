
import React, { useState, useEffect } from "react";
import { Search, Users, User, Package, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ClientData {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  deliveries_count: number;
  messages_count: number;
  last_delivery: string | null;
}

const AdminClients = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // Get user profiles with delivery and message counts
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name, created_at");

      if (profilesError) throw profilesError;

      // Get delivery counts for each user
      const clientsWithCounts = await Promise.all(
        (profiles || []).map(async (profile) => {
          const [deliveriesResult, messagesResult] = await Promise.all([
            supabase
              .from("deliveries")
              .select("id, created_at")
              .eq("user_id", profile.id),
            supabase
              .from("digital_messages")
              .select("id")
              .in("delivery_id", 
                supabase
                  .from("deliveries")
                  .select("id")
                  .eq("user_id", profile.id)
              )
          ]);

          const deliveries = deliveriesResult.data || [];
          const messages = messagesResult.data || [];
          
          // Get last delivery date
          const lastDelivery = deliveries.length > 0 
            ? deliveries.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())[0].created_at
            : null;

          return {
            ...profile,
            deliveries_count: deliveries.length,
            messages_count: messages.length,
            last_delivery: lastDelivery
          };
        })
      );

      setClients(clientsWithCounts);
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

  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pesquisar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {client.full_name || "Nome não fornecido"}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <strong>Email:</strong> {client.email}
                    </div>
                    <div>
                      <strong>Registado em:</strong> {new Date(client.created_at).toLocaleDateString('pt-PT')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <strong>Entregas:</strong> {client.deliveries_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <strong>Mensagens:</strong> {client.messages_count}
                    </div>
                    {client.last_delivery && (
                      <div>
                        <strong>Última entrega:</strong> {new Date(client.last_delivery).toLocaleDateString('pt-PT')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        Ver Histórico
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Histórico de {client.full_name || client.email}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-blue-50 p-4 rounded-md">
                            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-blue-600">{client.deliveries_count}</div>
                            <div className="text-sm text-gray-600">Entregas</div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-md">
                            <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-green-600">{client.messages_count}</div>
                            <div className="text-sm text-gray-600">Mensagens</div>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-md">
                            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <div className="text-sm font-medium text-purple-600">Cliente desde</div>
                            <div className="text-sm text-gray-600">{new Date(client.created_at).toLocaleDateString('pt-PT')}</div>
                          </div>
                        </div>
                        <div className="text-center text-gray-600">
                          <p>Histórico detalhado em desenvolvimento</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum cliente encontrado.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminClients;
