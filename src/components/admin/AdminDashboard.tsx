
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Package, TrendingUp, Clock, Mail, Calendar, Database } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Utilizadores Ativos",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Entregas Agendadas",
      value: "567",
      change: "+8%",
      trend: "up",
      icon: <Package className="h-5 w-5" />
    },
    {
      title: "Taxa de Entrega",
      value: "98.2%",
      change: "+0.5%",
      trend: "up",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      title: "Tempo Médio",
      value: "3.2 min",
      change: "-0.3 min",
      trend: "down",
      icon: <Clock className="h-5 w-5" />
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "delivery",
      message: "Nova entrega criada por João Silva",
      time: "há 5 minutos",
      icon: <Mail className="h-4 w-4 text-earthy-burgundy" />
    },
    {
      id: 2,
      type: "user",
      message: "Maria Santos registou-se na plataforma",
      time: "há 12 minutos",
      icon: <Users className="h-4 w-4 text-earthy-burgundy" />
    },
    {
      id: 3,
      type: "system",
      message: "Backup da base de dados concluído",
      time: "há 1 hora",
      icon: <Database className="h-4 w-4 text-earthy-burgundy" />
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-hero-sm text-steel-blue font-fraunces mb-2">
          Painel de <span className="text-earthy-burgundy">Administração</span>
        </h1>
        <p className="text-misty-gray">Visão geral da plataforma FuturoPresente</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="emotion-card border-dusty-rose/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-misty-gray">{stat.title}</p>
                  <p className="text-2xl font-bold text-steel-blue">{stat.value}</p>
                  <div className="flex items-center space-x-1">
                    <Badge 
                      className={`text-xs ${
                        stat.trend === 'up' 
                          ? 'bg-earthy-burgundy/10 text-earthy-burgundy' 
                          : 'bg-sand-beige text-steel-blue'
                      }`}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-earthy-burgundy/10 rounded-xl text-earthy-burgundy">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="emotion-card border-dusty-rose/20">
          <CardHeader>
            <CardTitle className="text-steel-blue font-fraunces flex items-center space-x-2">
              <Clock className="h-5 w-5 text-earthy-burgundy" />
              <span>Atividade Recente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-sand-beige/30">
                  <div className="p-1.5 bg-white rounded-lg">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-steel-blue text-sm font-medium">{activity.message}</p>
                    <p className="text-misty-gray text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="emotion-card border-dusty-rose/20">
          <CardHeader>
            <CardTitle className="text-steel-blue font-fraunces flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-earthy-burgundy" />
              <span>Ações Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 text-left bg-earthy-burgundy/5 hover:bg-earthy-burgundy/10 rounded-xl transition-colors duration-200 group">
                <Users className="h-6 w-6 text-earthy-burgundy mb-2 group-hover:scale-105 transition-transform" />
                <p className="text-steel-blue font-medium text-sm">Gerir Utilizadores</p>
              </button>
              <button className="p-4 text-left bg-earthy-burgundy/5 hover:bg-earthy-burgundy/10 rounded-xl transition-colors duration-200 group">
                <Package className="h-6 w-6 text-earthy-burgundy mb-2 group-hover:scale-105 transition-transform" />
                <p className="text-steel-blue font-medium text-sm">Ver Entregas</p>
              </button>
              <button className="p-4 text-left bg-earthy-burgundy/5 hover:bg-earthy-burgundy/10 rounded-xl transition-colors duration-200 group">
                <Mail className="h-6 w-6 text-earthy-burgundy mb-2 group-hover:scale-105 transition-transform" />
                <p className="text-steel-blue font-medium text-sm">Mensagens</p>
              </button>
              <button className="p-4 text-left bg-earthy-burgundy/5 hover:bg-earthy-burgundy/10 rounded-xl transition-colors duration-200 group">
                <TrendingUp className="h-6 w-6 text-earthy-burgundy mb-2 group-hover:scale-105 transition-transform" />
                <p className="text-steel-blue font-medium text-sm">Relatórios</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
