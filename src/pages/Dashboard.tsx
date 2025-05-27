
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Mail, Users, Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock data - será substituído pelos dados do Supabase
  const [deliveries] = useState([
    {
      id: 1,
      type: "digital",
      title: "Carta para o meu aniversário",
      recipient: "Eu mesmo",
      deliveryDate: "2024-12-25",
      status: "pending",
      message: "Uma mensagem especial para o meu futuro eu..."
    },
    {
      id: 2,
      type: "physical",
      title: "Presente de aniversário da Maria",
      recipient: "Maria Silva",
      deliveryDate: "2024-06-15",
      status: "delivered",
      location: "Rua das Flores, 123, Porto"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pendente";
      case "delivered": return "Entregue";
      case "cancelled": return "Cancelado";
      default: return "Desconhecido";
    }
  };

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
            <Button 
              onClick={() => navigate('/create-delivery')}
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Entrega
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Olá! 👋
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
                  <p className="text-2xl font-bold">2</p>
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
                  <p className="text-2xl font-bold">1</p>
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
                  <p className="text-2xl font-bold">1</p>
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
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{delivery.title}</h3>
                        <Badge className={getStatusColor(delivery.status)}>
                          {getStatusText(delivery.status)}
                        </Badge>
                        <Badge variant="outline">
                          {delivery.type === "digital" ? "Digital" : "Físico"}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        <strong>Para:</strong> {delivery.recipient}
                      </p>
                      
                      <p className="text-gray-600 mb-2">
                        <strong>Data de entrega:</strong> {new Date(delivery.deliveryDate).toLocaleDateString('pt-PT')}
                      </p>
                      
                      {delivery.location && (
                        <p className="text-gray-600 mb-2">
                          <strong>Local:</strong> {delivery.location}
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
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
