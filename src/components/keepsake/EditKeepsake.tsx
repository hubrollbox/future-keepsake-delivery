import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Keepsake, useKeepsakes } from '@/hooks/useKeepsakes';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Schema de validação para o formulário de edição
const editKeepsakeSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  content: z.string().min(10, 'O conteúdo deve ter pelo menos 10 caracteres'),
  delivery_date: z.string().refine(date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) > today;
  }, { message: 'A data de entrega deve ser no futuro' }),
  recipient_email: z.string().email('Email inválido').nullable().optional(),
  recipient_phone: z.string().regex(/^\+?[0-9]{7,15}$/, 'Número de telefone inválido').nullable().optional(),
});

type EditKeepsakeFormValues = z.infer<typeof editKeepsakeSchema>;

export const EditKeepsake = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { keepsakes, loading, updateKeepsake } = useKeepsakes();
  const [keepsake, setKeepsake] = useState<Keepsake | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuração do formulário com react-hook-form e zod
  const form = useForm<EditKeepsakeFormValues>({
    resolver: zodResolver(editKeepsakeSchema),
    defaultValues: {
      title: '',
      content: '',
      delivery_date: '',
      recipient_email: '',
      recipient_phone: '',
    },
  });

  // Buscar o keepsake pelo ID quando o componente montar
  useEffect(() => {
    if (id && keepsakes.length > 0) {
      const foundKeepsake = keepsakes.find(k => k.id === id);
      if (foundKeepsake) {
        setKeepsake(foundKeepsake);
        
        // Formatar a data para o formato esperado pelo input type="date"
        const formattedDate = foundKeepsake.delivery_date 
          ? format(new Date(foundKeepsake.delivery_date), 'yyyy-MM-dd')
          : '';
        
        // Preencher o formulário com os dados do keepsake
        form.reset({
          title: foundKeepsake.title || '',
          content: foundKeepsake.content || '',
          delivery_date: formattedDate,
          recipient_email: foundKeepsake.recipient_email || '',
          recipient_phone: foundKeepsake.recipient_phone || '',
        });
      } else {
        toast({
          title: "Erro",
          description: "Cápsula do tempo não encontrada",
          variant: "destructive"
        });
        navigate('/dashboard');
      }
    }
  }, [id, keepsakes, navigate, toast, form]);

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: EditKeepsakeFormValues) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      // Converter a data de string para o formato ISO
      const deliveryDate = new Date(data.delivery_date);
      
      const success = await updateKeepsake(id, {
        title: data.title,
        content: data.content,
        delivery_date: deliveryDate.toISOString(),
        recipient_email: data.recipient_email || null,
        recipient_phone: data.recipient_phone || null,
      } as any);
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao atualizar keepsake:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a cápsula do tempo",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !keepsake) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Editar Cápsula do Tempo</CardTitle>
          <CardDescription>
            Atualize os detalhes da sua cápsula do tempo que será entregue no futuro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título da sua cápsula" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Escreva sua mensagem para o futuro" 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="delivery_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Entrega</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      A data em que sua cápsula será entregue.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {keepsake.type === 'digital' && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="recipient_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email do Destinatário</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="email@exemplo.com" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recipient_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone do Destinatário</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="+5511999999999" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Formato internacional: +5511999999999
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditKeepsake;