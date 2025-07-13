CREATE TABLE IF NOT EXISTS "public"."keepsakes" (    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL REFERENCES "public"."profiles"("id"),
    "delivery_id" "uuid" REFERENCES "public"."deliveries"("id"),
    "title" "text" NOT NULL,
    "message_content" "text" NOT NULL,
    "delivery_date" date NOT NULL,
    "status" "text" DEFAULT 'scheduled'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."keepsakes" OWNER TO "postgres";

ALTER TABLE "public"."deliveries" DROP COLUMN IF EXISTS "message";

ALTER TABLE "public"."notifications" DROP COLUMN IF EXISTS "message";

ALTER TABLE "public"."scheduled_notifications" DROP COLUMN IF EXISTS "message";

ALTER TABLE "public"."scheduled_notifications" ADD COLUMN "keepsake_id" "uuid" REFERENCES "public"."keepsakes"("id");

ALTER TABLE "public"."notifications" ADD COLUMN "keepsake_id" "uuid" REFERENCES "public"."keepsakes"("id");

ALTER TABLE "public"."deliveries" ADD COLUMN "keepsake_id" "uuid" REFERENCES "public"."keepsakes"("id");

CREATE OR REPLACE FUNCTION update_profile_stats() RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET total_points = NEW.total_points,
        level = NEW.level,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Optional: Add a trigger to ensure stock is not negative on product updates
CREATE OR REPLACE FUNCTION check_product_stock() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock < 0 THEN
        RAISE EXCEPTION 'Product stock cannot be negative.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_product_stock_update
BEFORE UPDATE OF stock ON public.products
FOR EACH ROW EXECUTE FUNCTION check_product_stock();

-- Add NOT NULL constraint to recipient_email and recipient_name in recipients table
ALTER TABLE "public"."recipients" ALTER COLUMN "recipient_email" SET NOT NULL;
ALTER TABLE "public"."recipients" ALTER COLUMN "recipient_name" SET NOT NULL;

-- Add foreign key from recipients to deliveries
ALTER TABLE "public"."recipients" ADD COLUMN "delivery_id" "uuid" REFERENCES "public"."deliveries"("id");

-- Add foreign key from recipients to keepsakes
ALTER TABLE "public"."recipients" ADD COLUMN "keepsake_id" "uuid" REFERENCES "public"."keepsakes"("id");