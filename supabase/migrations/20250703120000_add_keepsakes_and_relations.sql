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

CREATE OR REPLACE FUNCTION public.update_profile_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '', pg_temp;
AS $$
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


-- Add NOT NULL constraint to recipient_email and recipient_name in recipients table
ALTER TABLE "public"."recipients" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "public"."recipients" ALTER COLUMN "name" SET NOT NULL;

-- Add foreign key from recipients to deliveries
ALTER TABLE "public"."recipients" ADD COLUMN IF NOT EXISTS "delivery_id" "uuid" REFERENCES "public"."deliveries"("id");

-- Add foreign key from recipients to keepsakes
ALTER TABLE "public"."recipients" ADD COLUMN IF NOT EXISTS "keepsake_id" "uuid" REFERENCES "public"."keepsakes"("id");

-- Update keepsakes table to address inconsistencies/lacunas

-- Change delivery_date to timestamp with time zone for better precision
ALTER TABLE public.keepsakes
ALTER COLUMN delivery_date TYPE timestamp with time zone
USING delivery_date::timestamp with time zone;

-- Add 'type' column to keepsakes table (digital or physical)
ALTER TABLE public.keepsakes
ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'digital';

-- Add CHECK constraint for the 'type' column
ALTER TABLE public.keepsakes
ADD CONSTRAINT chk_keepsake_type CHECK (type IN ('digital', 'physical'));