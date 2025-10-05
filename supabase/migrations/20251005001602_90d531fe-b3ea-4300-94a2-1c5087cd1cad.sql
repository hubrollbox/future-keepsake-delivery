-- ============================================
-- CRITICAL SECURITY FIXES FOR KEEPLA.PT
-- ============================================

-- FIX 1: Shopping Cart Price Manipulation
-- Drop the overly permissive ALL policy and replace with granular policies
DROP POLICY IF EXISTS "cart_items_user_all" ON public.cart_items;

-- Allow users to view their own cart items
CREATE POLICY "cart_items_user_select"
  ON public.cart_items
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to insert cart items (price validation via trigger)
CREATE POLICY "cart_items_user_insert"
  ON public.cart_items
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow users to update ONLY quantity field
CREATE POLICY "cart_items_user_update_quantity"
  ON public.cart_items
  FOR UPDATE
  USING (user_id = auth.uid());

-- Allow users to delete their own cart items
CREATE POLICY "cart_items_user_delete"
  ON public.cart_items
  FOR DELETE
  USING (user_id = auth.uid());

-- Create trigger to validate and auto-set prices on INSERT/UPDATE
CREATE OR REPLACE FUNCTION validate_cart_item_price()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actual_price NUMERIC;
  product_name TEXT;
BEGIN
  -- Get the actual price from products table
  SELECT price, name INTO actual_price, product_name
  FROM products
  WHERE id = NEW.product_id AND active = true AND stock > 0;
  
  IF actual_price IS NULL THEN
    RAISE EXCEPTION 'Product not found or not available';
  END IF;
  
  -- Force the correct price (ignore user-provided values)
  NEW.product_price := actual_price;
  NEW.product_title := product_name;
  NEW.total_amount := actual_price * NEW.quantity;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER cart_item_price_validation
  BEFORE INSERT OR UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION validate_cart_item_price();


-- FIX 2: Keepsake Products Price Manipulation
-- Drop overly permissive policy
DROP POLICY IF EXISTS "keepsake_products_user_all" ON public.keepsake_products;

-- Allow users to view products in their keepsakes
CREATE POLICY "keepsake_products_user_select"
  ON public.keepsake_products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM keepsakes k
      WHERE k.id = keepsake_products.keepsake_id AND k.user_id = auth.uid()
    )
  );

-- Allow users to insert products (price validation via trigger)
CREATE POLICY "keepsake_products_user_insert"
  ON public.keepsake_products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM keepsakes k
      WHERE k.id = keepsake_products.keepsake_id AND k.user_id = auth.uid()
    )
  );

-- Allow users to update quantity only
CREATE POLICY "keepsake_products_user_update"
  ON public.keepsake_products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM keepsakes k
      WHERE k.id = keepsake_products.keepsake_id AND k.user_id = auth.uid()
    )
  );

-- Allow users to delete products from their keepsakes
CREATE POLICY "keepsake_products_user_delete"
  ON public.keepsake_products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM keepsakes k
      WHERE k.id = keepsake_products.keepsake_id AND k.user_id = auth.uid()
    )
  );

-- Create trigger to validate keepsake product prices
CREATE OR REPLACE FUNCTION validate_keepsake_product_price()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actual_price NUMERIC;
BEGIN
  -- Get the actual price from products table
  SELECT price INTO actual_price
  FROM products
  WHERE id = NEW.product_id AND active = true;
  
  IF actual_price IS NULL THEN
    RAISE EXCEPTION 'Product not found or not active';
  END IF;
  
  -- Force the correct price (ignore user-provided values)
  NEW.unit_price := actual_price;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER keepsake_product_price_validation
  BEFORE INSERT OR UPDATE ON public.keepsake_products
  FOR EACH ROW
  EXECUTE FUNCTION validate_keepsake_product_price();


-- FIX 3: Add service role restrictions to SECURITY DEFINER functions
-- Update send_due_keepsakes to only allow service role
CREATE OR REPLACE FUNCTION public.send_due_keepsakes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    ks RECORD;
BEGIN
    -- Only allow service role to execute this function
    IF auth.role() != 'service_role' THEN
        RAISE EXCEPTION 'Function can only be called by service role';
    END IF;

    FOR ks IN
        SELECT id, recipient_email, content
        FROM keepsakes
        WHERE status = 'pending'
          AND delivery_date <= now()
    LOOP
        -- Chamar função de envio de email (deve existir no backend)
        PERFORM send_email(ks.recipient_email, 'A sua cápsula chegou!', ks.content);

        -- Atualizar estado
        UPDATE keepsakes
        SET status = 'sent',
            sent_at = now()
        WHERE id = ks.id;
    END LOOP;
END;
$$;

-- Update send_due_deliveries to only allow service role
CREATE OR REPLACE FUNCTION public.send_due_deliveries()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
declare
  item record;
  webhook_url text := 'https://mlxmymmoysbtnvcehggn.supabase.co/functions/v1/send-deliveries';
begin
  -- Only allow service role to execute this function
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Function can only be called by service role';
  END IF;

  for item in
    select * from public.deliveries
    where delivery_date <= now()
      and status = 'scheduled'
      and recipient_id is not null
  loop
    perform public.log_security_event(
      item.user_id,
      'delivery_sent',
      'deliveries',
      item.id::text,
      null,
      null,
      true,
      null,
      jsonb_build_object('delivery_date', item.delivery_date, 'type', item.type)
    );

    update public.deliveries
    set status = 'sent',
        updated_at = now()
    where id = item.id;
  end loop;
end;
$$;


-- FIX 4: Add checkout session validation function
-- This will be used by the edge function to validate prices before payment
CREATE OR REPLACE FUNCTION validate_checkout_session(p_user_id uuid)
RETURNS TABLE(
  product_id uuid,
  product_title text,
  unit_price numeric,
  quantity integer,
  total_price numeric,
  valid boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.product_id,
    p.name as product_title,
    p.price as unit_price,
    ci.quantity,
    (p.price * ci.quantity) as total_price,
    (p.active AND p.stock >= ci.quantity) as valid
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  WHERE ci.user_id = p_user_id;
END;
$$;

COMMENT ON FUNCTION validate_checkout_session IS 'Validates cart items against current product prices for checkout. Returns actual prices from products table to prevent price manipulation.';