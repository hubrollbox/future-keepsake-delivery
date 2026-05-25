ALTER TABLE public.keepsakes
  ADD COLUMN IF NOT EXISTS creator_confirmation_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS reminder_1day_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS creator_delivery_notice_sent_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_keepsakes_reminder_lookup 
  ON public.keepsakes (delivery_date, status) 
  WHERE status IN ('scheduled','pending');