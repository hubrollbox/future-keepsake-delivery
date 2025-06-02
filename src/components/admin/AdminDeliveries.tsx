
import React, { useState, useEffect } from "react";
import { Search, Filter, CheckCircle, Clock, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAdminData } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";

interface Delivery {
  id: string;
  title: string | null;
  delivery_type: string;
  delivery_date: string;
  status: string | null;
  recipient_name: string | null;
  recipient_email: string | null;
  message: string | null;
  created_at: string | null;
}

const AdminDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { updateDeliveryStatus } = useAdminData();
  const { toast } = useToast();

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const { data, error } = await supabase
        .from("deliveries")
        .select("*")
        .order("delivery_date", { ascending: true });

      if (error) throw error;
      setDeliveries(data || []);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as entregas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (deliveryId: string, newStatus: string) => {
    await updateDeliveryStatus(deliveryId, newStatus);
    fetchDeliveries();
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch = 
      delivery.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.recipient_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "realizada":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pendente":
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "realizada":
        return "bg-green-100 text-green-800";
      case "pendente":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Entregas</h1>
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
        <h1 className="text-2xl font-bold text-gray-900">Entregas</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar entregas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Todos os estados</option>
            <option value="pendente">Pendente</option>
            <option value="realizada">Realizada</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredDeliveries.map((delivery) => (
          <Card key={delivery.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(delivery.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {delivery.title || "Entrega sem título"}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status || "Não definido"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <strong>Tipo:</strong> {delivery.delivery_type}
                    </div>
                    <div>
                      <strong>Data:</strong> {new Date(delivery.delivery_date).toLocaleDateString('pt-PT')}
                    </div>
                    {delivery.recipient_name && (
                      <div>
                        <strong>Destinatário:</strong> {delivery.recipient_name}
                      </div>
                    )}
                    {delivery.recipient_email && (
                      <div>
                        <strong>Email:</strong> {delivery.recipient_email}
                      </div>
                    )}
                  </div>
                  
                  {delivery.message && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Mensagem:</strong> {delivery.message.substring(0, 100)}
                      {delivery.message.length > 100 && "..."}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {delivery.status === "pendente" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(delivery.id, "realizada")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Marcar como Realizada
                    </Button>
                  )}
                  {delivery.status === "realizada" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(delivery.id, "pendente")}
                    >
                      Marcar como Pendente
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDeliveries.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma entrega encontrada.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDeliveries;
