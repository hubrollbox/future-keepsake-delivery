# Recomendações para Segurança e Políticas de Acesso (Supabase)

## 1. Row Level Security (RLS)

Ative RLS nas tabelas sensíveis (ex: deliveries, users):

```sql
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
```

Exemplo de política para garantir que só o dono pode ver/editar as suas entregas:

```sql
CREATE POLICY "Users can access their own deliveries" ON public.deliveries
  FOR ALL
  USING (user_id = auth.uid());
```

## 2. Constraints e Validações

Garanta integridade dos dados com constraints:

```sql
ALTER TABLE public.deliveries
  ADD CONSTRAINT email_valido CHECK (recipient_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');

ALTER TABLE public.deliveries
  ADD CONSTRAINT data_futura CHECK (delivery_date >= CURRENT_DATE);
```

## 3. Funções seguras

Se usar funções SQL, adicione checks de segurança:

```sql
CREATE FUNCTION public.get_user_deliveries()
RETURNS SETOF public.deliveries
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.deliveries WHERE user_id = auth.uid();
$$;
```

## 4. Teste as políticas

- Use a interface do Supabase para simular diferentes utilizadores.
- Tente aceder a dados de outros utilizadores: deve ser negado.

---

**Nota:** Adapte os nomes das tabelas/campos conforme o seu esquema.
