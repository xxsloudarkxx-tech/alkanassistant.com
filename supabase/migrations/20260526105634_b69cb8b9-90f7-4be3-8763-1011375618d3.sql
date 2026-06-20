-- Drop insecure policies that read user_metadata
DROP POLICY IF EXISTS "Users see own client leads" ON public.leads;
DROP POLICY IF EXISTS "Users insert own client leads" ON public.leads;
DROP POLICY IF EXISTS "Users update own client leads" ON public.leads;
DROP POLICY IF EXISTS "Users delete own client leads" ON public.leads;

-- Secure mapping: user_id -> client_id, only admins can write
CREATE TABLE IF NOT EXISTS public.client_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_profiles_client_id ON public.client_profiles(client_id);

ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own client profile"
  ON public.client_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage client profiles"
  ON public.client_profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Secure helper: returns the current user's client_id
CREATE OR REPLACE FUNCTION public.get_my_client_id()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT client_id FROM public.client_profiles WHERE user_id = auth.uid();
$$;

REVOKE EXECUTE ON FUNCTION public.get_my_client_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_client_id() TO authenticated;

-- Secure leads policies based on client_profiles mapping
CREATE POLICY "Users see own client leads"
  ON public.leads FOR SELECT TO authenticated
  USING (client_id IS NOT NULL AND client_id = public.get_my_client_id());

CREATE POLICY "Users insert own client leads"
  ON public.leads FOR INSERT TO authenticated
  WITH CHECK (client_id IS NOT NULL AND client_id = public.get_my_client_id());

CREATE POLICY "Users update own client leads"
  ON public.leads FOR UPDATE TO authenticated
  USING (client_id IS NOT NULL AND client_id = public.get_my_client_id())
  WITH CHECK (client_id IS NOT NULL AND client_id = public.get_my_client_id());

CREATE POLICY "Users delete own client leads"
  ON public.leads FOR DELETE TO authenticated
  USING (client_id IS NOT NULL AND client_id = public.get_my_client_id());

-- Auto-update updated_at on client_profiles
CREATE TRIGGER trg_client_profiles_updated_at
  BEFORE UPDATE ON public.client_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();