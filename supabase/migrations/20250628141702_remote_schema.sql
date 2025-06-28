

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."calculate_level"() RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
    -- Function logic here
END;
$$;


ALTER FUNCTION "public"."calculate_level"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_level"("points" integer) RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    SET search_path = '';  -- Set to a specific schema if needed

    RETURN (points / 100) + 1;  -- Function logic
END;
$$;


ALTER FUNCTION "public"."calculate_level"("points" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
    -- Function logic here
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"("uid" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SET LOCAL row_security = off;
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles WHERE user_id = uid AND role = 'admin'
  );
$$;


ALTER FUNCTION "public"."is_admin"("uid" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."achievements" (
    "id" integer NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "icon" "text" NOT NULL,
    "points" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."achievements" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."achievements_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."achievements_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."achievements_id_seq" OWNED BY "public"."achievements"."id";



CREATE TABLE IF NOT EXISTS "public"."admin_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'admin'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."admin_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cart_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "product_id" "text" NOT NULL,
    "product_title" "text" NOT NULL,
    "product_price" numeric(10,2) NOT NULL,
    "quantity" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cart_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."deliveries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "delivery_date" timestamp with time zone NOT NULL,
    "status" "text" DEFAULT 'scheduled'::"text" NOT NULL,
    "type" "text" DEFAULT 'digital'::"text" NOT NULL,
    "recipient_email" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "delivery_method" "text" DEFAULT 'email'::"text",
    "delivery_time" "text",
    "digital_file_url" "text",
    "location" "text",
    "message" "text",
    "recipient_name" "text",
    "payment_status" "text" DEFAULT 'pending'::"text"
);


ALTER TABLE "public"."deliveries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "delivery_date" timestamp with time zone NOT NULL,
    "status" "text" DEFAULT 'scheduled'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "read_at" timestamp with time zone
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "currency" "text" DEFAULT 'EUR'::"text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "payment_method" "text",
    "transaction_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "email" "text",
    "avatar_url" "text",
    "plan_type" "text" DEFAULT 'free'::"text",
    "total_points" integer DEFAULT 0,
    "level" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quests" (
    "id" integer NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "target" integer NOT NULL,
    "reward" integer NOT NULL,
    "time_limit" interval,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."quests" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."quests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."quests_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."quests_id_seq" OWNED BY "public"."quests"."id";



CREATE TABLE IF NOT EXISTS "public"."scheduled_notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_email" "text" NOT NULL,
    "recipient_email" "text" NOT NULL,
    "delivery_date" timestamp with time zone NOT NULL,
    "message" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "sent_at" timestamp with time zone
);


ALTER TABLE "public"."scheduled_notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_achievements" (
    "id" integer NOT NULL,
    "user_id" "uuid",
    "achievement_id" integer,
    "unlocked_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_achievements" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_achievements_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_achievements_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_achievements_id_seq" OWNED BY "public"."user_achievements"."id";



CREATE TABLE IF NOT EXISTS "public"."user_quests" (
    "id" integer NOT NULL,
    "user_id" "uuid",
    "quest_id" integer,
    "progress" integer DEFAULT 0,
    "completed_at" timestamp without time zone
);


ALTER TABLE "public"."user_quests" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_quests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_quests_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_quests_id_seq" OWNED BY "public"."user_quests"."id";



CREATE TABLE IF NOT EXISTS "public"."user_stats" (
    "user_id" "uuid" NOT NULL,
    "total_points" integer DEFAULT 0,
    "level" integer DEFAULT 1,
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_stats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."warehouse_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "client_name" "text" NOT NULL,
    "product_description" "text" NOT NULL,
    "received_date" "date" NOT NULL,
    "photo_url" "text",
    "status" "text" DEFAULT 'stored'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."warehouse_items" OWNER TO "postgres";


ALTER TABLE ONLY "public"."achievements" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."achievements_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."quests" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."quests_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_achievements" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_achievements_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_quests" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_quests_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_roles"
    ADD CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_roles"
    ADD CONSTRAINT "admin_roles_user_id_role_key" UNIQUE ("user_id", "role");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."deliveries"
    ADD CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quests"
    ADD CONSTRAINT "quests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scheduled_notifications"
    ADD CONSTRAINT "scheduled_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_user_id_achievement_id_key" UNIQUE ("user_id", "achievement_id");



ALTER TABLE ONLY "public"."user_quests"
    ADD CONSTRAINT "user_quests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_quests"
    ADD CONSTRAINT "user_quests_user_id_quest_id_key" UNIQUE ("user_id", "quest_id");



ALTER TABLE ONLY "public"."user_stats"
    ADD CONSTRAINT "user_stats_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."warehouse_items"
    ADD CONSTRAINT "warehouse_items_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_cart_items_user_id" ON "public"."cart_items" USING "btree" ("user_id");



CREATE INDEX "messages_user_id_idx" ON "public"."messages" USING "btree" ("user_id");



ALTER TABLE ONLY "public"."admin_roles"
    ADD CONSTRAINT "admin_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."deliveries"
    ADD CONSTRAINT "deliveries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_quests"
    ADD CONSTRAINT "user_quests_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_quests"
    ADD CONSTRAINT "user_quests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_stats"
    ADD CONSTRAINT "user_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can delete admin roles" ON "public"."admin_roles" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."admin_roles" "ar"
  WHERE (("ar"."user_id" = "auth"."uid"()) AND ("ar"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can do everything on cart_items" ON "public"."cart_items" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can do everything on deliveries" ON "public"."deliveries" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can do everything on messages" ON "public"."messages" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can do everything on payments" ON "public"."payments" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can do everything on profiles" ON "public"."profiles" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can insert admin roles" ON "public"."admin_roles" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_roles" "ar"
  WHERE (("ar"."user_id" = "auth"."uid"()) AND ("ar"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can insert warehouse items" ON "public"."warehouse_items" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can update warehouse items" ON "public"."warehouse_items" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can view all deliveries" ON "public"."deliveries" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE ("admin_roles"."user_id" = "auth"."uid"()))) OR ("user_id" = "auth"."uid"())));



CREATE POLICY "Admins can view all warehouse items" ON "public"."warehouse_items" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text")))));



CREATE POLICY "Allow read access to all" ON "public"."scheduled_notifications" FOR SELECT USING (true);



CREATE POLICY "CartItems: Admin full access" ON "public"."cart_items" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "CartItems: Only self" ON "public"."cart_items" USING ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())));



CREATE POLICY "Deliveries: Admin full access" ON "public"."deliveries" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Deliveries: Only self" ON "public"."deliveries" USING ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())));



CREATE POLICY "Messages: Admin full access" ON "public"."messages" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Messages: Only self" ON "public"."messages" USING ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())));



CREATE POLICY "Notifications: Admin full access" ON "public"."notifications" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Notifications: Only self" ON "public"."notifications" USING ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())));



CREATE POLICY "Payments: Admin full access" ON "public"."payments" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Payments: Only self" ON "public"."payments" USING ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())));



CREATE POLICY "Permitir user apagar suas entregas" ON "public"."deliveries" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Permitir user atualizar suas entregas" ON "public"."deliveries" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Permitir user criar suas entregas" ON "public"."deliveries" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Permitir user ver suas entregas" ON "public"."deliveries" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Public read access to achievements" ON "public"."achievements" FOR SELECT USING (true);



CREATE POLICY "Public read access to quests" ON "public"."quests" FOR SELECT USING (true);



CREATE POLICY "ScheduledNotifications: Admin full access" ON "public"."scheduled_notifications" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "ScheduledNotifications: Only self" ON "public"."scheduled_notifications" USING ((("auth"."uid"() IS NOT NULL) AND ("user_email" = "auth"."email"())));



CREATE POLICY "User can access own achievements" ON "public"."user_achievements" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "User can access own deliveries" ON "public"."deliveries" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "User can access own quests" ON "public"."user_quests" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "User can access own stats" ON "public"."user_stats" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "UserAchievements: Admin full access" ON "public"."user_achievements" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "UserAchievements: Only self" ON "public"."user_achievements" USING ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())));



CREATE POLICY "UserQuests: Admin full access" ON "public"."user_quests" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "UserQuests: Only self" ON "public"."user_quests" USING ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())));



CREATE POLICY "UserStats: Admin full access" ON "public"."user_stats" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "UserStats: Only self" ON "public"."user_stats" USING ((("auth"."uid"() IS NOT NULL) AND ("user_id" = "auth"."uid"())));



CREATE POLICY "Users and admins can delete profiles" ON "public"."profiles" FOR DELETE TO "authenticated" USING ((("auth"."uid"() = "id") OR (EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text"))))));



CREATE POLICY "Users and admins can update profiles" ON "public"."profiles" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "id") OR (EXISTS ( SELECT 1
   FROM "public"."admin_roles"
  WHERE (("admin_roles"."user_id" = "auth"."uid"()) AND ("admin_roles"."role" = 'admin'::"text"))))));



CREATE POLICY "Users can delete their notifications" ON "public"."notifications" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can delete their own cart items" ON "public"."cart_items" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own deliveries" ON "public"."deliveries" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own messages" ON "public"."messages" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert notifications" ON "public"."notifications" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can insert their own cart items" ON "public"."cart_items" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own deliveries" ON "public"."deliveries" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own messages" ON "public"."messages" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own payments" ON "public"."payments" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can manage their own cart_items" ON "public"."cart_items" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own messages" ON "public"."messages" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own payments" ON "public"."payments" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own profile" ON "public"."profiles" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their notifications" ON "public"."notifications" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own cart items" ON "public"."cart_items" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own deliveries" ON "public"."deliveries" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own messages" ON "public"."messages" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their notifications" ON "public"."notifications" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own admin role" ON "public"."admin_roles" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own cart items" ON "public"."cart_items" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own deliveries" ON "public"."deliveries" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own messages" ON "public"."messages" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own payments" ON "public"."payments" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."admin_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cart_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."deliveries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."scheduled_notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_quests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_stats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."warehouse_items" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





























































































































































































GRANT ALL ON FUNCTION "public"."calculate_level"() TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_level"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_level"() TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_level"("points" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_level"("points" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_level"("points" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"("uid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"("uid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"("uid" "uuid") TO "service_role";
























GRANT ALL ON TABLE "public"."achievements" TO "anon";
GRANT ALL ON TABLE "public"."achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."achievements" TO "service_role";



GRANT ALL ON SEQUENCE "public"."achievements_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."achievements_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."achievements_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."admin_roles" TO "anon";
GRANT ALL ON TABLE "public"."admin_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_roles" TO "service_role";



GRANT ALL ON TABLE "public"."cart_items" TO "anon";
GRANT ALL ON TABLE "public"."cart_items" TO "authenticated";
GRANT ALL ON TABLE "public"."cart_items" TO "service_role";



GRANT ALL ON TABLE "public"."deliveries" TO "anon";
GRANT ALL ON TABLE "public"."deliveries" TO "authenticated";
GRANT ALL ON TABLE "public"."deliveries" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."quests" TO "anon";
GRANT ALL ON TABLE "public"."quests" TO "authenticated";
GRANT ALL ON TABLE "public"."quests" TO "service_role";



GRANT ALL ON SEQUENCE "public"."quests_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."quests_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."quests_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."scheduled_notifications" TO "anon";
GRANT ALL ON TABLE "public"."scheduled_notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."scheduled_notifications" TO "service_role";



GRANT ALL ON TABLE "public"."user_achievements" TO "anon";
GRANT ALL ON TABLE "public"."user_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."user_achievements" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_achievements_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_achievements_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_achievements_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_quests" TO "anon";
GRANT ALL ON TABLE "public"."user_quests" TO "authenticated";
GRANT ALL ON TABLE "public"."user_quests" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_quests_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_quests_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_quests_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_stats" TO "anon";
GRANT ALL ON TABLE "public"."user_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."user_stats" TO "service_role";



GRANT ALL ON TABLE "public"."warehouse_items" TO "anon";
GRANT ALL ON TABLE "public"."warehouse_items" TO "authenticated";
GRANT ALL ON TABLE "public"."warehouse_items" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
