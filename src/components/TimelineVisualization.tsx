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

  const displayEvents = events;
  const nextDeliveryInDays = displayEvents.length > 0
    ? Math.min(...displayEvents.map((event) => event.daysUntil))
    : 0;

  const getEmotionColor = (emotion: string) => {
    // Simplified palette: only neutral gray blocks and a subtle red accent for 'love'
    const colors = {
      love: 'bg-keepla-red/10 text-keepla-red border-keepla-red/20',
      nostalgia: 'bg-keepla-gray/10 text-keepla-gray border-keepla-gray',
      hope: 'bg-keepla-gray/10 text-keepla-gray border-keepla-gray',
      gratitude: 'bg-keepla-gray/10 text-keepla-gray border-keepla-gray',
      celebration: 'bg-keepla-gray/10 text-keepla-gray border-keepla-gray'
    };
    return colors[emotion as keyof typeof colors] || 'bg-keepla-gray/10 text-keepla-gray border-keepla-gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Star className="w-4 h-4 text-keepla-red" />;
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
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-keepla-gray-dark"></div>
      
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
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  event.type === 'digital' 
                    ? 'bg-keepla-gray' 
                    : 'bg-keepla-red'
                }`}>
                  {event.type === 'digital' ? (
                      <Mail className="w-8 h-8 text-white" />
                    ) : (
                      <Package className="w-8 h-8 text-white" />
                    )}
                </div>
                {/* Pulse Animation for Upcoming Events */}
                {event.daysUntil <= 30 && (
                  <div className="absolute inset-0 rounded-full bg-keepla-red animate-ping opacity-20"></div>
                )}
              </div>

              {/* Event Card */}
              <Card className="flex-1 hover:shadow-lg transition-all duration-300 border-l-4 border-l-keepla-red">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(event.status)}
                      <h3 className="font-semibold text-keepla-gray-dark">{event.title}</h3>
                    </div>
                    <Badge className={getEmotionColor(event.emotion)}>
                      {event.emotion}
                    </Badge>
                  </div>
                  
                  <p className="text-keepla-gray-light mb-3">{event.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-keepla-red" />
                        <span>Para: {event.recipient}</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-keepla-gray-dark">
                        {formatTimeUntil(event.daysUntil)}
                      </div>
                      <div className="text-xs text-keepla-gray-light">
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
            <h3 className="font-semibold text-keepla-gray-dark mb-2">{event.title}</h3>
            <p className="text-sm text-keepla-gray-light mb-3">{event.description}</p>
            <div className="text-xs text-keepla-gray-light">
              <div>Para: {event.recipient}</div>
              <div className="font-semibold text-keepla-red mt-1">
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
          <h2 className="text-3xl font-serif text-keepla-gray-dark mb-2">
            Sua Jornada no Tempo
          </h2>
          <p className="text-keepla-gray-light">
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
            <div className="text-2xl font-bold text-keepla-red">
              {displayEvents.filter(e => e.status === 'scheduled').length}
            </div>
            <div className="text-sm text-keepla-gray-light">Agendadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-keepla-gray-dark">
              {displayEvents.filter(e => e.daysUntil <= 30).length}
            </div>
            <div className="text-sm text-keepla-gray-light">Este Mês</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-keepla-red">
              {displayEvents.filter(e => e.status === 'delivered').length}
            </div>
            <div className="text-sm text-keepla-gray-light">Entregues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">
              {nextDeliveryInDays}
            </div>
            <div className="text-sm text-keepla-gray-light">Dias até próxima</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {currentView === 'timeline' ? <TimelineView /> : <CalendarView />}
      </div>

      {/* Empty State */}
      {displayEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-keepla-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-12 h-12 text-keepla-red" />
          </div>
          <h3 className="text-xl font-semibold text-keepla-gray-dark mb-2">
            Sua jornada começa aqui
          </h3>
          <p className="text-keepla-gray-light mb-6">
            Crie sua primeira cápsula do tempo e comece a construir memórias para o futuro
          </p>
          <Button className="bg-keepla-red hover:bg-keepla-red/90">
            Criar Primeira Cápsula
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimelineVisualization;

