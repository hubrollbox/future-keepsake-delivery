
import React, { useState, useEffect } from "react";
import { Search, MessageSquare, Calendar, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DigitalMessage {
  id: string;
  subject: string | null;
  body: string | null;
  delivery_id: string | null;
  created_at: string | null;
  deliveries?: {
    delivery_date: string;
    delivery_type: string;
    recipient_name: string | null;
    recipient_email: string | null;
  };
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<DigitalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("digital_messages")
        .select(`
          *,
          deliveries (
            delivery_date,
            delivery_type,
            recipient_name,
            recipient_email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching digital messages:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens digitais.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = 
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.body?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.deliveries?.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.deliveries?.recipient_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || message.deliveries?.delivery_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Mensagens Digitais</h1>
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
        <h1 className="text-2xl font-bold text-gray-900">Mensagens Digitais</h1>
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Todos os tipos</option>
            <option value="digital_message">Mensagem Digital</option>
            <option value="video_message">Mensagem de Vídeo</option>
            <option value="audio_message">Mensagem de Áudio</option>
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
                      {message.subject || "Mensagem sem assunto"}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    {message.deliveries?.delivery_type && (
                      <div>
                        <strong>Tipo:</strong> {message.deliveries.delivery_type}
                      </div>
                    )}
                    {message.deliveries?.delivery_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <strong>Entrega:</strong> {new Date(message.deliveries.delivery_date).toLocaleDateString('pt-PT')}
                      </div>
                    )}
                    {message.deliveries?.recipient_name && (
                      <div>
                        <strong>Destinatário:</strong> {message.deliveries.recipient_name}
                      </div>
                    )}
                    {message.deliveries?.recipient_email && (
                      <div>
                        <strong>Email:</strong> {message.deliveries.recipient_email}
                      </div>
                    )}
                  </div>
                  
                  {message.body && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Preview:</strong> {message.body.substring(0, 100)}
                      {message.body.length > 100 && "..."}
                    </p>
                  )}

                  {message.created_at && (
                    <p className="text-xs text-gray-500">
                      Criada em: {new Date(message.created_at).toLocaleDateString('pt-PT')} às {new Date(message.created_at).toLocaleTimeString('pt-PT')}
                    </p>
                  )}
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
                        <DialogTitle>{message.subject || "Mensagem Digital"}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {message.deliveries && (
                          <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="font-semibold mb-2">Detalhes da Entrega</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div><strong>Tipo:</strong> {message.deliveries.delivery_type}</div>
                              <div><strong>Data:</strong> {new Date(message.deliveries.delivery_date).toLocaleDateString('pt-PT')}</div>
                              <div><strong>Destinatário:</strong> {message.deliveries.recipient_name || "Não especificado"}</div>
                              <div><strong>Email:</strong> {message.deliveries.recipient_email || "Não especificado"}</div>
                            </div>
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold mb-2">Conteúdo da Mensagem</h4>
                          <div className="bg-white border p-4 rounded-md max-h-96 overflow-y-auto">
                            {message.body || "Nenhum conteúdo disponível"}
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
            <p className="text-gray-600">Nenhuma mensagem digital encontrada.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminMessages;
