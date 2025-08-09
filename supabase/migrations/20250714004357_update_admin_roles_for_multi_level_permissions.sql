-- Adicionar coluna 'permissions' à tabela 'admin_roles'
ALTER TABLE public.admin_roles
ADD COLUMN permissions jsonb DEFAULT '{}'::jsonb;

-- Atualizar a função is_admin para verificar permissões específicas
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid, required_permission text DEFAULT 'admin')
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SET LOCAL row_security = off;
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles WHERE user_id = uid AND (role = 'admin' OR permissions @> jsonb_build_array(required_permission))
  );
$$;

-- Opcional: Migrar dados existentes ou definir permissões padrão
-- UPDATE public.admin_roles SET permissions = '["admin_dashboard", "manage_users"]'::jsonb WHERE role = 'admin';