create type "public"."fleet_member_status" as enum ('invited', 'active', 'suspended');

create type "public"."subscription_plan" as enum ('free', 'professional', 'advanced', 'fleet');

create type "public"."user_role" as enum ('client', 'provider', 'admin');

drop policy "Admins can delete their own admin roles" on "public"."admin_roles";

drop policy "Admins can insert admin roles" on "public"."admin_roles";

drop policy "Users can view their own admin role" on "public"."admin_roles";

drop policy "Users can delete their own cart items" on "public"."cart_items";

drop policy "Users can insert their own cart items" on "public"."cart_items";

drop policy "Users can update their own cart items" on "public"."cart_items";

drop policy "Users can view their own cart items" on "public"."cart_items";

drop policy "Permitir user apagar suas entregas" on "public"."deliveries";

drop policy "Permitir user atualizar suas entregas" on "public"."deliveries";

drop policy "Permitir user criar suas entregas" on "public"."deliveries";

drop policy "Permitir user ver suas entregas" on "public"."deliveries";

drop policy "User can access own deliveries" on "public"."deliveries";

drop policy "Users can delete their own deliveries" on "public"."deliveries";

drop policy "Users can insert their own deliveries" on "public"."deliveries";

drop policy "Users can update their own deliveries" on "public"."deliveries";

drop policy "Users can view their own deliveries" on "public"."deliveries";

drop policy "Users can delete their own digital files" on "public"."digital_files";

drop policy "Users can insert their own digital files" on "public"."digital_files";

drop policy "Users can update their own digital files" on "public"."digital_files";

drop policy "Users can view their own digital files" on "public"."digital_files";

drop policy "Users can delete their own digital messages" on "public"."digital_messages";

drop policy "Users can insert their own digital messages" on "public"."digital_messages";

drop policy "Users can update their own digital messages" on "public"."digital_messages";

drop policy "Users can view their own digital messages" on "public"."digital_messages";

drop policy "Users can delete their own messages" on "public"."messages";

drop policy "Users can insert their own messages" on "public"."messages";

drop policy "Users can update their own messages" on "public"."messages";

drop policy "Users can view their own messages" on "public"."messages";

drop policy "User can access own payments" on "public"."payments";

drop policy "Users can insert their own payments" on "public"."payments";

drop policy "Users can view their own payments" on "public"."payments";

drop policy "User can access own notifications" on "public"."scheduled_notifications";

drop policy "User can delete own notifications" on "public"."scheduled_notifications";

drop policy "User can update own notifications" on "public"."scheduled_notifications";

drop policy "User can access their achievements" on "public"."user_achievements";

drop policy "User can access their quests" on "public"."user_quests";

drop policy "User can access their stats" on "public"."user_stats";

drop policy "Admins can insert warehouse items" on "public"."warehouse_items";

drop policy "Admins can update warehouse items" on "public"."warehouse_items";

drop policy "Admins can view all warehouse items" on "public"."warehouse_items";

drop policy "Users can insert their own profile" on "public"."profiles";

drop policy "Users can update their own profile" on "public"."profiles";

drop policy "Users can view their own profile" on "public"."profiles";

revoke delete on table "public"."achievements" from "anon";

revoke insert on table "public"."achievements" from "anon";

revoke references on table "public"."achievements" from "anon";

revoke select on table "public"."achievements" from "anon";

revoke trigger on table "public"."achievements" from "anon";

revoke truncate on table "public"."achievements" from "anon";

revoke update on table "public"."achievements" from "anon";

revoke delete on table "public"."achievements" from "authenticated";

revoke insert on table "public"."achievements" from "authenticated";

revoke references on table "public"."achievements" from "authenticated";

revoke select on table "public"."achievements" from "authenticated";

revoke trigger on table "public"."achievements" from "authenticated";

revoke truncate on table "public"."achievements" from "authenticated";

revoke update on table "public"."achievements" from "authenticated";

revoke delete on table "public"."achievements" from "service_role";

revoke insert on table "public"."achievements" from "service_role";

revoke references on table "public"."achievements" from "service_role";

revoke select on table "public"."achievements" from "service_role";

revoke trigger on table "public"."achievements" from "service_role";

revoke truncate on table "public"."achievements" from "service_role";

revoke update on table "public"."achievements" from "service_role";

revoke delete on table "public"."admin_roles" from "anon";

revoke insert on table "public"."admin_roles" from "anon";

revoke references on table "public"."admin_roles" from "anon";

revoke select on table "public"."admin_roles" from "anon";

revoke trigger on table "public"."admin_roles" from "anon";

revoke truncate on table "public"."admin_roles" from "anon";

revoke update on table "public"."admin_roles" from "anon";

revoke delete on table "public"."admin_roles" from "authenticated";

revoke insert on table "public"."admin_roles" from "authenticated";

revoke references on table "public"."admin_roles" from "authenticated";

revoke select on table "public"."admin_roles" from "authenticated";

revoke trigger on table "public"."admin_roles" from "authenticated";

revoke truncate on table "public"."admin_roles" from "authenticated";

revoke update on table "public"."admin_roles" from "authenticated";

revoke delete on table "public"."admin_roles" from "service_role";

revoke insert on table "public"."admin_roles" from "service_role";

revoke references on table "public"."admin_roles" from "service_role";

revoke select on table "public"."admin_roles" from "service_role";

revoke trigger on table "public"."admin_roles" from "service_role";

revoke truncate on table "public"."admin_roles" from "service_role";

revoke update on table "public"."admin_roles" from "service_role";

revoke delete on table "public"."cart_items" from "anon";

revoke insert on table "public"."cart_items" from "anon";

revoke references on table "public"."cart_items" from "anon";

revoke select on table "public"."cart_items" from "anon";

revoke trigger on table "public"."cart_items" from "anon";

revoke truncate on table "public"."cart_items" from "anon";

revoke update on table "public"."cart_items" from "anon";

revoke delete on table "public"."cart_items" from "authenticated";

revoke insert on table "public"."cart_items" from "authenticated";

revoke references on table "public"."cart_items" from "authenticated";

revoke select on table "public"."cart_items" from "authenticated";

revoke trigger on table "public"."cart_items" from "authenticated";

revoke truncate on table "public"."cart_items" from "authenticated";

revoke update on table "public"."cart_items" from "authenticated";

revoke delete on table "public"."cart_items" from "service_role";

revoke insert on table "public"."cart_items" from "service_role";

revoke references on table "public"."cart_items" from "service_role";

revoke select on table "public"."cart_items" from "service_role";

revoke trigger on table "public"."cart_items" from "service_role";

revoke truncate on table "public"."cart_items" from "service_role";

revoke update on table "public"."cart_items" from "service_role";

revoke delete on table "public"."deliveries" from "anon";

revoke insert on table "public"."deliveries" from "anon";

revoke references on table "public"."deliveries" from "anon";

revoke select on table "public"."deliveries" from "anon";

revoke trigger on table "public"."deliveries" from "anon";

revoke truncate on table "public"."deliveries" from "anon";

revoke update on table "public"."deliveries" from "anon";

revoke delete on table "public"."deliveries" from "authenticated";

revoke insert on table "public"."deliveries" from "authenticated";

revoke references on table "public"."deliveries" from "authenticated";

revoke select on table "public"."deliveries" from "authenticated";

revoke trigger on table "public"."deliveries" from "authenticated";

revoke truncate on table "public"."deliveries" from "authenticated";

revoke update on table "public"."deliveries" from "authenticated";

revoke delete on table "public"."deliveries" from "service_role";

revoke insert on table "public"."deliveries" from "service_role";

revoke references on table "public"."deliveries" from "service_role";

revoke select on table "public"."deliveries" from "service_role";

revoke trigger on table "public"."deliveries" from "service_role";

revoke truncate on table "public"."deliveries" from "service_role";

revoke update on table "public"."deliveries" from "service_role";

revoke delete on table "public"."digital_files" from "anon";

revoke insert on table "public"."digital_files" from "anon";

revoke references on table "public"."digital_files" from "anon";

revoke select on table "public"."digital_files" from "anon";

revoke trigger on table "public"."digital_files" from "anon";

revoke truncate on table "public"."digital_files" from "anon";

revoke update on table "public"."digital_files" from "anon";

revoke delete on table "public"."digital_files" from "authenticated";

revoke insert on table "public"."digital_files" from "authenticated";

revoke references on table "public"."digital_files" from "authenticated";

revoke select on table "public"."digital_files" from "authenticated";

revoke trigger on table "public"."digital_files" from "authenticated";

revoke truncate on table "public"."digital_files" from "authenticated";

revoke update on table "public"."digital_files" from "authenticated";

revoke delete on table "public"."digital_files" from "service_role";

revoke insert on table "public"."digital_files" from "service_role";

revoke references on table "public"."digital_files" from "service_role";

revoke select on table "public"."digital_files" from "service_role";

revoke trigger on table "public"."digital_files" from "service_role";

revoke truncate on table "public"."digital_files" from "service_role";

revoke update on table "public"."digital_files" from "service_role";

revoke delete on table "public"."digital_messages" from "anon";

revoke insert on table "public"."digital_messages" from "anon";

revoke references on table "public"."digital_messages" from "anon";

revoke select on table "public"."digital_messages" from "anon";

revoke trigger on table "public"."digital_messages" from "anon";

revoke truncate on table "public"."digital_messages" from "anon";

revoke update on table "public"."digital_messages" from "anon";

revoke delete on table "public"."digital_messages" from "authenticated";

revoke insert on table "public"."digital_messages" from "authenticated";

revoke references on table "public"."digital_messages" from "authenticated";

revoke select on table "public"."digital_messages" from "authenticated";

revoke trigger on table "public"."digital_messages" from "authenticated";

revoke truncate on table "public"."digital_messages" from "authenticated";

revoke update on table "public"."digital_messages" from "authenticated";

revoke delete on table "public"."digital_messages" from "service_role";

revoke insert on table "public"."digital_messages" from "service_role";

revoke references on table "public"."digital_messages" from "service_role";

revoke select on table "public"."digital_messages" from "service_role";

revoke trigger on table "public"."digital_messages" from "service_role";

revoke truncate on table "public"."digital_messages" from "service_role";

revoke update on table "public"."digital_messages" from "service_role";

revoke delete on table "public"."payments" from "anon";

revoke insert on table "public"."payments" from "anon";

revoke references on table "public"."payments" from "anon";

revoke select on table "public"."payments" from "anon";

revoke trigger on table "public"."payments" from "anon";

revoke truncate on table "public"."payments" from "anon";

revoke update on table "public"."payments" from "anon";

revoke delete on table "public"."payments" from "authenticated";

revoke insert on table "public"."payments" from "authenticated";

revoke references on table "public"."payments" from "authenticated";

revoke select on table "public"."payments" from "authenticated";

revoke trigger on table "public"."payments" from "authenticated";

revoke truncate on table "public"."payments" from "authenticated";

revoke update on table "public"."payments" from "authenticated";

revoke delete on table "public"."payments" from "service_role";

revoke insert on table "public"."payments" from "service_role";

revoke references on table "public"."payments" from "service_role";

revoke select on table "public"."payments" from "service_role";

revoke trigger on table "public"."payments" from "service_role";

revoke truncate on table "public"."payments" from "service_role";

revoke update on table "public"."payments" from "service_role";

revoke delete on table "public"."quests" from "anon";

revoke insert on table "public"."quests" from "anon";

revoke references on table "public"."quests" from "anon";

revoke select on table "public"."quests" from "anon";

revoke trigger on table "public"."quests" from "anon";

revoke truncate on table "public"."quests" from "anon";

revoke update on table "public"."quests" from "anon";

revoke delete on table "public"."quests" from "authenticated";

revoke insert on table "public"."quests" from "authenticated";

revoke references on table "public"."quests" from "authenticated";

revoke select on table "public"."quests" from "authenticated";

revoke trigger on table "public"."quests" from "authenticated";

revoke truncate on table "public"."quests" from "authenticated";

revoke update on table "public"."quests" from "authenticated";

revoke delete on table "public"."quests" from "service_role";

revoke insert on table "public"."quests" from "service_role";

revoke references on table "public"."quests" from "service_role";

revoke select on table "public"."quests" from "service_role";

revoke trigger on table "public"."quests" from "service_role";

revoke truncate on table "public"."quests" from "service_role";

revoke update on table "public"."quests" from "service_role";

revoke delete on table "public"."scheduled_notifications" from "anon";

revoke insert on table "public"."scheduled_notifications" from "anon";

revoke references on table "public"."scheduled_notifications" from "anon";

revoke select on table "public"."scheduled_notifications" from "anon";

revoke trigger on table "public"."scheduled_notifications" from "anon";

revoke truncate on table "public"."scheduled_notifications" from "anon";

revoke update on table "public"."scheduled_notifications" from "anon";

revoke delete on table "public"."scheduled_notifications" from "authenticated";

revoke insert on table "public"."scheduled_notifications" from "authenticated";

revoke references on table "public"."scheduled_notifications" from "authenticated";

revoke select on table "public"."scheduled_notifications" from "authenticated";

revoke trigger on table "public"."scheduled_notifications" from "authenticated";

revoke truncate on table "public"."scheduled_notifications" from "authenticated";

revoke update on table "public"."scheduled_notifications" from "authenticated";

revoke delete on table "public"."scheduled_notifications" from "service_role";

revoke insert on table "public"."scheduled_notifications" from "service_role";

revoke references on table "public"."scheduled_notifications" from "service_role";

revoke select on table "public"."scheduled_notifications" from "service_role";

revoke trigger on table "public"."scheduled_notifications" from "service_role";

revoke truncate on table "public"."scheduled_notifications" from "service_role";

revoke update on table "public"."scheduled_notifications" from "service_role";

revoke delete on table "public"."user_achievements" from "anon";

revoke insert on table "public"."user_achievements" from "anon";

revoke references on table "public"."user_achievements" from "anon";

revoke select on table "public"."user_achievements" from "anon";

revoke trigger on table "public"."user_achievements" from "anon";

revoke truncate on table "public"."user_achievements" from "anon";

revoke update on table "public"."user_achievements" from "anon";

revoke delete on table "public"."user_achievements" from "authenticated";

revoke insert on table "public"."user_achievements" from "authenticated";

revoke references on table "public"."user_achievements" from "authenticated";

revoke select on table "public"."user_achievements" from "authenticated";

revoke trigger on table "public"."user_achievements" from "authenticated";

revoke truncate on table "public"."user_achievements" from "authenticated";

revoke update on table "public"."user_achievements" from "authenticated";

revoke delete on table "public"."user_achievements" from "service_role";

revoke insert on table "public"."user_achievements" from "service_role";

revoke references on table "public"."user_achievements" from "service_role";

revoke select on table "public"."user_achievements" from "service_role";

revoke trigger on table "public"."user_achievements" from "service_role";

revoke truncate on table "public"."user_achievements" from "service_role";

revoke update on table "public"."user_achievements" from "service_role";

revoke delete on table "public"."user_quests" from "anon";

revoke insert on table "public"."user_quests" from "anon";

revoke references on table "public"."user_quests" from "anon";

revoke select on table "public"."user_quests" from "anon";

revoke trigger on table "public"."user_quests" from "anon";

revoke truncate on table "public"."user_quests" from "anon";

revoke update on table "public"."user_quests" from "anon";

revoke delete on table "public"."user_quests" from "authenticated";

revoke insert on table "public"."user_quests" from "authenticated";

revoke references on table "public"."user_quests" from "authenticated";

revoke select on table "public"."user_quests" from "authenticated";

revoke trigger on table "public"."user_quests" from "authenticated";

revoke truncate on table "public"."user_quests" from "authenticated";

revoke update on table "public"."user_quests" from "authenticated";

revoke delete on table "public"."user_quests" from "service_role";

revoke insert on table "public"."user_quests" from "service_role";

revoke references on table "public"."user_quests" from "service_role";

revoke select on table "public"."user_quests" from "service_role";

revoke trigger on table "public"."user_quests" from "service_role";

revoke truncate on table "public"."user_quests" from "service_role";

revoke update on table "public"."user_quests" from "service_role";

revoke delete on table "public"."user_stats" from "anon";

revoke insert on table "public"."user_stats" from "anon";

revoke references on table "public"."user_stats" from "anon";

revoke select on table "public"."user_stats" from "anon";

revoke trigger on table "public"."user_stats" from "anon";

revoke truncate on table "public"."user_stats" from "anon";

revoke update on table "public"."user_stats" from "anon";

revoke delete on table "public"."user_stats" from "authenticated";

revoke insert on table "public"."user_stats" from "authenticated";

revoke references on table "public"."user_stats" from "authenticated";

revoke select on table "public"."user_stats" from "authenticated";

revoke trigger on table "public"."user_stats" from "authenticated";

revoke truncate on table "public"."user_stats" from "authenticated";

revoke update on table "public"."user_stats" from "authenticated";

revoke delete on table "public"."user_stats" from "service_role";

revoke insert on table "public"."user_stats" from "service_role";

revoke references on table "public"."user_stats" from "service_role";

revoke select on table "public"."user_stats" from "service_role";

revoke trigger on table "public"."user_stats" from "service_role";

revoke truncate on table "public"."user_stats" from "service_role";

revoke update on table "public"."user_stats" from "service_role";

revoke delete on table "public"."warehouse_items" from "anon";

revoke insert on table "public"."warehouse_items" from "anon";

revoke references on table "public"."warehouse_items" from "anon";

revoke select on table "public"."warehouse_items" from "anon";

revoke trigger on table "public"."warehouse_items" from "anon";

revoke truncate on table "public"."warehouse_items" from "anon";

revoke update on table "public"."warehouse_items" from "anon";

revoke delete on table "public"."warehouse_items" from "authenticated";

revoke insert on table "public"."warehouse_items" from "authenticated";

revoke references on table "public"."warehouse_items" from "authenticated";

revoke select on table "public"."warehouse_items" from "authenticated";

revoke trigger on table "public"."warehouse_items" from "authenticated";

revoke truncate on table "public"."warehouse_items" from "authenticated";

revoke update on table "public"."warehouse_items" from "authenticated";

revoke delete on table "public"."warehouse_items" from "service_role";

revoke insert on table "public"."warehouse_items" from "service_role";

revoke references on table "public"."warehouse_items" from "service_role";

revoke select on table "public"."warehouse_items" from "service_role";

revoke trigger on table "public"."warehouse_items" from "service_role";

revoke truncate on table "public"."warehouse_items" from "service_role";

revoke update on table "public"."warehouse_items" from "service_role";

alter table "public"."admin_roles" drop constraint "admin_roles_user_id_fkey";

alter table "public"."admin_roles" drop constraint "admin_roles_user_id_role_key";

alter table "public"."cart_items" drop constraint "cart_items_user_id_fkey";

alter table "public"."deliveries" drop constraint "data_futura";

alter table "public"."deliveries" drop constraint "deliveries_user_id_fkey";

alter table "public"."digital_files" drop constraint "digital_files_delivery_id_fkey";

alter table "public"."digital_files" drop constraint "digital_files_user_id_fkey";

alter table "public"."digital_messages" drop constraint "digital_messages_delivery_id_fkey";

alter table "public"."digital_messages" drop constraint "digital_messages_user_id_fkey";

alter table "public"."messages" drop constraint "messages_user_id_fkey";

alter table "public"."payments" drop constraint "payments_user_id_fkey";

alter table "public"."scheduled_notifications" drop constraint "data_futura_notif";

alter table "public"."scheduled_notifications" drop constraint "email_valido";

alter table "public"."scheduled_notifications" drop constraint "scheduled_notifications_user_id_fkey";

alter table "public"."user_achievements" drop constraint "user_achievements_achievement_id_fkey";

alter table "public"."user_achievements" drop constraint "user_achievements_user_id_achievement_id_key";

alter table "public"."user_achievements" drop constraint "user_achievements_user_id_fkey";

alter table "public"."user_quests" drop constraint "user_quests_quest_id_fkey";

alter table "public"."user_quests" drop constraint "user_quests_user_id_fkey";

alter table "public"."user_quests" drop constraint "user_quests_user_id_quest_id_key";

alter table "public"."user_stats" drop constraint "user_stats_user_id_fkey";

drop function if exists "public"."calculate_level"(points integer);

drop function if exists "public"."is_admin"(uid uuid);

alter table "public"."achievements" drop constraint "achievements_pkey";

alter table "public"."admin_roles" drop constraint "admin_roles_pkey";

alter table "public"."cart_items" drop constraint "cart_items_pkey";

alter table "public"."deliveries" drop constraint "deliveries_pkey";

alter table "public"."digital_files" drop constraint "digital_files_pkey";

alter table "public"."digital_messages" drop constraint "digital_messages_pkey";

alter table "public"."payments" drop constraint "payments_pkey";

alter table "public"."quests" drop constraint "quests_pkey";

alter table "public"."scheduled_notifications" drop constraint "scheduled_notifications_pkey";

alter table "public"."user_achievements" drop constraint "user_achievements_pkey";

alter table "public"."user_quests" drop constraint "user_quests_pkey";

alter table "public"."user_stats" drop constraint "user_stats_pkey";

alter table "public"."warehouse_items" drop constraint "warehouse_items_pkey";

drop index if exists "public"."achievements_pkey";

drop index if exists "public"."admin_roles_pkey";

drop index if exists "public"."admin_roles_user_id_role_key";

drop index if exists "public"."cart_items_pkey";

drop index if exists "public"."deliveries_pkey";

drop index if exists "public"."digital_files_pkey";

drop index if exists "public"."digital_messages_pkey";

drop index if exists "public"."idx_scheduled_notifications_pending";

drop index if exists "public"."payments_pkey";

drop index if exists "public"."quests_pkey";

drop index if exists "public"."scheduled_notifications_pkey";

drop index if exists "public"."user_achievements_pkey";

drop index if exists "public"."user_achievements_user_id_achievement_id_key";

drop index if exists "public"."user_quests_pkey";

drop index if exists "public"."user_quests_user_id_quest_id_key";

drop index if exists "public"."user_stats_pkey";

drop index if exists "public"."warehouse_items_pkey";

drop table "public"."achievements";

drop table "public"."admin_roles";

drop table "public"."cart_items";

drop table "public"."deliveries";

drop table "public"."digital_files";

drop table "public"."digital_messages";

drop table "public"."payments";

drop table "public"."quests";

drop table "public"."scheduled_notifications";

drop table "public"."user_achievements";

drop table "public"."user_quests";

drop table "public"."user_stats";

drop table "public"."warehouse_items";

create table "public"."challenges" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text not null,
    "points" integer not null default 0,
    "type" text not null,
    "target_value" integer not null,
    "time_window" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."challenges" enable row level security;

create table "public"."favorites" (
    "id" uuid not null default gen_random_uuid(),
    "client_id" uuid not null,
    "provider_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."favorites" enable row level security;

create table "public"."fleet_groups" (
    "id" uuid not null default gen_random_uuid(),
    "owner_id" uuid not null,
    "name" text not null,
    "description" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."fleet_groups" enable row level security;

create table "public"."fleet_members" (
    "id" uuid not null default gen_random_uuid(),
    "fleet_id" uuid not null,
    "member_id" uuid not null,
    "status" fleet_member_status default 'invited'::fleet_member_status,
    "joined_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."fleet_members" enable row level security;

create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "message" text not null,
    "read" boolean default false,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."notifications" enable row level security;

create table "public"."price_estimates" (
    "id" uuid not null default gen_random_uuid(),
    "client_id" uuid not null,
    "provider_id" uuid not null,
    "start_location" text not null,
    "end_location" text not null,
    "estimated_fare" numeric(10,2) not null,
    "distance_km" numeric(10,2),
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."price_estimates" enable row level security;

create table "public"."quick_requests" (
    "id" uuid not null default gen_random_uuid(),
    "client_id" uuid not null,
    "service_type" text not null,
    "start_location" text not null,
    "end_location" text,
    "status" text not null default 'pending'::text,
    "assigned_provider" uuid,
    "suggested_providers" uuid[] default '{}'::uuid[],
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."quick_requests" enable row level security;

create table "public"."ratings" (
    "id" uuid not null default gen_random_uuid(),
    "client_id" uuid not null,
    "provider_id" uuid not null,
    "ride_id" uuid,
    "overall_rating" integer not null,
    "punctuality" integer,
    "friendliness" integer,
    "price_fairness" integer,
    "comments" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."ratings" enable row level security;

create table "public"."ride_reports" (
    "id" uuid not null default gen_random_uuid(),
    "provider_id" uuid not null,
    "total_rides" integer default 0,
    "total_distance_km" numeric(10,2) default 0,
    "total_earnings" numeric(10,2) default 0,
    "avg_fare" numeric(10,2) default 0,
    "period" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."ride_reports" enable row level security;

create table "public"."rides" (
    "id" uuid not null default gen_random_uuid(),
    "provider_id" uuid not null,
    "client_id" uuid,
    "start_location" text,
    "end_location" text,
    "start_time" timestamp with time zone,
    "end_time" timestamp with time zone,
    "distance_km" numeric(10,2),
    "waiting_time_min" integer default 0,
    "tariff_profile_id" uuid,
    "total_fare" numeric(10,2),
    "tip" numeric(10,2) default 0,
    "payment_method" text,
    "receipt_pdf_url" text,
    "was_offline" boolean default false,
    "synced" boolean default true,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."rides" enable row level security;

create table "public"."tariff_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "provider_id" uuid not null,
    "name" text not null,
    "base_fare" numeric(10,2) not null default 0,
    "price_per_km" numeric(10,2) not null default 0,
    "price_per_min" numeric(10,2) not null default 0,
    "night_extra" numeric(5,2) not null default 0,
    "city" text,
    "active" boolean default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."tariff_profiles" enable row level security;

create table "public"."user_challenge_progress" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "challenge_id" uuid not null,
    "progress" integer not null default 0,
    "completed" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."user_challenge_progress" enable row level security;

alter table "public"."messages" drop column "content";

alter table "public"."messages" drop column "created_at";

alter table "public"."messages" drop column "delivery_date";

alter table "public"."messages" drop column "status";

alter table "public"."messages" drop column "title";

alter table "public"."messages" drop column "updated_at";

alter table "public"."messages" drop column "user_id";

alter table "public"."messages" add column "message" text not null;

alter table "public"."messages" add column "receiver_id" uuid not null;

alter table "public"."messages" add column "ride_id" uuid;

alter table "public"."messages" add column "sender_id" uuid not null;

alter table "public"."messages" add column "timestamp" timestamp with time zone not null default now();

alter table "public"."profiles" drop column "level";

alter table "public"."profiles" drop column "plan_type";

alter table "public"."profiles" drop column "total_points";

alter table "public"."profiles" add column "cancellation_policy" text;

alter table "public"."profiles" add column "description" text;

alter table "public"."profiles" add column "is_active" boolean default true;

alter table "public"."profiles" add column "location" text;

alter table "public"."profiles" add column "phone" text;

alter table "public"."profiles" add column "plan" subscription_plan default 'free'::subscription_plan;

alter table "public"."profiles" add column "rating_average" numeric(3,2) default 0;

alter table "public"."profiles" add column "role" user_role default 'client'::user_role;

alter table "public"."profiles" add column "service_type" text;

alter table "public"."profiles" add column "total_ratings" integer default 0;

alter table "public"."profiles" alter column "created_at" set not null;

alter table "public"."profiles" alter column "updated_at" set not null;

drop sequence if exists "public"."achievements_id_seq";

drop sequence if exists "public"."quests_id_seq";

drop sequence if exists "public"."user_achievements_id_seq";

drop sequence if exists "public"."user_quests_id_seq";

CREATE UNIQUE INDEX challenges_pkey ON public.challenges USING btree (id);

CREATE UNIQUE INDEX favorites_client_id_provider_id_key ON public.favorites USING btree (client_id, provider_id);

CREATE UNIQUE INDEX favorites_pkey ON public.favorites USING btree (id);

CREATE UNIQUE INDEX fleet_groups_pkey ON public.fleet_groups USING btree (id);

CREATE UNIQUE INDEX fleet_members_fleet_id_member_id_key ON public.fleet_members USING btree (fleet_id, member_id);

CREATE UNIQUE INDEX fleet_members_pkey ON public.fleet_members USING btree (id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX price_estimates_pkey ON public.price_estimates USING btree (id);

CREATE UNIQUE INDEX quick_requests_pkey ON public.quick_requests USING btree (id);

CREATE UNIQUE INDEX ratings_pkey ON public.ratings USING btree (id);

CREATE UNIQUE INDEX ride_reports_pkey ON public.ride_reports USING btree (id);

CREATE UNIQUE INDEX rides_pkey ON public.rides USING btree (id);

CREATE UNIQUE INDEX tariff_profiles_pkey ON public.tariff_profiles USING btree (id);

CREATE UNIQUE INDEX user_challenge_progress_pkey ON public.user_challenge_progress USING btree (id);

CREATE UNIQUE INDEX user_challenge_progress_user_id_challenge_id_key ON public.user_challenge_progress USING btree (user_id, challenge_id);

alter table "public"."challenges" add constraint "challenges_pkey" PRIMARY KEY using index "challenges_pkey";

alter table "public"."favorites" add constraint "favorites_pkey" PRIMARY KEY using index "favorites_pkey";

alter table "public"."fleet_groups" add constraint "fleet_groups_pkey" PRIMARY KEY using index "fleet_groups_pkey";

alter table "public"."fleet_members" add constraint "fleet_members_pkey" PRIMARY KEY using index "fleet_members_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."price_estimates" add constraint "price_estimates_pkey" PRIMARY KEY using index "price_estimates_pkey";

alter table "public"."quick_requests" add constraint "quick_requests_pkey" PRIMARY KEY using index "quick_requests_pkey";

alter table "public"."ratings" add constraint "ratings_pkey" PRIMARY KEY using index "ratings_pkey";

alter table "public"."ride_reports" add constraint "ride_reports_pkey" PRIMARY KEY using index "ride_reports_pkey";

alter table "public"."rides" add constraint "rides_pkey" PRIMARY KEY using index "rides_pkey";

alter table "public"."tariff_profiles" add constraint "tariff_profiles_pkey" PRIMARY KEY using index "tariff_profiles_pkey";

alter table "public"."user_challenge_progress" add constraint "user_challenge_progress_pkey" PRIMARY KEY using index "user_challenge_progress_pkey";

alter table "public"."challenges" add constraint "challenges_type_check" CHECK ((type = ANY (ARRAY['booking'::text, 'rating'::text, 'repeat'::text, 'new_provider'::text]))) not valid;

alter table "public"."challenges" validate constraint "challenges_type_check";

alter table "public"."favorites" add constraint "favorites_client_id_fkey" FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."favorites" validate constraint "favorites_client_id_fkey";

alter table "public"."favorites" add constraint "favorites_client_id_provider_id_key" UNIQUE using index "favorites_client_id_provider_id_key";

alter table "public"."favorites" add constraint "favorites_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."favorites" validate constraint "favorites_provider_id_fkey";

alter table "public"."fleet_groups" add constraint "fleet_groups_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."fleet_groups" validate constraint "fleet_groups_owner_id_fkey";

alter table "public"."fleet_members" add constraint "fleet_members_fleet_id_fkey" FOREIGN KEY (fleet_id) REFERENCES fleet_groups(id) ON DELETE CASCADE not valid;

alter table "public"."fleet_members" validate constraint "fleet_members_fleet_id_fkey";

alter table "public"."fleet_members" add constraint "fleet_members_fleet_id_member_id_key" UNIQUE using index "fleet_members_fleet_id_member_id_key";

alter table "public"."fleet_members" add constraint "fleet_members_member_id_fkey" FOREIGN KEY (member_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."fleet_members" validate constraint "fleet_members_member_id_fkey";

alter table "public"."messages" add constraint "messages_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_receiver_id_fkey";

alter table "public"."messages" add constraint "messages_ride_id_fkey" FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_ride_id_fkey";

alter table "public"."messages" add constraint "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_sender_id_fkey";

alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_user_id_fkey";

alter table "public"."price_estimates" add constraint "price_estimates_client_id_fkey" FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."price_estimates" validate constraint "price_estimates_client_id_fkey";

alter table "public"."price_estimates" add constraint "price_estimates_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."price_estimates" validate constraint "price_estimates_provider_id_fkey";

alter table "public"."quick_requests" add constraint "quick_requests_assigned_provider_fkey" FOREIGN KEY (assigned_provider) REFERENCES profiles(id) ON DELETE SET NULL not valid;

alter table "public"."quick_requests" validate constraint "quick_requests_assigned_provider_fkey";

alter table "public"."quick_requests" add constraint "quick_requests_client_id_fkey" FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."quick_requests" validate constraint "quick_requests_client_id_fkey";

alter table "public"."quick_requests" add constraint "quick_requests_service_type_check" CHECK ((service_type = ANY (ARRAY['transport'::text, 'delivery'::text, 'shopping'::text]))) not valid;

alter table "public"."quick_requests" validate constraint "quick_requests_service_type_check";

alter table "public"."quick_requests" add constraint "quick_requests_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'assigned'::text, 'declined'::text, 'completed'::text]))) not valid;

alter table "public"."quick_requests" validate constraint "quick_requests_status_check";

alter table "public"."ratings" add constraint "ratings_client_id_fkey" FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."ratings" validate constraint "ratings_client_id_fkey";

alter table "public"."ratings" add constraint "ratings_friendliness_check" CHECK (((friendliness >= 1) AND (friendliness <= 5))) not valid;

alter table "public"."ratings" validate constraint "ratings_friendliness_check";

alter table "public"."ratings" add constraint "ratings_overall_rating_check" CHECK (((overall_rating >= 1) AND (overall_rating <= 5))) not valid;

alter table "public"."ratings" validate constraint "ratings_overall_rating_check";

alter table "public"."ratings" add constraint "ratings_price_fairness_check" CHECK (((price_fairness >= 1) AND (price_fairness <= 5))) not valid;

alter table "public"."ratings" validate constraint "ratings_price_fairness_check";

alter table "public"."ratings" add constraint "ratings_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."ratings" validate constraint "ratings_provider_id_fkey";

alter table "public"."ratings" add constraint "ratings_punctuality_check" CHECK (((punctuality >= 1) AND (punctuality <= 5))) not valid;

alter table "public"."ratings" validate constraint "ratings_punctuality_check";

alter table "public"."ratings" add constraint "ratings_ride_id_fkey" FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE not valid;

alter table "public"."ratings" validate constraint "ratings_ride_id_fkey";

alter table "public"."ride_reports" add constraint "ride_reports_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."ride_reports" validate constraint "ride_reports_provider_id_fkey";

alter table "public"."rides" add constraint "rides_client_id_fkey" FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE SET NULL not valid;

alter table "public"."rides" validate constraint "rides_client_id_fkey";

alter table "public"."rides" add constraint "rides_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."rides" validate constraint "rides_provider_id_fkey";

alter table "public"."rides" add constraint "rides_tariff_profile_id_fkey" FOREIGN KEY (tariff_profile_id) REFERENCES tariff_profiles(id) ON DELETE SET NULL not valid;

alter table "public"."rides" validate constraint "rides_tariff_profile_id_fkey";

alter table "public"."tariff_profiles" add constraint "tariff_profiles_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."tariff_profiles" validate constraint "tariff_profiles_provider_id_fkey";

alter table "public"."user_challenge_progress" add constraint "user_challenge_progress_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE not valid;

alter table "public"."user_challenge_progress" validate constraint "user_challenge_progress_challenge_id_fkey";

alter table "public"."user_challenge_progress" add constraint "user_challenge_progress_user_id_challenge_id_key" UNIQUE using index "user_challenge_progress_user_id_challenge_id_key";

alter table "public"."user_challenge_progress" add constraint "user_challenge_progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_challenge_progress" validate constraint "user_challenge_progress_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.calculate_ride_fare(p_distance_km numeric, p_waiting_time_min integer, p_tariff_profile_id uuid, p_is_night boolean DEFAULT false)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_base_fare DECIMAL;
  v_price_per_km DECIMAL;
  v_price_per_min DECIMAL;
  v_night_extra DECIMAL;
  v_total_fare DECIMAL;
BEGIN
  -- Get tariff profile data
  SELECT base_fare, price_per_km, price_per_min, night_extra
  INTO v_base_fare, v_price_per_km, v_price_per_min, v_night_extra
  FROM public.tariff_profiles
  WHERE id = p_tariff_profile_id;
  
  -- Calculate base fare
  v_total_fare := v_base_fare + (p_distance_km * v_price_per_km) + (p_waiting_time_min * v_price_per_min);
  
  -- Apply night extra if applicable
  IF p_is_night THEN
    v_total_fare := v_total_fare * (1 + v_night_extra / 100);
  END IF;
  
  RETURN ROUND(v_total_fare, 2);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_quick_request()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Atualizar com prestadores sugeridos
  NEW.suggested_providers := public.suggest_providers_for_request(
    NEW.client_id,
    NEW.service_type,
    NEW.start_location
  );
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.log_security_event(event_type text, user_id uuid, details jsonb DEFAULT '{}'::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.notifications (user_id, title, message)
  VALUES (
    user_id,
    'Security Event',
    format('Security event: %s at %s', event_type, now())
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.suggest_providers_for_request(p_client_id uuid, p_service_type text, p_start_location text)
 RETURNS uuid[]
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  suggested_providers UUID[];
BEGIN
  -- Selecionar até 3 prestadores ativos ordenados por critérios
  SELECT ARRAY(
    SELECT p.id
    FROM public.profiles p
    WHERE p.role = 'provider' 
      AND p.is_active = true
      AND (p.service_type = p_service_type OR p.service_type IS NULL)
    ORDER BY 
      p.rating_average DESC NULLS LAST,
      p.total_ratings DESC NULLS LAST
    LIMIT 3
  ) INTO suggested_providers;
  
  RETURN suggested_providers;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_challenge_progress(p_user_id uuid, p_challenge_type text, p_increment integer DEFAULT 1)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_week TEXT;
  challenge_record RECORD;
BEGIN
  -- Obter semana atual no formato 2025-W25
  current_week := TO_CHAR(NOW(), 'IYYY-"W"IW');
  
  -- Iterar sobre desafios ativos do tipo especificado
  FOR challenge_record IN 
    SELECT c.id, c.target_value
    FROM public.challenges c
    WHERE c.type = p_challenge_type 
      AND c.time_window = current_week
  LOOP
    -- Inserir ou atualizar progresso
    INSERT INTO public.user_challenge_progress (user_id, challenge_id, progress)
    VALUES (p_user_id, challenge_record.id, p_increment)
    ON CONFLICT (user_id, challenge_id)
    DO UPDATE SET 
      progress = user_challenge_progress.progress + p_increment,
      completed = CASE 
        WHEN user_challenge_progress.progress + p_increment >= challenge_record.target_value 
        THEN true 
        ELSE user_challenge_progress.completed 
      END,
      updated_at = NOW();
  END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_provider_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Update provider's average rating and total count
  UPDATE public.profiles
  SET 
    rating_average = (
      SELECT AVG(overall_rating)::DECIMAL(3,2)
      FROM public.ratings
      WHERE provider_id = NEW.provider_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM public.ratings
      WHERE provider_id = NEW.provider_id
    )
  WHERE id = NEW.provider_id;
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."challenges" to "anon";

grant insert on table "public"."challenges" to "anon";

grant references on table "public"."challenges" to "anon";

grant select on table "public"."challenges" to "anon";

grant trigger on table "public"."challenges" to "anon";

grant truncate on table "public"."challenges" to "anon";

grant update on table "public"."challenges" to "anon";

grant delete on table "public"."challenges" to "authenticated";

grant insert on table "public"."challenges" to "authenticated";

grant references on table "public"."challenges" to "authenticated";

grant select on table "public"."challenges" to "authenticated";

grant trigger on table "public"."challenges" to "authenticated";

grant truncate on table "public"."challenges" to "authenticated";

grant update on table "public"."challenges" to "authenticated";

grant delete on table "public"."challenges" to "service_role";

grant insert on table "public"."challenges" to "service_role";

grant references on table "public"."challenges" to "service_role";

grant select on table "public"."challenges" to "service_role";

grant trigger on table "public"."challenges" to "service_role";

grant truncate on table "public"."challenges" to "service_role";

grant update on table "public"."challenges" to "service_role";

grant delete on table "public"."favorites" to "anon";

grant insert on table "public"."favorites" to "anon";

grant references on table "public"."favorites" to "anon";

grant select on table "public"."favorites" to "anon";

grant trigger on table "public"."favorites" to "anon";

grant truncate on table "public"."favorites" to "anon";

grant update on table "public"."favorites" to "anon";

grant delete on table "public"."favorites" to "authenticated";

grant insert on table "public"."favorites" to "authenticated";

grant references on table "public"."favorites" to "authenticated";

grant select on table "public"."favorites" to "authenticated";

grant trigger on table "public"."favorites" to "authenticated";

grant truncate on table "public"."favorites" to "authenticated";

grant update on table "public"."favorites" to "authenticated";

grant delete on table "public"."favorites" to "service_role";

grant insert on table "public"."favorites" to "service_role";

grant references on table "public"."favorites" to "service_role";

grant select on table "public"."favorites" to "service_role";

grant trigger on table "public"."favorites" to "service_role";

grant truncate on table "public"."favorites" to "service_role";

grant update on table "public"."favorites" to "service_role";

grant delete on table "public"."fleet_groups" to "anon";

grant insert on table "public"."fleet_groups" to "anon";

grant references on table "public"."fleet_groups" to "anon";

grant select on table "public"."fleet_groups" to "anon";

grant trigger on table "public"."fleet_groups" to "anon";

grant truncate on table "public"."fleet_groups" to "anon";

grant update on table "public"."fleet_groups" to "anon";

grant delete on table "public"."fleet_groups" to "authenticated";

grant insert on table "public"."fleet_groups" to "authenticated";

grant references on table "public"."fleet_groups" to "authenticated";

grant select on table "public"."fleet_groups" to "authenticated";

grant trigger on table "public"."fleet_groups" to "authenticated";

grant truncate on table "public"."fleet_groups" to "authenticated";

grant update on table "public"."fleet_groups" to "authenticated";

grant delete on table "public"."fleet_groups" to "service_role";

grant insert on table "public"."fleet_groups" to "service_role";

grant references on table "public"."fleet_groups" to "service_role";

grant select on table "public"."fleet_groups" to "service_role";

grant trigger on table "public"."fleet_groups" to "service_role";

grant truncate on table "public"."fleet_groups" to "service_role";

grant update on table "public"."fleet_groups" to "service_role";

grant delete on table "public"."fleet_members" to "anon";

grant insert on table "public"."fleet_members" to "anon";

grant references on table "public"."fleet_members" to "anon";

grant select on table "public"."fleet_members" to "anon";

grant trigger on table "public"."fleet_members" to "anon";

grant truncate on table "public"."fleet_members" to "anon";

grant update on table "public"."fleet_members" to "anon";

grant delete on table "public"."fleet_members" to "authenticated";

grant insert on table "public"."fleet_members" to "authenticated";

grant references on table "public"."fleet_members" to "authenticated";

grant select on table "public"."fleet_members" to "authenticated";

grant trigger on table "public"."fleet_members" to "authenticated";

grant truncate on table "public"."fleet_members" to "authenticated";

grant update on table "public"."fleet_members" to "authenticated";

grant delete on table "public"."fleet_members" to "service_role";

grant insert on table "public"."fleet_members" to "service_role";

grant references on table "public"."fleet_members" to "service_role";

grant select on table "public"."fleet_members" to "service_role";

grant trigger on table "public"."fleet_members" to "service_role";

grant truncate on table "public"."fleet_members" to "service_role";

grant update on table "public"."fleet_members" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant delete on table "public"."price_estimates" to "anon";

grant insert on table "public"."price_estimates" to "anon";

grant references on table "public"."price_estimates" to "anon";

grant select on table "public"."price_estimates" to "anon";

grant trigger on table "public"."price_estimates" to "anon";

grant truncate on table "public"."price_estimates" to "anon";

grant update on table "public"."price_estimates" to "anon";

grant delete on table "public"."price_estimates" to "authenticated";

grant insert on table "public"."price_estimates" to "authenticated";

grant references on table "public"."price_estimates" to "authenticated";

grant select on table "public"."price_estimates" to "authenticated";

grant trigger on table "public"."price_estimates" to "authenticated";

grant truncate on table "public"."price_estimates" to "authenticated";

grant update on table "public"."price_estimates" to "authenticated";

grant delete on table "public"."price_estimates" to "service_role";

grant insert on table "public"."price_estimates" to "service_role";

grant references on table "public"."price_estimates" to "service_role";

grant select on table "public"."price_estimates" to "service_role";

grant trigger on table "public"."price_estimates" to "service_role";

grant truncate on table "public"."price_estimates" to "service_role";

grant update on table "public"."price_estimates" to "service_role";

grant delete on table "public"."quick_requests" to "anon";

grant insert on table "public"."quick_requests" to "anon";

grant references on table "public"."quick_requests" to "anon";

grant select on table "public"."quick_requests" to "anon";

grant trigger on table "public"."quick_requests" to "anon";

grant truncate on table "public"."quick_requests" to "anon";

grant update on table "public"."quick_requests" to "anon";

grant delete on table "public"."quick_requests" to "authenticated";

grant insert on table "public"."quick_requests" to "authenticated";

grant references on table "public"."quick_requests" to "authenticated";

grant select on table "public"."quick_requests" to "authenticated";

grant trigger on table "public"."quick_requests" to "authenticated";

grant truncate on table "public"."quick_requests" to "authenticated";

grant update on table "public"."quick_requests" to "authenticated";

grant delete on table "public"."quick_requests" to "service_role";

grant insert on table "public"."quick_requests" to "service_role";

grant references on table "public"."quick_requests" to "service_role";

grant select on table "public"."quick_requests" to "service_role";

grant trigger on table "public"."quick_requests" to "service_role";

grant truncate on table "public"."quick_requests" to "service_role";

grant update on table "public"."quick_requests" to "service_role";

grant delete on table "public"."ratings" to "anon";

grant insert on table "public"."ratings" to "anon";

grant references on table "public"."ratings" to "anon";

grant select on table "public"."ratings" to "anon";

grant trigger on table "public"."ratings" to "anon";

grant truncate on table "public"."ratings" to "anon";

grant update on table "public"."ratings" to "anon";

grant delete on table "public"."ratings" to "authenticated";

grant insert on table "public"."ratings" to "authenticated";

grant references on table "public"."ratings" to "authenticated";

grant select on table "public"."ratings" to "authenticated";

grant trigger on table "public"."ratings" to "authenticated";

grant truncate on table "public"."ratings" to "authenticated";

grant update on table "public"."ratings" to "authenticated";

grant delete on table "public"."ratings" to "service_role";

grant insert on table "public"."ratings" to "service_role";

grant references on table "public"."ratings" to "service_role";

grant select on table "public"."ratings" to "service_role";

grant trigger on table "public"."ratings" to "service_role";

grant truncate on table "public"."ratings" to "service_role";

grant update on table "public"."ratings" to "service_role";

grant delete on table "public"."ride_reports" to "anon";

grant insert on table "public"."ride_reports" to "anon";

grant references on table "public"."ride_reports" to "anon";

grant select on table "public"."ride_reports" to "anon";

grant trigger on table "public"."ride_reports" to "anon";

grant truncate on table "public"."ride_reports" to "anon";

grant update on table "public"."ride_reports" to "anon";

grant delete on table "public"."ride_reports" to "authenticated";

grant insert on table "public"."ride_reports" to "authenticated";

grant references on table "public"."ride_reports" to "authenticated";

grant select on table "public"."ride_reports" to "authenticated";

grant trigger on table "public"."ride_reports" to "authenticated";

grant truncate on table "public"."ride_reports" to "authenticated";

grant update on table "public"."ride_reports" to "authenticated";

grant delete on table "public"."ride_reports" to "service_role";

grant insert on table "public"."ride_reports" to "service_role";

grant references on table "public"."ride_reports" to "service_role";

grant select on table "public"."ride_reports" to "service_role";

grant trigger on table "public"."ride_reports" to "service_role";

grant truncate on table "public"."ride_reports" to "service_role";

grant update on table "public"."ride_reports" to "service_role";

grant delete on table "public"."rides" to "anon";

grant insert on table "public"."rides" to "anon";

grant references on table "public"."rides" to "anon";

grant select on table "public"."rides" to "anon";

grant trigger on table "public"."rides" to "anon";

grant truncate on table "public"."rides" to "anon";

grant update on table "public"."rides" to "anon";

grant delete on table "public"."rides" to "authenticated";

grant insert on table "public"."rides" to "authenticated";

grant references on table "public"."rides" to "authenticated";

grant select on table "public"."rides" to "authenticated";

grant trigger on table "public"."rides" to "authenticated";

grant truncate on table "public"."rides" to "authenticated";

grant update on table "public"."rides" to "authenticated";

grant delete on table "public"."rides" to "service_role";

grant insert on table "public"."rides" to "service_role";

grant references on table "public"."rides" to "service_role";

grant select on table "public"."rides" to "service_role";

grant trigger on table "public"."rides" to "service_role";

grant truncate on table "public"."rides" to "service_role";

grant update on table "public"."rides" to "service_role";

grant delete on table "public"."tariff_profiles" to "anon";

grant insert on table "public"."tariff_profiles" to "anon";

grant references on table "public"."tariff_profiles" to "anon";

grant select on table "public"."tariff_profiles" to "anon";

grant trigger on table "public"."tariff_profiles" to "anon";

grant truncate on table "public"."tariff_profiles" to "anon";

grant update on table "public"."tariff_profiles" to "anon";

grant delete on table "public"."tariff_profiles" to "authenticated";

grant insert on table "public"."tariff_profiles" to "authenticated";

grant references on table "public"."tariff_profiles" to "authenticated";

grant select on table "public"."tariff_profiles" to "authenticated";

grant trigger on table "public"."tariff_profiles" to "authenticated";

grant truncate on table "public"."tariff_profiles" to "authenticated";

grant update on table "public"."tariff_profiles" to "authenticated";

grant delete on table "public"."tariff_profiles" to "service_role";

grant insert on table "public"."tariff_profiles" to "service_role";

grant references on table "public"."tariff_profiles" to "service_role";

grant select on table "public"."tariff_profiles" to "service_role";

grant trigger on table "public"."tariff_profiles" to "service_role";

grant truncate on table "public"."tariff_profiles" to "service_role";

grant update on table "public"."tariff_profiles" to "service_role";

grant delete on table "public"."user_challenge_progress" to "anon";

grant insert on table "public"."user_challenge_progress" to "anon";

grant references on table "public"."user_challenge_progress" to "anon";

grant select on table "public"."user_challenge_progress" to "anon";

grant trigger on table "public"."user_challenge_progress" to "anon";

grant truncate on table "public"."user_challenge_progress" to "anon";

grant update on table "public"."user_challenge_progress" to "anon";

grant delete on table "public"."user_challenge_progress" to "authenticated";

grant insert on table "public"."user_challenge_progress" to "authenticated";

grant references on table "public"."user_challenge_progress" to "authenticated";

grant select on table "public"."user_challenge_progress" to "authenticated";

grant trigger on table "public"."user_challenge_progress" to "authenticated";

grant truncate on table "public"."user_challenge_progress" to "authenticated";

grant update on table "public"."user_challenge_progress" to "authenticated";

grant delete on table "public"."user_challenge_progress" to "service_role";

grant insert on table "public"."user_challenge_progress" to "service_role";

grant references on table "public"."user_challenge_progress" to "service_role";

grant select on table "public"."user_challenge_progress" to "service_role";

grant trigger on table "public"."user_challenge_progress" to "service_role";

grant truncate on table "public"."user_challenge_progress" to "service_role";

grant update on table "public"."user_challenge_progress" to "service_role";

create policy "Everyone can view challenges"
on "public"."challenges"
as permissive
for select
to public
using (true);


create policy "Only admins can manage challenges"
on "public"."challenges"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role)))));


create policy "Providers can see who favorited them"
on "public"."favorites"
as permissive
for select
to public
using ((auth.uid() = provider_id));


create policy "Users can manage their own favorites"
on "public"."favorites"
as permissive
for all
to public
using ((auth.uid() = client_id));


create policy "Fleet owners can manage their groups"
on "public"."fleet_groups"
as permissive
for all
to public
using ((auth.uid() = owner_id));


create policy "Fleet owners and members can view memberships"
on "public"."fleet_members"
as permissive
for select
to public
using (((auth.uid() IN ( SELECT fleet_groups.owner_id
   FROM fleet_groups
  WHERE (fleet_groups.id = fleet_members.fleet_id))) OR (auth.uid() = member_id)));


create policy "Fleet owners can manage memberships"
on "public"."fleet_members"
as permissive
for all
to public
using ((auth.uid() IN ( SELECT fleet_groups.owner_id
   FROM fleet_groups
  WHERE (fleet_groups.id = fleet_members.fleet_id))));


create policy "Users can see messages they sent or received"
on "public"."messages"
as permissive
for all
to public
using (((auth.uid() = sender_id) OR (auth.uid() = receiver_id)));


create policy "Users can manage their notifications"
on "public"."notifications"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Users can manage their price estimates"
on "public"."price_estimates"
as permissive
for all
to public
using (((auth.uid() = client_id) OR (auth.uid() = provider_id)));


create policy "Providers can be discovered by clients"
on "public"."profiles"
as permissive
for select
to public
using (((role = 'provider'::user_role) AND (is_active = true)));


create policy "Clients can create their own quick requests"
on "public"."quick_requests"
as permissive
for insert
to public
with check ((auth.uid() = client_id));


create policy "Clients can view their own quick requests"
on "public"."quick_requests"
as permissive
for select
to public
using ((auth.uid() = client_id));


create policy "Providers can update requests assigned to them"
on "public"."quick_requests"
as permissive
for update
to public
using ((auth.uid() = assigned_provider));


create policy "Providers can view requests where they are suggested or assigne"
on "public"."quick_requests"
as permissive
for select
to public
using (((auth.uid() = assigned_provider) OR (auth.uid() = ANY (suggested_providers))));


create policy "Providers can see their ratings"
on "public"."ratings"
as permissive
for select
to public
using ((auth.uid() = provider_id));


create policy "Users can manage ratings they created"
on "public"."ratings"
as permissive
for all
to public
using ((auth.uid() = client_id));


create policy "Providers can view their reports"
on "public"."ride_reports"
as permissive
for all
to public
using ((auth.uid() = provider_id));


create policy "Providers can manage their rides"
on "public"."rides"
as permissive
for all
to public
using (((auth.uid() = provider_id) OR (auth.uid() = client_id)));


create policy "Providers can manage their tariff profiles"
on "public"."tariff_profiles"
as permissive
for all
to public
using ((auth.uid() = provider_id));


create policy "Users can update their own challenge progress"
on "public"."user_challenge_progress"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Users can view their own challenge progress"
on "public"."user_challenge_progress"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own profile"
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view their own profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


CREATE TRIGGER on_quick_request_created BEFORE INSERT ON public.quick_requests FOR EACH ROW EXECUTE FUNCTION handle_new_quick_request();

CREATE TRIGGER on_rating_created_or_updated AFTER INSERT OR UPDATE ON public.ratings FOR EACH ROW EXECUTE FUNCTION update_provider_rating();


