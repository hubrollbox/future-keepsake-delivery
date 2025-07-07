
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Plus, Calendar, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Delivery {
  id: string;
  title: string;
  recipient_name: string;
  delivery_date: string;
  status: string | null;
  message?: string;
}

interface TimeCapsuleSectionProps {
  deliveries: Delivery[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const TimeCapsuleSection = ({ deliveries, loading, onDelete }: TimeCapsuleSectionProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "scheduled": return "bg-warm-yellow text-warm-brown";
      case "delivered": return "bg-sage-green text-gentle-black";
      case "cancelled": return "bg-dusty-rose text-gentle-black";
      default: return "bg-misty-gray text-gentle-black";
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case "scheduled": return "Agendado";
      case "delivered": return "Entregue";
      case "cancelled": return "Cancelado";
      default: return "Desconhecido";
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tens a certeza que queres eliminar esta entrega?")) {
      await onDelete(id);
    }
  };

  return (
    <div className="mb-8">
      <Card className="shadow-soft border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-serif text-blue-900 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Cápsula do Tempo
          </CardTitle>
          <Button variant="brand" onClick={() => navigate("/create-keepsake")}> 
            <Plus className="h-4 w-4 mr-2" />
            Criar Cápsula do Tempo
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : deliveries.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 mx-auto text-blue-300 mb-4" />
              <p className="text-gray-500 mb-4">Ainda não tens mensagens na tua cápsula do tempo.</p>
              {/* Removido o botão duplicado de criar mensagem */}
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {deliveries.map((delivery) => (
                <Card key={delivery.id} className="border border-blue-100 bg-blue-50/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900">{delivery.title || "Mensagem"}</h4>
                        <p className="text-sm text-gray-600">Para: {delivery.recipient_name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(delivery.delivery_date).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(delivery.status)}>
                        {getStatusText(delivery.status)}
                      </Badge>
                    </div>
                    {delivery.message && (
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{delivery.message}</p>
                    )}
                    <div className="flex gap-2">
                      {delivery.status === "scheduled" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/edit-delivery/${delivery.id}`)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(delivery.id)}>
                            <Trash2 className="h-3 w-3 mr-1" />
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {deliveries.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={() => navigate("/deliveries")}>
                    Ver Todas as Mensagens ({deliveries.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeCapsuleSection;
