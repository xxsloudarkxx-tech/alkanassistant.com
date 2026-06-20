CREATE TABLE public.bot_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  phone text,
  interest text,
  payment_method text,
  message text,
  conversation jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bot_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert bot leads"
  ON public.bot_conversations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read bot leads"
  ON public.bot_conversations
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));