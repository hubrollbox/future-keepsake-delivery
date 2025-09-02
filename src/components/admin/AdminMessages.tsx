
import { useState, useEffect, useCallback } from "react";
import { Search, MessageSquare, Calendar, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  title: string;
  content: string;
  delivery_date: string;
  status: string;
  created_at: string;
  user_id: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("deliveries")
        .select("id, title, description, delivery_date, status, created_at, user_id")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Erro",
          description: error.message || "Não foi possível carregar as mensagens.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      const mappedData = (data || []).map(delivery => ({
        ...delivery,
        content: delivery.description || ""
      }));
      setMessages(mappedData);
    } catch (error: unknown) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Erro",
        description: (error as Error).message || "Não foi possível carregar as mensagens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = 
      message.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
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
        <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar mensagens..."
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
            <option value="scheduled">Agendada</option>
            <option value="delivered">Entregue</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {message.title}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <strong>Entrega:</strong> {new Date(message.delivery_date).toLocaleDateString('pt-PT')}
                    </div>
                    <div>
                      <strong>Estado:</strong> {message.status}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Preview:</strong> {message.content.substring(0, 100)}
                    {message.content.length > 100 && "..."}
                  </p>

                  <p className="text-xs text-gray-500">
                    Criada em: {new Date(message.created_at).toLocaleDateString('pt-PT')} às {new Date(message.created_at).toLocaleTimeString('pt-PT')}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        Ver Completa
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{message.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="font-semibold mb-2">Detalhes</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><strong>Data de entrega:</strong> {new Date(message.delivery_date).toLocaleDateString('pt-PT')}</div>
                            <div><strong>Estado:</strong> {message.status}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Conteúdo da Mensagem</h4>
                          <div className="bg-white border p-4 rounded-md max-h-96 overflow-y-auto">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma mensagem encontrada.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminMessages;
