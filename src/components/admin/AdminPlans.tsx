import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, CreditCard, Search, Users } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  subscriber_count?: number;
  features: string[];
  limitations: string[];
  keepsakeLimit: string;
  popular: boolean;
  active: boolean;
  created_at?: string;
  updated_at?: string;

  };

  // Removed PlanInsert and PlanUpdate types

interface PlanFormData {
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  limitations: string[];
  keepsakeLimit: string;
  popular: boolean;
  active: boolean;
}

//
const AdminPlans = () => {
  // Função para abrir o diálogo de edição
  const openEditDialog = (plan: Plan) => {
    resetForm(plan);
    setIsDialogOpen(true);
  };
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // filteredPlans depende de searchTerm, por isso é declarado após
  const filteredPlans = plans.filter((plan) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      plan.name.toLowerCase().includes(term) ||
      (plan.description && plan.description.toLowerCase().includes(term))
    );
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<PlanFormData>({
  name: "",
  description: "",
  price_monthly: 0,
  price_yearly: 0,
  features: [],
  limitations: [],
  keepsakeLimit: "",
  popular: false,
  active: true
  });


  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('name');
      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar planos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const planData: Plan = {
        id: editingPlan?.id || '',
        name: formData.name,
        description: formData.description,
        price_monthly: formData.price_monthly,
        price_yearly: formData.price_yearly,
        features: formData.features,
        limitations: formData.limitations,
        keepsakeLimit: formData.keepsakeLimit,
        popular: formData.popular,
        active: formData.active
      };
      if (editingPlan) {
        // Atualizar plano existente
        const { error } = await supabase
          .from('plans')
          .update(planData)
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
          .insert([planData]);
        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Plano criado com sucesso!"
        });
      }
      setIsDialogOpen(false);
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

  const resetForm = (plan?: Plan) => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        description: plan.description || "",
        price_monthly: plan.price_monthly || 0,
        price_yearly: plan.price_yearly || 0,
        features: plan.features || [],
        limitations: plan.limitations || [],
        keepsakeLimit: plan.keepsakeLimit || "",
        popular: plan.popular || false,
        active: plan.active || true
      });
      setEditingPlan(plan);
    } else {
      setFormData({
        name: "",
        description: "",
        price_monthly: 0,
        price_yearly: 0,
        features: [],
        limitations: [],
        keepsakeLimit: "",
        popular: false,
        active: true
      });
      setEditingPlan(null);
    }
  };
  // Função para remover plano
  const handleDeletePlan = async (planId: string) => {
    try {
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

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };




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
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan: Plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          {plan.description && (
                            <div className="text-sm text-misty-gray">{plan.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {typeof plan.price_monthly === 'number' && plan.price_monthly > 0
                          ? `€${plan.price_monthly}/mês`
                          : 'Gratuito'}
                        {typeof plan.price_yearly === 'number' && plan.price_yearly > 0 && (
                          <span className="block text-xs text-misty-gray">ou €{plan.price_yearly}/ano</span>
                        )}
                      </TableCell>
                      {/* Removido campo duration_months pois não existe em PlanFormData */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-misty-gray" />
                          <span>{plan.subscriber_count || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={plan.active !== false ? "default" : "secondary"}>
                          {plan.active !== false ? "Ativo" : "Inativo"}
                        </Badge>
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
                                  onClick={() => handleDeletePlan(plan.id)}
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
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do plano"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_monthly">Preço Mensal (€)</Label>
                <Input
                  id="price_monthly"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_monthly}
                  onChange={(e) => setFormData({ ...formData, price_monthly: parseFloat(e.target.value) || 0 })}
                  placeholder="Digite o valor mensal do plano"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_yearly">Preço Anual (€)</Label>
                <Input
                  id="price_yearly"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_yearly}
                  onChange={(e) => setFormData({ ...formData, price_yearly: parseFloat(e.target.value) || 0 })}
                  placeholder="Digite o valor anual do plano"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Funcionalidades</Label>
              <Input
                id="features"
                value={formData.features.join(', ')}
                onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',').map(f => f.trim()).filter(f => f) })}
                placeholder="Separar por vírgulas"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-gray-300"
                title="Plano ativo"
                aria-label="Plano ativo"
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