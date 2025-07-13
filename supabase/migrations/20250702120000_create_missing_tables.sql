-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    message_content text, -- Adicionada a coluna message_content
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0 NOT NULL, -- Adicionada coluna de estoque
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT products_stock_check CHECK (stock >= 0) -- Restrição para estoque não negativo
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS public.recipients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create extras table
CREATE TABLE IF NOT EXISTS public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create keepsake_extras table (many-to-many)
CREATE TABLE IF NOT EXISTS public.keepsake_extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keepsake_id uuid REFERENCES public.keepsakes(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create subscriptions table (optional)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    plan text NOT NULL,
    status text DEFAULT 'active',
    started_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone
);

-- Create products table (optional)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Confirm notifications table exists
-- Confirm payments table exists
-- Create keepsakes table
CREATE TABLE IF NOT EXISTS public.keepsakes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create