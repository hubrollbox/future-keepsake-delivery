import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, CheckCircle2, XCircle, AlertTriangle, SkipForward } from 'lucide-react';
import { runHealthCheck, HealthCheckReport, HealthCheckResult } from '@/lib/healthCheck';

const statusIcons = {
  ok: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  skipped: SkipForward
};

const statusColors = {
  ok: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  skipped: 'text-muted-foreground'
};

const badgeVariants = {
  ok: 'default' as const,
  error: 'destructive' as const,
  warning: 'secondary' as const,
  skipped: 'outline' as const
};

function HealthCheckItem({ result }: { result: HealthCheckResult }) {
  const Icon = statusIcons[result.status];
  
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${statusColors[result.status]}`} />
        <div>
          <p className="font-medium">{result.service}</p>
          <p className="text-sm text-muted-foreground">{result.message}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {result.latency !== undefined && (
          <span className="text-xs text-muted-foreground">{result.latency}ms</span>
        )}
        <Badge variant={badgeVariants[result.status]}>
          {result.status.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
}

export function HealthCheckPanel() {
  const [report, setReport] = useState<HealthCheckReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const runCheck = async () => {
    setIsLoading(true);
    try {
      const result = await runHealthCheck();
      setReport(result);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(runCheck, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const overallBadge = report?.overall === 'healthy' 
    ? { variant: 'default' as const, className: 'bg-green-500' }
    : report?.overall === 'degraded'
    ? { variant: 'secondary' as const, className: 'bg-yellow-500' }
    : { variant: 'destructive' as const, className: '' };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Health Check
              {report && (
                <Badge {...overallBadge}>
                  {report.overall.toUpperCase()}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Estado dos serviços e integrações
              {report && (
                <span className="ml-2 text-xs">
                  Última verificação: {new Date(report.timestamp).toLocaleTimeString('pt-PT')}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'bg-primary/10' : ''}
            >
              Auto
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={runCheck}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && !report ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : report ? (
          <>
            <div className="space-y-1">
              {report.results.map((result, index) => (
                <HealthCheckItem key={index} result={result} />
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-500">{report.summary.ok}</p>
                <p className="text-xs text-muted-foreground">OK</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">{report.summary.errors}</p>
                <p className="text-xs text-muted-foreground">Erros</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-500">{report.summary.warnings}</p>
                <p className="text-xs text-muted-foreground">Avisos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-muted-foreground">{report.summary.skipped}</p>
                <p className="text-xs text-muted-foreground">Ignorados</p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Clique em refresh para executar o health check
          </p>
        )}
      </CardContent>
    </Card>
  );
}
