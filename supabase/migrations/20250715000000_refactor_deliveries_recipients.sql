-- Remove redundant columns from deliveries table
ALTER TABLE public.deliveries
DROP COLUMN IF EXISTS message,
DROP COLUMN IF EXISTS delivery_method,
DROP COLUMN IF EXISTS delivery_time;

-- Remove redundant delivery_id from recipients table
ALTER TABLE public.recipients
DROP COLUMN IF EXISTS delivery_id;

-- Correct cart_items.product_id to UUID type
-- This assumes cart_items.product_id currently exists and is not UUID.
-- If it's already UUID, this step will be a no-op or require adjustment.
-- Need to check current type first if this migration fails.
ALTER TABLE public.cart_items
ALTER COLUMN product_id TYPE UUID USING product_id::UUID;

-- Add CHECK constraint to deliveries.delivery_date
ALTER TABLE public.deliveries
DROP CONSTRAINT IF EXISTS deliveries_delivery_date_check;

-- Update existing rows to satisfy the new constraint before re-adding it
UPDATE public.deliveries
SET delivery_date = CURRENT_TIMESTAMP
WHERE delivery_date < CURRENT_TIMESTAMP;

ALTER TABLE public.deliveries
ADD CONSTRAINT deliveries_delivery_date_check CHECK (delivery_date >= CURRENT_TIMESTAMP);

-- Add validations for recipients.phone (format) and address (postal format)
-- This requires a function or trigger for more complex regex validation.
-- For now, adding a basic check for non-empty.
ALTER TABLE public.recipients
ADD CONSTRAINT recipients_phone_format CHECK (phone IS NULL OR phone ~ '^\+?[0-9]{7,15}$'); -- Basic international phone format
ALTER TABLE public.recipients
ADD CONSTRAINT recipients_address_format CHECK (address IS NULL OR LENGTH(TRIM(address)) > 0); -- Basic non-empty check

-- Add stock to products table (already exists based on previous search, but ensuring it's here)
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0 NOT NULL CHECK (stock >= 0);

-- Restore content in notifications for flexible messages
ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS content TEXT;

-- Automatizar triggers para user_stats com base em user_achievements e user_quests
CREATE OR REPLACE FUNCTION public.update_user_stats_from_achievement()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id, total_achievements, last_updated)
  VALUES (NEW.user_id, 1, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_achievements = user_stats.total_achievements + 1,
    last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_user_stats_on_achievement
AFTER INSERT ON public.user_achievements
FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_from_achievement();

CREATE OR REPLACE FUNCTION public.update_user_stats_from_quest()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id, total_quests_completed, last_updated)
  VALUES (NEW.user_id, 1, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_quests_completed = user_stats.total_quests_completed + 1,
    last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_user_stats_on_quest
AFTER INSERT ON public.user_quests
FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_from_quest();