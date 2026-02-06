-- Create RPC function to get all keepsakes for admin
CREATE OR REPLACE FUNCTION public.admin_get_keepsakes(p_limit integer DEFAULT 100, p_offset integer DEFAULT 0)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  title text,
  message text,
  message_content text,
  message_type text,
  type text,
  status text,
  delivery_date timestamp with time zone,
  created_at timestamp without time zone,
  updated_at timestamp with time zone,
  is_public boolean,
  payment_status text,
  total_cost numeric,
  sent_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow admins to call this function
  IF NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY
  SELECT
    k.id,
    k.user_id,
    k.title,
    k.message,
    k.message_content,
    k.message_type,
    k.type,
    k.status,
    k.delivery_date,
    k.created_at,
    k.updated_at,
    k.is_public,
    k.payment_status,
    k.total_cost,
    k.sent_at
  FROM public.keepsakes k
  ORDER BY k.delivery_date DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;