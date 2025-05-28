
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Mail, Users, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDeliveries } from "@/hooks/useDeliveries";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { deliveries, loading, deleteDelivery } = useDeliveries();

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "entregue": return "bg-green-100 text-green-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case "pendente": return "Pendente";
      case "entregue": return "Entregue";
      case "cancelado": return "Cancelado";
      default: return "Desconhecido";
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tens a certeza que queres eliminar esta entrega?")) {
      await deleteDelivery(id);
    }
  };

  const digitalDeliveries = deliveries.filter(d => d.delivery_type === "digital");
  const physicalDeliveries = deliveries.filter(d => d.delivery_type === "physical");

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-yellow-700" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-700 to-yellow-600 bg-clip-text text-transparent">
              FuturoPresente
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Olá, {profile?.full_name || user?.email}!
            </span>
            <Button 
              onClick={() => navigate('/create-delivery')}
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Entrega
            </Button>
            <Button variant="ghost" onClick={signOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Olá, {profile?.full_name || "Guardião"}! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Aqui estão as tuas entregas futuras. Cada uma delas é uma pequena cápsula do tempo.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-yellow-700" />
                <div>
                  <p className="text-2xl font-bold">{deliveries.length}</p>
                  <p className="text-gray-600">Entregas Agendadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Mail className="h-8 w-8 text-amber-700" />
                <div>
                  <p className="text-2xl font-bold">{digitalDeliveries.length}</p>
                  <p className="text-gray-600">Presentes Digitais</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{physicalDeliveries.length}</p>
                  <p className="text-gray-600">Presentes Físicos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deliveries List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>As Tuas Entregas</span>
              <Button 
                onClick={() => navigate('/create-delivery')}
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Nova
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-700" />
                <span className="ml-2 text-yellow-700">A carregar entregas...</span>
              </div>
            ) : deliveries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Ainda não tens entregas agendadas.</p>
                <Button
                  onClick={() => navigate('/create-delivery')}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar a Primeira Entrega
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {deliveries.map((delivery) => (
                  <div key={delivery.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{delivery.title || "Entrega sem título"}</h3>
                          <Badge className={getStatusColor(delivery.status)}>
                            {getStatusText(delivery.status)}
                          </Badge>
                          <Badge variant="outline">
                            {delivery.delivery_type === "digital" ? "Digital" : "Físico"}
                          </Badge>
                        </div>
                        
                        {delivery.recipient_name && (
                          <p className="text-gray-600 mb-2">
                            <strong>Para:</strong> {delivery.recipient_name}
                          </p>
                        )}
                        
                        <p className="text-gray-600 mb-2">
                          <strong>Data de entrega:</strong> {new Date(delivery.delivery_date).toLocaleDateString('pt-PT')}
                        </p>
                        
                        {delivery.delivery_address && (
                          <p className="text-gray-600 mb-2">
                            <strong>Local:</strong> {delivery.delivery_address}
                          </p>
                        )}
                        
                        {delivery.message && (
                          <p className="text-gray-600 italic">
                            "{delivery.message}"
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(delivery.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <p className="text-center text-lg font-medium text-gray-700 italic">
            "Cada entrega agendada é uma promessa que fazes ao teu futuro eu. ✨"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
