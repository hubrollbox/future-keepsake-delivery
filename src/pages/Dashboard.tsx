
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Mail, Users, Plus, Edit, Trash2, Loader2, Trophy, Target, Award, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDeliveries } from "@/hooks/useDeliveries";
import UserStats from "@/components/gamification/UserStats";
import AchievementCard from "@/components/gamification/AchievementCard";
import QuestCard from "@/components/gamification/QuestCard";

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

  // Dados de gamificação (em produção viriam da base de dados)
  const achievements = [
    {
      id: "1",
      title: "Primeiro Passo",
      description: "Criaste a tua primeira entrega",
      icon: Target,
      unlocked: deliveries.length > 0,
      points: 50
    },
    {
      id: "2", 
      title: "Viajante Temporal",
      description: "Agendaste 5 entregas",
      icon: Clock,
      unlocked: deliveries.length >= 5,
      points: 100
    },
    {
      id: "3",
      title: "Mestre do Futuro",
      description: "Completaste 10 entregas",
      icon: Trophy,
      unlocked: false,
      points: 200
    }
  ];

  const quests = [
    {
      id: "1",
      title: "Explorador Temporal",
      description: "Cria a tua primeira entrega para o futuro",
      progress: deliveries.length > 0 ? 1 : 0,
      target: 1,
      reward: 50,
      timeLimit: "Sem limite"
    },
    {
      id: "2",
      title: "Construtor de Memórias",
      description: "Agenda 3 entregas diferentes",
      progress: deliveries.length > 3 ? 3 : deliveries.length,
      target: 3,
      reward: 100,
      timeLimit: "Esta semana"
    }
  ];

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
        {/* Welcome Section with Gamification */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo, Guardião {profile?.full_name || "Temporal"}! 🎮
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Continue a tua jornada através do tempo. Cada entrega é uma nova aventura!
          </p>
          
          {/* User Stats Card */}
          <UserStats profile={profile} />
        </div>

        {/* Stats Cards with Game Elements */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-800">{deliveries.length}</p>
                  <p className="text-blue-600">Missões Ativas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-800">{digitalDeliveries.length}</p>
                  <p className="text-purple-600">Portais Digitais</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-800">{physicalDeliveries.length}</p>
                  <p className="text-green-600">Cápsulas Físicas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quests Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Missões Ativas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-amber-600" />
                <span>Conquistas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deliveries List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span>As Tuas Entregas Temporais</span>
              </span>
              <Button 
                onClick={() => navigate('/create-delivery')}
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Missão
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
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-600 mb-4">A tua jornada temporal está prestes a começar!</p>
                <Button
                  onClick={() => navigate('/create-delivery')}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Iniciar Primeira Missão
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {deliveries.map((delivery) => (
                  <div key={delivery.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-yellow-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{delivery.title || "Missão Temporal"}</h3>
                          <Badge className={getStatusColor(delivery.status)}>
                            {getStatusText(delivery.status)}
                          </Badge>
                          <Badge variant="outline">
                            {delivery.delivery_type === "digital" ? "Portal Digital" : "Cápsula Física"}
                          </Badge>
                        </div>
                        
                        {delivery.recipient_name && (
                          <p className="text-gray-600 mb-2">
                            <strong>Destinatário:</strong> {delivery.recipient_name}
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

        {/* Motivational Quote with Game Theme */}
        <div className="mt-8 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-2xl p-6">
          <p className="text-center text-lg font-medium text-gray-700 italic">
            "Cada missão completada te aproxima do título de Mestre Temporal! 🏆✨"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
