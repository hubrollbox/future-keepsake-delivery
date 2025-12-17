

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Package, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface WarehouseItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  category: string;
  status: 'available' | 'low_stock' | 'out_of_stock';
  created_at: string;
  updated_at: string;
}

const AdminWarehouse = () => {
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WarehouseItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    category: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchWarehouseItems();
  }, []);

  const fetchWarehouseItems = async () => {
    try {
      const { data, error } = await supabase
        .from('warehouse_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar itens do armazém:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os itens do armazém.',
          variant: 'destructive'
        });
        return;
      }

      setItems(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao carregar itens.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Sem Stock</Badge>;
    } else if (quantity <= 10) {
      return <Badge variant="secondary">Stock Baixo</Badge>;
    }
    return <Badge variant="default">Disponível</Badge>;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        // Atualizar item existente
        const { error } = await supabase
          .from('warehouse_items')
          .update({
            name: formData.name,
            description: formData.description,
            quantity: formData.quantity,
            category: formData.category,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);

        if (error) throw error;

        toast({
          title: 'Sucesso',
          description: 'Item atualizado com sucesso!'
        });
      } else {
        // Criar novo item
        const { error } = await supabase
          .from('warehouse_items')
          .insert({
            name: formData.name,
            description: formData.description,
            quantity: formData.quantity,
            category: formData.category
          });

        if (error) throw error;

        toast({
          title: 'Sucesso',
          description: 'Item adicionado com sucesso!'
        });
      }

      // Reset form and close dialog
      setFormData({ name: '', description: '', quantity: 0, category: '' });
      setEditingItem(null);
      setIsAddDialogOpen(false);
      fetchWarehouseItems();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o item.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('warehouse_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Item removido com sucesso!'
      });
      fetchWarehouseItems();
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o item.',
        variant: 'destructive'
      });
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-fraunces font-bold text-steel-blue tracking-tight">Gestão de Armazém</h1>
          <p className="text-misty-gray">Gerir itens e stock do armazém</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-fraunces text-steel-blue">{editingItem ? 'Editar Item' : 'Adicionar Novo Item'}</DialogTitle>
              <DialogDescription className="text-misty-gray">
                {editingItem ? 'Edite as informações do item.' : 'Adicione um novo item ao armazém.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  setEditingItem(null);
                  setFormData({ name: '', description: '', quantity: 0, category: '' });
                }}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingItem ? 'Atualizar' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar itens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border-dusty-rose/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
              </CardTitle>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingItem(item);
                    setFormData({
                      name: item.name,
                      description: item.description,
                      quantity: item.quantity,
                      category: item.category
                    });
                    setIsAddDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <CardDescription>{item.description}</CardDescription>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Quantidade:</span>
                  <span className="font-semibold">{item.quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Categoria:</span>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge(item.quantity)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-muted-foreground">
            {searchTerm ? 'Nenhum item encontrado' : 'Nenhum item no armazém'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? 'Tente pesquisar com outros termos.' : 'Comece adicionando o primeiro item.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminWarehouse;