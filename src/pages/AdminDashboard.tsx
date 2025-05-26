
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, Calendar, Mail, Users, Search, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - será substituído pelos dados do Supabase
  const [deliveries] = useState([
    {
      id: 1,
      type: "digital",
      title: "Carta para o meu aniversário",
      recipient: "João Silva",
      customerEmail: "joao@email.com",
      deliveryDate: "2024-12-25",
      status: "pending",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      type: "physical",
      title: "Presente de aniversário da Maria",
      recipient: "Maria Silva",
      customerEmail: "ana@email.com",
      deliveryDate: "2024-06-15",
      status: "delivered",
      location: "Rua das Flores, 123, Porto",
      createdAt: "2024-01-10"
    },
    {
      id: 3,
      type: "digital",
      title: "Vídeo de parabéns",
      recipient: "Pedro Santos",
      customerEmail: "carlos@email.com",
      deliveryDate: "2024-07-20",
      status: "pending",
      createdAt: "2024-01-20"
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

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === "pending").length,
    delivered: deliveries.filter(d => d.status === "delivered").length,
    digital: deliveries.filter(d => d.type === "digital").length,
    physical: deliveries.filter(d => d.type === "physical").length
  };

  const markAsDelivered = (id: number) => {
    // TODO: Implementar com Supabase
    console.log("Marking delivery as delivered:", id);
  };

  const cancelDelivery = (id: number) => {
    // TODO: Implementar com Supabase
    console.log("Cancelling delivery:", id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FuturoPresente - Admin
            </h1>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-gray-600">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-gray-600">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.delivered}</p>
                  <p className="text-gray-600">Entregues</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Mail className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.digital}</p>
                  <p className="text-gray-600">Digitais</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.physical}</p>
                  <p className="text-gray-600">Físicos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Procurar por título, destinatário ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deliveries List */}
        <Card>
          <CardHeader>
            <CardTitle>Gestão de Entregas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDeliveries.map((delivery) => (
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Destinatário:</strong> {delivery.recipient}</p>
                          <p><strong>Cliente:</strong> {delivery.customerEmail}</p>
                        </div>
                        <div>
                          <p><strong>Data de entrega:</strong> {new Date(delivery.deliveryDate).toLocaleDateString('pt-PT')}</p>
                          <p><strong>Criado em:</strong> {new Date(delivery.createdAt).toLocaleDateString('pt-PT')}</p>
                        </div>
                      </div>
                      
                      {delivery.location && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Local:</strong> {delivery.location}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      {delivery.status === "pending" && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => markAsDelivered(delivery.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Marcar Entregue
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => cancelDelivery(delivery.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
