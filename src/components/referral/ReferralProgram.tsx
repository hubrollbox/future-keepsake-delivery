import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Users, 
  Copy, 
  Mail, 
  Share2, 
  Star,
  CheckCircle,
  Clock,
  Trophy
} from 'lucide-react';
import { useReferralProgram } from '@/hooks/useReferralProgram';
import { emailSchema } from '@/lib/validation';

const ReferralProgram = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const { stats, referrals, loading, sendReferralInvite, copyReferralLink } = useReferralProgram();

  const handleSendInvite = async () => {
    try {
      emailSchema.parse(inviteEmail);
      setIsInviting(true);
      const success = await sendReferralInvite(inviteEmail);
      if (success) {
        setInviteEmail('');
      }
    } catch (error) {
      console.error('Email inválido:', error);
    } finally {
      setIsInviting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner Principal */}
      <Card className="bg-keepla-gray-dark text-white overflow-hidden">
        <CardContent className="p-8 relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Programa de Referência</h2>
              <p className="text-lg opacity-90">
                Convide amigos e ganhe +3 cápsulas grátis para cada registro!
              </p>
            </div>
            <div className="text-6xl opacity-20">
              <Gift />
            </div>
          </div>
          
          {/* Partículas decorativas */}
          <div className="absolute top-4 right-20 opacity-30">
            <Star className="w-6 h-6 animate-pulse" />
          </div>
          <div className="absolute bottom-4 right-32 opacity-30">
            <Star className="w-4 h-4 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-keepla-gray mx-auto mb-2" />
              <div className="text-2xl font-bold text-keepla-gray-800">
              {stats?.total_referrals || 0}
            </div>
              <div className="text-sm text-keepla-gray">Total de Convites</div>
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-keepla-gray mx-auto mb-2" />
              <div className="text-2xl font-bold text-keepla-gray-800">
              {stats?.completed_referrals || 0}
            </div>
              <div className="text-sm text-keepla-gray">Registros Completos</div>
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-keepla-gray mx-auto mb-2" />
              <div className="text-2xl font-bold text-keepla-gray-800">
              {stats?.pending_referrals || 0}
            </div>
              <div className="text-sm text-keepla-gray">Pendentes</div>
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-keepla-gray mx-auto mb-2" />
              <div className="text-2xl font-bold text-keepla-gray-800">
              {stats?.total_bonus_keepsakes || 0}
            </div>
              <div className="text-sm text-keepla-gray">Cápsulas Bônus</div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Convite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Convidar Amigos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Digite o email do seu amigo"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSendInvite}
              disabled={!inviteEmail || isInviting}
              className="bg-keepla-red hover:bg-keepla-red/90"
            >
              {isInviting ? 'Enviando...' : 'Enviar Convite'}
            </Button>
          </div>

          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
                <div className="text-sm text-keepla-gray mb-1">Seu código de referência:</div>
                <div className="font-mono text-lg font-bold text-keepla-gray-800">
                {stats?.referral_code || 'Carregando...'}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyReferralLink}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copiar Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Referências */}
      {referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Seus Convites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-keepla-gray-dark">
                      {referral.referred_email}
                    </div>
                    <div className="text-sm text-keepla-gray-light">
                      Convidado em {new Date(referral.created_at).toLocaleDateString('pt-PT')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={referral.status === 'completed' ? 'default' : 'secondary'}
                      className={referral.status === 'completed' ? 'bg-keepla-gray/10 text-keepla-gray' : ''}
                    >
                      {referral.status === 'completed' ? 'Completo' : 'Pendente'}
                    </Badge>
                    {referral.status === 'completed' && (
                      <div className="text-sm text-keepla-gray font-medium">
                        +{referral.bonus_keepsakes} cápsulas
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Como Funciona */}
      <Card>
        <CardHeader>
          <CardTitle>Como Funciona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
                <div className="w-12 h-12 bg-keepla-gray/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Partilhe</h3>
                <p className="text-sm text-keepla-gray">
                Envie seu link de referência para amigos e familiares
              </p>
            </div>

            <div className="text-center">
                <div className="w-12 h-12 bg-keepla-gray/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-keepla-gray" />
              </div>
              <h3 className="font-semibold mb-2">2. Eles se Registram</h3>
                <p className="text-sm text-keepla-gray">
                Seus amigos criam uma conta usando seu código
              </p>
            </div>

            <div className="text-center">
                <div className="w-12 h-12 bg-keepla-gray/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-keepla-gray" />
              </div>
              <h3 className="font-semibold mb-2">3. Ganhe Recompensas</h3>
                <p className="text-sm text-keepla-gray">
                Receba 3 cápsulas grátis para cada amigo que se registrar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralProgram;