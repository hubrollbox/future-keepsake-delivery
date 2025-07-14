ALTER TABLE public.deliveries
DROP COLUMN IF EXISTS recipient_email,
DROP COLUMN IF EXISTS recipient_name;

-- Add a recipient_id column to deliveries table
ALTER TABLE public.deliveries
ADD COLUMN recipient_id UUID REFERENCES public.recipients(id) ON DELETE SET NULL;