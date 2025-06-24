
ALTER TABLE public.deliveries
  ADD COLUMN delivery_method TEXT DEFAULT 'email';
