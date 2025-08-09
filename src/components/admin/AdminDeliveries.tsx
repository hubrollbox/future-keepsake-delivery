
import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle, Clock, Package, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/exportToCSV";
import SearchFilters from "@/components/search/SearchFilters";
import { useSearchFilters } from "@/hooks/useSearchFilters";

interface Delivery {
  id: string;
  title: string;
  description: string | null;
  type: string;
  delivery_date: string;
  status: string;
  created_at: string;
  user_id: string;
  keepsake_id: string | null;
  keepsake_product_id: string | null;
  warehouse_item_id: string | null;
  recipient_id: string | null;
  digital_file_url: string | null;
  location: string | null;
  payment_status: string | null;
  updated_at: string | null;
}

const AdminDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const {
    filters,
    setFilters,
    filteredData: filteredDeliveries,
    clearFilters,
  } = useSearchFilters(deliveries, ["title", "description"]);

  const fetchDeliveries = useCallback(async () => {
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
  }, [toast]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleStatusUpdate = async (deliveryId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("deliveries")
        .update({ status: newStatus })
        .eq("id", deliveryId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Estado da entrega atualizado com sucesso.",
      });

      fetchDeliveries();
    } catch (error) {
      console.error("Error updating delivery status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o estado da entrega.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusOptions = [
    { value: "all", label: "Todos os estados" },
    { value: "scheduled", label: "Agendado" },
    { value: "delivered", label: "Entregue" },
    { value: "cancelled", label: "Cancelado" },
  ];

  const categoryOptions = [
    { value: "all", label: "Todos os tipos" },
    { value: "digital", label: "Digital" },
    { value: "physical", label: "Físico" },
  ];

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
        <Button
          variant="outline"
          onClick={() => exportToCSV(filteredDeliveries, "entregas.csv")}
          disabled={!filteredDeliveries.length}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        statusOptions={statusOptions}
        categoryOptions={categoryOptions}
        showCategoryFilter={true}
        placeholder="Pesquisar entregas por título, destinatário ou descrição..."
      />

      <div className="grid gap-4">
        {filteredDeliveries.map((delivery) => (
          <Card key={delivery.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(delivery.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {delivery.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status === "scheduled" ? "Agendado" : 
                       delivery.status === "delivered" ? "Entregue" : 
                       delivery.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <strong>Tipo:</strong> {delivery.type}
                    </div>
                    <div>
                      <strong>Data:</strong> {new Date(delivery.delivery_date).toLocaleDateString('pt-PT')}
                    </div>
                    <div>
                      <strong>ID:</strong> {delivery.id.substring(0, 8)}...
                    </div>
                  </div>
                  
                  {delivery.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Descrição:</strong> {delivery.description.substring(0, 100)}
                      {delivery.description.length > 100 && "..."}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {delivery.status === "scheduled" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(delivery.id, "delivered")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Marcar como Entregue
                    </Button>
                  )}
                  {delivery.status === "delivered" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(delivery.id, "scheduled")}
                    >
                      Marcar como Agendada
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
            <p className="text-gray-600">
              {deliveries.length === 0 
                ? "Nenhuma entrega encontrada." 
                : "Nenhuma entrega corresponde aos filtros aplicados."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDeliveries;
