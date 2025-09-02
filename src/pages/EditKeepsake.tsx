import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getTomorrowDate } from "@/utils/validation";

// Interface para o tipo Keepsake
interface Keepsake {
  id: string;
  title: string;
  content: string;
  delivery_date: string;
  recipient_email: string;
  recipient_phone?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  recipients?: Array<{
    name?: string;
    email?: string | null;
    phone?: string | null;
    delivery_channel?: string;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  }>;
}

// Definição do schema de validação usando Zod
const editKeepsakeSchema = z.object({
  title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres" }),
  content: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres" }),
  delivery_date: z.string().refine(
    (date) => new Date(date) >= new Date(getTomorrowDate()),
    { message: "A data de entrega deve ser no futuro" }
  ),
  recipient_email: z.string().email({ message: "Email inválido" }).nullable().optional(),
  recipient_phone: z.string().regex(/^\+?[0-9]{7,15}$/, { message: "Número de telefone inválido" }).nullable().optional(),
});

type EditKeepsakeFormValues = z.infer<typeof editKeepsakeSchema>;

const EditKeepsake = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [keepsake, setKeepsake] = useState<Keepsake | null>(null);

  const form = useForm<EditKeepsakeFormValues>({
    resolver: zodResolver(editKeepsakeSchema),
    defaultValues: {
      title: "",
      content: "",
      delivery_date: "",
      recipient_email: "",
      recipient_phone: "",
    },
  });

  // Buscar dados do keepsake existente
  useEffect(() => {
    const fetchKeepsake = async () => {
      setLoading(true);
      try {
        // Buscar keepsake com dados do destinatário
        const { data: keepsakeData, error: keepsakeError } = await supabase
          .from("keepsakes")
          .select(`
            *,
            recipients (
              name,
              email,
              phone,
              delivery_channel,
              street,
              city,
              state,
              postal_code,
              country
            )
          `)
          .eq("id", id)
          .single();

        if (keepsakeError) {
          throw keepsakeError;
        }

        if (keepsakeData) {
          setKeepsake(keepsakeData);
          const recipient = keepsakeData.recipients?.[0];
          
          const formValues: EditKeepsakeFormValues = {
            title: keepsakeData.title || "",
            content: keepsakeData.message_content || "",
            delivery_date: (keepsakeData.delivery_date 
              ? new Date(keepsakeData.delivery_date).toISOString().split("T")[0] 
              : new Date().toISOString().split("T")[0]) as string,
            recipient_email: recipient?.email || "",
            recipient_phone: recipient?.phone || "",
          };
          
          form.reset(formValues);
        }
      } catch (error: unknown) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar keepsake",
          description: error instanceof Error ? error.message : "Não foi possível carregar os dados do keepsake.",
        });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchKeepsake();
    }
  }, [id, form, toast, navigate]);

  const onSubmit = async (values: EditKeepsakeFormValues) => {
    setLoading(true);
    try {
      // Atualizar o keepsake no Supabase
      const { error: keepsakeError } = await supabase
        .from("keepsakes")
        .update({
          title: values.title,
          message_content: values.content,
          delivery_date: values.delivery_date,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (keepsakeError) {
        throw keepsakeError;
      }

      // Atualizar dados do destinatário se existirem
      if (keepsake?.recipients?.[0]) {
        const { error: recipientError } = await supabase
          .from("recipients")
          .update({
            email: values.recipient_email || null,
            phone: values.recipient_phone || null,
            updated_at: new Date().toISOString(),
          })
          .eq("keepsake_id", id);

        if (recipientError) {
          throw recipientError;
        }
      }

      toast({
        title: "Keepsake atualizado",
        description: "Seu keepsake foi atualizado com sucesso!",
      });

      navigate("/dashboard");
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar keepsake",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o keepsake.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !keepsake) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Editar Keepsake</CardTitle>
          <CardDescription>
            Atualize as informações do seu keepsake conforme necessário.
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
                      <Input placeholder="Título do keepsake" {...field} />
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
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Sua mensagem para o futuro"
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
                      <Input
                        type="date"
                        min={getTomorrowDate()}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A data em que seu keepsake será entregue.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipient_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Destinatário (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        {...field}
                        value={field.value || ""}
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
                    <FormLabel>Telefone do Destinatário (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+551199999999"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="flex justify-between px-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditKeepsake;