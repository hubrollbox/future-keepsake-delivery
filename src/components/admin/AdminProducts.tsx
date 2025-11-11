import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Package, Search, Filter, Minus, Upload, Download } from "lucide-react";
import { Database } from "@/integrations/supabase/database.types";

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  type: string;
  active: boolean;
  icon?: string;
  poetry?: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterActive, setFilterActive] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    type: "physical",
    active: true,
    icon: "",
    poetry: ""
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const productTypes = [
    { value: "physical", label: "Produto Físico" },
    { value: "digital", label: "Produto Digital" },
    { value: "service", label: "Serviço" },
    { value: "subscription", label: "Subscrição" }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Atualizar produto existente
        const updateData: ProductUpdate = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          type: formData.type,
          active: formData.active,
          icon: formData.icon || null,
          poetry: formData.poetry || null
        } as any;

        const { error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!"
        });
      } else {
        // Criar novo produto
        const insertData: ProductInsert = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          type: formData.type,
          active: formData.active,
          icon: formData.icon || null,
          poetry: formData.poetry || null
        } as any;

        const { error } = await supabase
          .from('products')
          .insert([insertData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Produto criado com sucesso!"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso!"
      });
      
      fetchProducts();
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto.",
        variant: "destructive"
      });
    }
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: Math.max(0, newStock) })
        .eq('id', productId);

      if (error) throw error;

      fetchProducts();
      toast({
        title: "Sucesso",
        description: "Stock atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar stock:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o stock.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      type: "physical",
      active: true,
      icon: "",
      poetry: ""
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      type: product.type,
      active: product.active ?? true,
      icon: product.icon || "",
      poetry: (product as any).poetry || ""
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || product.type === filterType;
    const matchesActive = filterActive === "all" || 
                         (filterActive === "active" && product.active) ||
                         (filterActive === "inactive" && !product.active);
    
    return matchesSearch && matchesType && matchesActive;
  });

  const getTypeLabel = (type: string) => {
    const typeObj = productTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const handleExportCSV = () => {
    const csvHeaders = ['Nome', 'Descrição', 'Preço', 'Stock', 'Tipo', 'Ativo', 'Ícone', 'Data de Criação'];
    const csvData = products.map(product => [
      product.name,
      product.description || '',
      product.price,
      product.stock,
      getTypeLabel(product.type),
      product.active ? 'Sim' : 'Não',
      product.icon || '',
      product.created_at ? new Date(product.created_at).toLocaleDateString('pt-PT') : ''
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `produtos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação concluída",
      description: "Os dados dos produtos foram exportados com sucesso.",
    });
  };

  const handleImportCSV = async (file: File) => {
    setIsUploading(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Arquivo CSV deve conter pelo menos um cabeçalho e uma linha de dados');
      }

      const headers = lines[0]?.split(',').map(h => h.replace(/"/g, '').trim()) || [];
      
      // Verificar se os cabeçalhos essenciais estão presentes
      const requiredHeaders = ['Nome', 'Preço', 'Stock', 'Tipo'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Cabeçalhos obrigatórios em falta: ${missingHeaders.join(', ')}`);
      }

      const dataLines = lines.slice(1);
      const productsToImport: ProductInsert[] = [];

      for (const line of dataLines) {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        
        if (values.length < headers.length) continue;

        const nameIndex = headers.indexOf('Nome');
        const descIndex = headers.indexOf('Descrição');
        const priceIndex = headers.indexOf('Preço');
        const stockIndex = headers.indexOf('Stock');
        const typeIndex = headers.indexOf('Tipo');
        const activeIndex = headers.indexOf('Ativo');
        const iconIndex = headers.indexOf('Ícone');

        const productData: ProductInsert = {
          name: nameIndex >= 0 ? values[nameIndex] || '' : '',
          description: descIndex >= 0 ? values[descIndex] || '' : '',
          price: priceIndex >= 0 ? parseFloat(values[priceIndex] || '0') || 0 : 0,
          stock: stockIndex >= 0 ? parseInt(values[stockIndex] || '0') || 0 : 0,
          type: typeIndex >= 0 ? values[typeIndex] || 'physical' : 'physical',
          active: activeIndex >= 0 ? values[activeIndex]?.toLowerCase() === 'sim' : true,
          icon: iconIndex >= 0 ? values[iconIndex] || null : null
        };

        if (productData.name && productData.price >= 0 && (productData.stock ?? 0) >= 0) {
          productsToImport.push(productData);
        }
      }

      if (productsToImport.length === 0) {
        throw new Error('Nenhum produto válido encontrado no arquivo CSV');
      }

      // Inserir produtos no banco de dados
      const { error } = await supabase
        .from('products')
        .insert(productsToImport);

      if (error) throw error;

      await fetchProducts();
      setCsvFile(null);
      
      toast({
        title: "Importação concluída",
        description: `${productsToImport.length} produtos foram importados com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao importar CSV:', error);
      toast({
        title: "Erro na importação",
        description: error instanceof Error ? error.message : "Erro desconhecido ao importar o arquivo CSV.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Efeito para processar o arquivo CSV quando selecionado
  useEffect(() => {
    if (csvFile) {
      handleImportCSV(csvFile);
    }
  }, [csvFile]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-steel-blue font-fraunces">Gestão de Produtos</h1>
          <p className="text-misty-gray mt-2">Gerir produtos, stock e preços</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            className="hidden"
            id="csv-upload"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('csv-upload')?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Carregando...' : 'Importar CSV'}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={openCreateDialog} className="bg-earthy-burgundy hover:bg-earthy-burgundy/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Filtros e Pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-misty-gray" />
                <Input
                  placeholder="Pesquisar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {productTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterActive} onValueChange={setFilterActive}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Produtos */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Produtos ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-earthy-burgundy mx-auto"></div>
              <p className="text-misty-gray mt-2">Carregando produtos...</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Nome</TableHead>
                    <TableHead className="min-w-[100px]">Tipo</TableHead>
                    <TableHead className="min-w-[80px]">Preço</TableHead>
                    <TableHead className="min-w-[120px]">Stock</TableHead>
                    <TableHead className="min-w-[80px]">Estado</TableHead>
                    <TableHead className="min-w-[100px]">Criado</TableHead>
                    <TableHead className="text-right min-w-[120px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="max-w-[200px]">
                        <div>
                          <div className="font-medium truncate">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-misty-gray truncate">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getTypeLabel(product.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>€{product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {product.type === 'service' ? (
                          <span className="text-sm text-misty-gray">N/A</span>
                        ) : (
                          <div className="flex items-center gap-1 min-w-[120px]">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStockUpdate(product.id, product.stock - 1)}
                              disabled={product.stock <= 0}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="min-w-[2rem] text-center text-sm">{product.stock}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStockUpdate(product.id, product.stock + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.active ? "default" : "secondary"}>
                          {product.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {product.created_at ? new Date(product.created_at).toLocaleDateString('pt-PT') : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(product)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 h-8 w-8 p-0">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem a certeza que deseja remover o produto "{product.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product.id)}
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
              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-misty-gray mx-auto mb-4" />
                  <p className="text-misty-gray">Nenhum produto encontrado</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Criar/Editar Produto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="type">Tipo *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                <Label htmlFor="price">Preço (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              {formData.type !== 'service' && (
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">URL do Ícone</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="https://exemplo.com/icone.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poetry">Frase Emotiva</Label>
              <Textarea
                id="poetry"
                value={formData.poetry}
                onChange={(e) => setFormData({ ...formData, poetry: e.target.value })}
                rows={2}
                placeholder="Uma frase poética que transmite a essência do produto..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="active">Produto ativo</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-earthy-burgundy hover:bg-earthy-burgundy/90">
                {editingProduct ? "Atualizar" : "Criar"} Produto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;