
import React, { useState, useEffect } from "react";
import { Search, Package, CheckCircle, Clock, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAdminData, WarehouseItem } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";

const AdminWarehouse = () => {
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { updateWarehouseItemStatus } = useAdminData();
  const { toast } = useToast();

  useEffect(() => {
    fetchWarehouseItems();
  }, []);

  const fetchWarehouseItems = async () => {
    try {
      const { data, error } = await supabase
        .from("warehouse_items")
        .select("*")
        .order("received_date", { ascending: false });

      if (error) throw error;
      setWarehouseItems(data || []);
    } catch (error) {
      console.error("Error fetching warehouse items:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os itens do armazém.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (itemId: string, newStatus: string) => {
    await updateWarehouseItemStatus(itemId, newStatus);
    fetchWarehouseItems();
  };

  const filteredItems = warehouseItems.filter((item) => {
    const matchesSearch = 
      item.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "prepared":
        return <Truck className="h-4 w-4 text-blue-600" />;
      case "stored":
      default:
        return <Package className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "prepared":
        return "bg-blue-100 text-blue-800";
      case "stored":
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return "Entregue";
      case "prepared":
        return "Preparado";
      case "stored":
      default:
        return "Armazenado";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Armazém</h1>
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
        <h1 className="text-2xl font-bold text-gray-900">Armazém</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar itens..."
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
            <option value="stored">Armazenado</option>
            <option value="prepared">Preparado</option>
            <option value="delivered">Entregue</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.product_description}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <strong>Cliente:</strong> {item.client_name}
                    </div>
                    <div>
                      <strong>Data de Receção:</strong> {new Date(item.received_date).toLocaleDateString('pt-PT')}
                    </div>
                    {item.created_at && (
                      <div>
                        <strong>Registado em:</strong> {new Date(item.created_at).toLocaleDateString('pt-PT')}
                      </div>
                    )}
                    {item.updated_at && (
                      <div>
                        <strong>Última atualização:</strong> {new Date(item.updated_at).toLocaleDateString('pt-PT')}
                      </div>
                    )}
                  </div>

                  {item.photo_url && (
                    <div className="mt-2">
                      <img 
                        src={item.photo_url} 
                        alt="Foto do item" 
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {item.status === "stored" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(item.id, "prepared")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Marcar como Preparado
                    </Button>
                  )}
                  {item.status === "prepared" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(item.id, "delivered")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Marcar como Entregue
                    </Button>
                  )}
                  {item.status !== "stored" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(item.id, "stored")}
                    >
                      Voltar ao Armazém
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum item encontrado no armazém.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminWarehouse;
