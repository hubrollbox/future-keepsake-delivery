import React from 'react';
import { useAIQuota } from '../hooks/useAIQuota';
import { Sparkles, Zap, Crown, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface AIQuotaStatusProps {
  showUpgradeButton?: boolean;
  onUpgrade?: () => void;
  compact?: boolean;
}

export function AIQuotaStatus({ 
  showUpgradeButton = true, 
  onUpgrade,
  compact = false 
}: AIQuotaStatusProps) {
  const { quota, loading, getQuotaStatus, getUpgradeMessage } = useAIQuota();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (!quota) {
    return null;
  }

  const status = getQuotaStatus();
  const upgradeMessage = getUpgradeMessage();
  const percentage = (quota.used / quota.limit) * 100;

  const getTierIcon = () => {
    switch (quota.tier) {
      case 'free':
        return <Sparkles className="h-4 w-4" />;
      case 'premium':
        return <Zap className="h-4 w-4" />;
      case 'family':
        return <Crown className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getTierColor = () => {
    switch (quota.tier) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'family':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1">
          {getTierIcon()}
          <Badge variant="secondary" className={getTierColor()}>
            {quota.tier.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <span className={status?.color}>
            {quota.used}/{quota.limit}
          </span>
          {status?.status === 'exceeded' && (
            <AlertTriangle className="h-3 w-3 text-red-500" />
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTierIcon()}
            <CardTitle className="text-lg">Sugestões de IA</CardTitle>
            <Badge variant="secondary" className={getTierColor()}>
              {quota.tier.toUpperCase()}
            </Badge>
          </div>
          {status?.status === 'exceeded' && (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
        </div>
        <CardDescription>
          {quota.used} de {quota.limit} sugestões usadas hoje
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Barra de Progresso */}
        <div className="space-y-2">
          <Progress 
            value={percentage} 
            className={`h-2 ${
              percentage >= 100 ? '[&>div]:bg-red-500' :
              percentage >= 80 ? '[&>div]:bg-orange-500' :
              '[&>div]:bg-green-500'
            }`}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{status?.message}</span>
            <span>{quota.remaining} restantes</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          status?.bgColor
        } ${status?.color}`}>
          {status?.message}
        </div>

        {/* Mensagem de Upgrade */}
        {showUpgradeButton && upgradeMessage && quota.remaining <= 1 && (
          <div className="border-t pt-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{upgradeMessage.title}</h4>
              <p className="text-xs text-gray-600">{upgradeMessage.description}</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {upgradeMessage.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
              <Button 
                size="sm" 
                onClick={onUpgrade}
                className="w-full mt-2"
                variant="default"
              >
                Fazer Upgrade
              </Button>
            </div>
          </div>
        )}

        {/* Reset Timer */}
        <div className="text-xs text-gray-500 border-t pt-2">
          <div className="flex items-center justify-between">
            <span>Quota reseta em:</span>
            <ResetTimer resetDate={quota.resetDate} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResetTimer({ resetDate }: { resetDate: string }) {
  const [timeLeft, setTimeLeft] = React.useState('');

  React.useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const reset = new Date(resetDate).getTime();
      const difference = reset - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft('Resetando...');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, [resetDate]);

  return <span className="font-mono">{timeLeft}</span>;
}