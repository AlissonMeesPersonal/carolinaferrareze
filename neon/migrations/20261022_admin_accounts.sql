-- Acesso profissional de duas funções: suporte e proprietária.
-- Usuários não aparecem no site público. A proprietária pode revisar/desativar o suporte.
CREATE TABLE IF NOT EXISTS public.cf_admin_users (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 email text NOT NULL UNIQUE,
 password_hash text,
 role text NOT NULL CHECK(role IN ('support','owner')),
 active boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now(),
 last_login_at timestamptz,
 CONSTRAINT cf_admin_users_email_normalized CHECK(email=lower(trim(email)))
);
CREATE TABLE IF NOT EXISTS public.cf_admin_invites (
 token_hash text PRIMARY KEY,
 user_id uuid NOT NULL REFERENCES public.cf_admin_users(id) ON DELETE CASCADE,
 created_by uuid REFERENCES public.cf_admin_users(id) ON DELETE SET NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL,
 used_at timestamptz
);
ALTER TABLE public.cf_admin_sessions
 ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES public.cf_admin_users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS cf_admin_sessions_account_idx ON public.cf_admin_sessions(account_id);
CREATE TABLE IF NOT EXISTS public.cf_admin_audit (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 user_id uuid REFERENCES public.cf_admin_users(id) ON DELETE SET NULL,
 action text NOT NULL,
 subject text,
 created_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.cf_admin_users(email,role,active)
 VALUES ('alissonyagomees@gmail.com','support',true)
 ON CONFLICT(email) DO NOTHING;
