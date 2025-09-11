import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, CreditCard, Search, Users } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Plan = Database['public']['Tables']['plans']['Row'];
type PlanInsert = Database['public']['Tables']['plans']['Insert'];
type PlanUpdate = Database['public']['Tables']['plans']['Update'];

interface PlanFormData {
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  features?: string[];
  active: boolean;
}

interface PlanWithStats extends Plan {
  subscriber_count?: number;
}

const AdminPlans = () => {
  const [plans, setPlans] = useState<PlanWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    features: [],
    active: true
  });
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      
      // Buscar planos
      const { data: plansData, error: plansError } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;

      // Buscar contagem de subscritores para cada plano
      const plansWithStats = await Promise.all(
        (plansData || []).map(async (plan) => {
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('plan_id', plan.id);
          
          return {
            ...plan,
            subscriber_count: count || 0
          };
        })
      );

      setPlans(plansWithStats);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const planData = {
        name: formData.name,
        description: formData.description || null,
        price: formData.price || null,
        duration: formData.duration || null,
        features: formData.features && formData.features.length > 0 ? formData.features : null,
        active: formData.active
      };

      if (editingPlan) {
        // Atualizar plano existente
        const { error } = await supabase
          .from('plans')
          .update(planData as PlanUpdate)
          .eq('id', editingPlan.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Plano atualizado com sucesso!"
        });
      } else {
        // Criar novo plano
        const { error } = await supabase
          .from('plans')
          .insert([planData as PlanInsert]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Plano criado com sucesso!"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPlans();
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o plano.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      // Verificar se há usuários com este plano
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('plan_id', planId);

      if (count && count > 0) {
        toast({
          title: "Erro",
          description: `Não é possível remover este plano pois ${count} usuário(s) ainda o utilizam.`,
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Plano removido com sucesso!"
      });
      
      fetchPlans();
    } catch (error) {
      console.error('Erro ao remover plano:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o plano.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      duration: 30,
      features: [],
      active: true
    });
    setEditingPlan(null);
    setNewFeature("");
  };

  const openEditDialog = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || "",
      price: plan.price || 0,
      duration: plan.duration || 30,
      features: Array.isArray(plan.features) ? plan.features : [],
      active: plan.active || true
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), newFeature.trim()]
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = formData.features?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, features: updatedFeatures });
  };

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-steel-blue font-fraunces">Gestão de Planos</h1>
          <p className="text-misty-gray mt-2">Gerir planos de subscrição e preços</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-earthy-burgundy hover:bg-earthy-burgundy/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-misty-gray" />
            <Input
              placeholder="Pesquisar planos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Planos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Planos ({filteredPlans.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-earthy-burgundy mx-auto"></div>
              <p className="text-misty-gray mt-2">Carregando planos...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Subscritores</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Criado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          {plan.description && (
                            <div className="text-sm text-misty-gray truncate max-w-xs">
                              {plan.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {plan.price ? `€${plan.price.toFixed(2)}` : 'Gratuito'}
                      </TableCell>
                      <TableCell>
                        {plan.duration ? `${plan.duration} dias` : 'Ilimitado'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-misty-gray" />
                          <span>{plan.subscriber_count || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={plan.active ? "default" : "secondary"}>
                          {plan.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {plan.created_at ? new Date(plan.created_at).toLocaleDateString('pt-PT') : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(plan)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem a certeza que deseja remover o plano "{plan.name}"? Esta ação não pode ser desfeita.
                                  {plan.subscriber_count && plan.subscriber_count > 0 && (
                                    <span className="block mt-2 text-red-600 font-medium">
                                      Atenção: Este plano tem {plan.subscriber_count} subscritor(es) ativo(s).
                                    </span>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(plan.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredPlans.length === 0 && (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-misty-gray mx-auto mb-4" />
                  <p className="text-misty-gray">Nenhum plano encontrado</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Criar/Editar Plano */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Editar Plano" : "Novo Plano"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00 para gratuito"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duração (dias)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                  placeholder="30 para mensal"
                />
              </div>
            </div>

            {/* Funcionalidades */}
            <div className="space-y-2">
              <Label>Funcionalidades</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Adicionar funcionalidade..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.features && formData.features.length > 0 && (
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{feature}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="active">Plano ativo</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-earthy-burgundy hover:bg-earthy-burgundy/90">
                {editingPlan ? "Atualizar" : "Criar"} Plano
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPlans;