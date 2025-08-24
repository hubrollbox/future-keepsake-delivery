
import React, { useState, useEffect } from "react";
import { Search, Package, CheckCircle, Truck, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAdminData, WarehouseItem } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";

const AdminWarehouse = () => {
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { updateWarehouseItemStatus } = useAdminData();
  const { toast } = useToast();

  const [newItem, setNewItem] = useState({
    client_name: "",
    product_description: "",
    received_date: new Date().toISOString().split('T')[0],
    photo: null as File | null,
  });

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

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      setUploadingPhoto(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('warehouse-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('warehouse-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload da foto.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let photoUrl = null;
      
      if (newItem.photo) {
        photoUrl = await uploadPhoto(newItem.photo);
        if (!photoUrl) return; // Upload failed
      }

      const { error } = await supabase
        .from("warehouse_items")
        .insert({
          client_name: newItem.client_name,
          product_description: newItem.product_description,
          received_date: newItem.received_date,
          photo_url: photoUrl,
          status: 'stored',
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Item adicionado ao armazém com sucesso.",
      });

      setNewItem({
        client_name: "",
        product_description: "",
        received_date: new Date().toISOString().split('T')[0],
        photo: null,
      });
      setShowAddForm(false);
      fetchWarehouseItems();
    } catch (error) {
      console.error("Error adding warehouse item:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item ao armazém.",
        variant: "destructive",
      });
    }
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
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Package className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
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

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Adicionar Novo Item</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_name">Nome do Cliente</Label>
                  <Input
                    id="client_name"
                    value={newItem.client_name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, client_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="received_date">Data de Receção</Label>
                  <Input
                    id="received_date"
                    type="date"
                    value={newItem.received_date}
                    onChange={(e) => setNewItem(prev => ({ ...prev, received_date: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="product_description">Descrição do Produto</Label>
                <Input
                  id="product_description"
                  value={newItem.product_description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, product_description: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="photo">Foto do Item (opcional)</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewItem(prev => ({ ...prev, photo: e.target.files?.[0] || null }))}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploadingPhoto}>
                  {uploadingPhoto ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      A carregar...
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4 mr-2" />
                      Adicionar Item
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
                        loading="lazy"
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
