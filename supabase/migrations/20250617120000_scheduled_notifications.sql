-- Tabela para notificações agendadas
CREATE TABLE scheduled_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  recipient_email text NOT NULL,
  delivery_date timestamptz NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'sent', 'error'
  sent_at timestamptz
);

-- Índice para acelerar buscas por notificações pendentes
CREATE INDEX idx_scheduled_notifications_pending
  ON scheduled_notifications (status, delivery_date);
