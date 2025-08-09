-- Add message_type to keepsakes table
ALTER TABLE public.keepsakes
ADD COLUMN message_type text DEFAULT 'keepsake' NOT NULL;

-- Add necessary columns to keepsakes table if they don't exist
ALTER TABLE public.keepsakes
ADD COLUMN IF NOT EXISTS message_content text;
ALTER TABLE public.keepsakes
ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.keepsakes
ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.keepsakes
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.keepsakes
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Migrate data from messages to keepsakes
INSERT INTO public.keepsakes (id, user_id, title, message_content, created_at, updated_at, message_type)
SELECT id, user_id, 'Message from old table' as title, content, created_at, updated_at, 'message' as message_type
FROM public.messages;

-- Drop messages table
DROP TABLE public.messages;

-- Update foreign key references if any (assuming notifications.content was the message content)
-- If there are other tables referencing messages, they need to be updated here.
-- For now, assuming notifications.content was the message content and it's already handled.