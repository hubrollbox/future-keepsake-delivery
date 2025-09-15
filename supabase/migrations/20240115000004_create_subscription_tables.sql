-- Criar tabela de assinaturas de usuários
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'premium', 'family')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Garantir que cada usuário tenha apenas uma assinatura
  UNIQUE(user_id)
);

-- Criar tabela de histórico de pagamentos
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'brl',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed', 'pending')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar colunas de assinatura à tabela profiles se não existirem
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'premium', 'family')),
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'unpaid', 'incomplete'));

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription_id ON user_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_type ON user_subscriptions(plan_type);

CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_stripe_invoice_id ON payment_history(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at);

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_plan ON profiles(subscription_plan);

-- Habilitar RLS (Row Level Security)
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_subscriptions
CREATE POLICY "Users can view their own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para payment_history
CREATE POLICY "Users can view their own payment history" ON payment_history
  FOR SELECT USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at em user_subscriptions
CREATE OR REPLACE FUNCTION update_user_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_subscriptions_updated_at_trigger
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_subscriptions_updated_at();

-- Função para obter limites do plano
CREATE OR REPLACE FUNCTION get_plan_limits(plan_type TEXT)
RETURNS JSON AS $$
BEGIN
  CASE plan_type
    WHEN 'free' THEN
      RETURN json_build_object(
        'ai_quota_daily', 3,
        'keepsakes_monthly', 3,
        'max_message_length', 500,
        'media_attachments', false,
        'delivery_methods', ARRAY['email'],
        'backup_enabled', false
      );
    WHEN 'premium' THEN
      RETURN json_build_object(
        'ai_quota_daily', 50,
        'keepsakes_monthly', -1, -- ilimitado
        'max_message_length', -1, -- ilimitado
        'media_attachments', true,
        'delivery_methods', ARRAY['email', 'sms', 'whatsapp'],
        'backup_enabled', true
      );
    WHEN 'family' THEN
      RETURN json_build_object(
        'ai_quota_daily', 100,
        'keepsakes_monthly', -1, -- ilimitado
        'max_message_length', -1, -- ilimitado
        'media_attachments', true,
        'delivery_methods', ARRAY['email', 'sms', 'whatsapp'],
        'backup_enabled', true,
        'family_accounts', 6,
        'collaborative_keepsakes', true
      );
    ELSE
      RETURN json_build_object(
        'ai_quota_daily', 3,
        'keepsakes_monthly', 3,
        'max_message_length', 500,
        'media_attachments', false,
        'delivery_methods', ARRAY['email'],
        'backup_enabled', false
      );
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar se usuário pode usar funcionalidade
CREATE OR REPLACE FUNCTION can_user_access_feature(user_id UUID, feature_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  plan_limits JSON;
BEGIN
  -- Buscar plano do usuário
  SELECT COALESCE(subscription_plan, 'free') INTO user_plan
  FROM profiles
  WHERE id = user_id;
  
  -- Se não encontrou o usuário, retorna false
  IF user_plan IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Obter limites do plano
  plan_limits := get_plan_limits(user_plan);
  
  -- Verificar funcionalidade específica
  CASE feature_name
    WHEN 'media_attachments' THEN
      RETURN (plan_limits->>'media_attachments')::BOOLEAN;
    WHEN 'backup_enabled' THEN
      RETURN (plan_limits->>'backup_enabled')::BOOLEAN;
    WHEN 'collaborative_keepsakes' THEN
      RETURN (plan_limits->>'collaborative_keepsakes')::BOOLEAN;
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Comentários de documentação
COMMENT ON TABLE user_subscriptions IS 'Armazena informações das assinaturas dos usuários no Stripe';
COMMENT ON TABLE payment_history IS 'Histórico de pagamentos e transações dos usuários';
COMMENT ON FUNCTION get_plan_limits(TEXT) IS 'Retorna os limites e funcionalidades disponíveis para cada tipo de plano';
COMMENT ON FUNCTION can_user_access_feature(UUID, TEXT) IS 'Verifica se um usuário pode acessar uma funcionalidade específica baseado no seu plano';