-- Fix delivery_date in public.deliveries to ensure it's not in the past
UPDATE public.deliveries
SET delivery_date = NOW() + INTERVAL '1 day'
WHERE delivery_date < CURRENT_TIMESTAMP;