-- Fix keepsakes table schema inconsistency
-- Remove duplicate 'message' field and keep only 'message_content'

-- First, migrate any data from 'message' to 'message_content' if needed
UPDATE public.keepsakes 
SET message_content = COALESCE(message_content, message)
WHERE message_content IS NULL AND message IS NOT NULL;

-- Drop the duplicate 'message' column
ALTER TABLE public.keepsakes DROP COLUMN IF EXISTS message;

-- Ensure message_content is NOT NULL since it's the primary content field
ALTER TABLE public.keepsakes ALTER COLUMN message_content SET NOT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.keepsakes.message_content IS 'Primary content field for keepsake messages';

-- Update any views or functions that might reference the old 'message' column
-- (Add specific updates here if any views/functions are found to use 'message')