ALTER TABLE public.client_profiles
  ADD CONSTRAINT client_profiles_user_id_unique UNIQUE (user_id);