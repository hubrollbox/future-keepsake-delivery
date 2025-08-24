import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Heart, 
  Package, 
  Mail, 
  Star, 
  Play,
  Pause
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  deliveryDate: Date;
  type: 'digital' | 'physical';
  status: 'pending' | 'delivered' | 'scheduled';
  emotion: string;
  recipient: string;
  daysUntil: number;
}

interface TimelineVisualizationProps {
  events?: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
}

const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({ 
  events = [], 
  onEventClick 
}) => {
  const [currentView, setCurrentView] = useState<'timeline' | 'calendar'>('timeline');
  const [isAnimating] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  // Mock data para demonstração
  const mockEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'Carta de Aniversário para Maria',
      description: 'Uma mensagem especial para o 25º aniversário',
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      type: 'digital',
      status: 'scheduled',
      emotion: 'love',
      recipient: 'Maria Silva',
      daysUntil: 7
    },
    {
      id: '2',
      title: 'Cápsula de Formatura',
      description: 'Memórias da universidade para abrir em 5 anos',
      deliveryDate: new Date(Date.now() + 365 * 5 * 24 * 60 * 60 * 1000), // 5 anos
      type: 'physical',
      status: 'pending',
      emotion: 'nostalgia',
      recipient: 'Eu mesmo',
      daysUntil: 1825
    },
    {
      id: '3',
      title: 'Vídeo para o Bebê',
      description: 'Primeira mensagem para quando completar 18 anos',
      deliveryDate: new Date(Date.now() + 365 * 18 * 24 * 60 * 60 * 1000), // 18 anos
      type: 'digital',
      status: 'scheduled',
      emotion: 'hope',
      recipient: 'João Pedro',
      daysUntil: 6570
    }
  ];

  const displayEvents = events.length > 0 ? events : mockEvents;

  const getEmotionColor = (emotion: string) => {
    const colors = {
      love: 'bg-red-100 text-red-700 border-red-200',
      nostalgia: 'bg-orange-100 text-orange-700 border-orange-200',
      hope: 'bg-blue-100 text-blue-700 border-blue-200',
      gratitude: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      celebration: 'bg-pink-100 text-pink-700 border-pink-200'
    };
    return colors[emotion as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Star className="w-4 h-4 text-golden-honey" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeUntil = (days: number) => {
    if (days < 30) {
      return `${days} dias`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.floor(days / 365);
      const remainingMonths = Math.floor((days % 365) / 30);
      return `${years} ${years === 1 ? 'ano' : 'anos'}${remainingMonths > 0 ? ` e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}` : ''}`;
    }
  };

  const TimelineView = () => (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-dusty-rose via-steel-blue to-golden-honey"></div>
      
      <div className="space-y-8">
        {displayEvents
          .sort((a, b) => a.daysUntil - b.daysUntil)
          .map((event) => (
            <div
              key={event.id}
              className={`relative flex items-start space-x-6 transition-all duration-500 hover:scale-105 cursor-pointer ${
                isAnimating ? 'opacity-50' : 'opacity-100'
              }`}
              onClick={() => onEventClick?.(event)}
            >
              {/* Timeline Dot */}
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  event.type === 'digital' 
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
                    : 'bg-gradient-to-br from-purple-400 to-purple-600'
                }`}>
                  {event.type === 'digital' ? (
                    <Mail className="w-8 h-8 text-white" />
                  ) : (
                    <Package className="w-8 h-8 text-white" />
                  )}
                </div>
                {/* Pulse Animation for Upcoming Events */}
                {event.daysUntil <= 30 && (
                  <div className="absolute inset-0 rounded-full bg-dusty-rose animate-ping opacity-20"></div>
                )}
              </div>

              {/* Event Card */}
              <Card className="flex-1 hover:shadow-lg transition-all duration-300 border-l-4 border-l-dusty-rose">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(event.status)}
                      <h3 className="font-semibold text-steel-blue">{event.title}</h3>
                    </div>
                    <Badge className={getEmotionColor(event.emotion)}>
                      {event.emotion}
                    </Badge>
                  </div>
                  
                  <p className="text-misty-gray mb-3">{event.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-dusty-rose" />
                        <span>Para: {event.recipient}</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-steel-blue">
                        {formatTimeUntil(event.daysUntil)}
                      </div>
                      <div className="text-xs text-misty-gray">
                        {event.deliveryDate.toLocaleDateString('pt-PT')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
      </div>
    </div>
  );

  const CalendarView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayEvents.map((event) => (
        <Card 
          key={event.id} 
          className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
          onClick={() => onEventClick?.(event)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge className={getEmotionColor(event.emotion)}>
                {event.emotion}
              </Badge>
              {event.type === 'digital' ? (
                <Mail className="w-5 h-5 text-blue-500" />
              ) : (
                <Package className="w-5 h-5 text-purple-500" />
              )}
            </div>
            <h3 className="font-semibold text-steel-blue mb-2">{event.title}</h3>
            <p className="text-sm text-misty-gray mb-3">{event.description}</p>
            <div className="text-xs text-misty-gray">
              <div>Para: {event.recipient}</div>
              <div className="font-semibold text-dusty-rose mt-1">
                Em {formatTimeUntil(event.daysUntil)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-serif text-steel-blue mb-2">
            Sua Jornada no Tempo
          </h2>
          <p className="text-misty-gray">
            Acompanhe suas entregas futuras e reviva memórias passadas
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={currentView === 'timeline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('timeline')}
              className="rounded-md"
            >
              Timeline
            </Button>
            <Button
              variant={currentView === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('calendar')}
              className="rounded-md"
            >
              Grade
            </Button>
          </div>

          {/* Auto-play Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoPlay(!autoPlay)}
            className="flex items-center space-x-2"
          >
            {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{autoPlay ? 'Pausar' : 'Auto'}</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-dusty-rose">
              {displayEvents.filter(e => e.status === 'scheduled').length}
            </div>
            <div className="text-sm text-misty-gray">Agendadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-steel-blue">
              {displayEvents.filter(e => e.daysUntil <= 30).length}
            </div>
            <div className="text-sm text-misty-gray">Este Mês</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-golden-honey">
              {displayEvents.filter(e => e.status === 'delivered').length}
            </div>
            <div className="text-sm text-misty-gray">Entregues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">
              {Math.min(...displayEvents.map(e => e.daysUntil))}
            </div>
            <div className="text-sm text-misty-gray">Dias até próxima</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        {currentView === 'timeline' ? <TimelineView /> : <CalendarView />}
      </div>

      {/* Empty State */}
      {displayEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-lavender-mist rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-12 h-12 text-dusty-rose" />
          </div>
          <h3 className="text-xl font-semibold text-steel-blue mb-2">
            Sua jornada começa aqui
          </h3>
          <p className="text-misty-gray mb-6">
            Crie sua primeira cápsula do tempo e comece a construir memórias para o futuro
          </p>
          <Button className="bg-dusty-rose hover:bg-dusty-rose/90">
            Criar Primeira Cápsula
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimelineVisualization;

