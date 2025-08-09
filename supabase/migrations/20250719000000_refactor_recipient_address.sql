ALTER TABLE public.recipients
DROP COLUMN IF EXISTS address;

ALTER TABLE public.recipients
ADD COLUMN street TEXT,
ADD COLUMN city TEXT,
ADD COLUMN state TEXT,
ADD COLUMN postal_code TEXT,
ADD COLUMN country TEXT DEFAULT 'Brazil';

-- Optional: Add check constraints or foreign keys if needed for validation
-- For example, to ensure postal_code format or valid country codes.
-- ALTER TABLE public.recipients
-- ADD CONSTRAINT recipients_postal_code_format CHECK (postal_code ~ '^\d{5}(-\d{3})?$'); -- Example for Brazilian CEP