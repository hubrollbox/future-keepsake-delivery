ALTER TABLE public.scheduled_notifications
DROP COLUMN IF EXISTS recipient_email;

ALTER TABLE public.scheduled_notifications
ADD COLUMN recipient_id UUID REFERENCES public.recipients(id) ON DELETE SET NULL;