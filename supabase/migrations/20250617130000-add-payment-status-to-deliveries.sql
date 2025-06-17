-- Migration: adiciona campo de estado de pagamento à tabela de entregas
ALTER TABLE deliveries
ADD COLUMN payment_status text DEFAULT 'pending';

-- Sugestão de valores: 'pending', 'paid', 'failed', 'cancelled'
