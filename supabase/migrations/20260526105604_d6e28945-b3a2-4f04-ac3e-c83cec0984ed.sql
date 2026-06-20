-- Add columns needed for Alkan Lead Hunter
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS client_id TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS permit_number TEXT,
  ADD COLUMN IF NOT EXISTS jurisdiction TEXT,
  ADD COLUMN IF NOT EXISTS permit_score INTEGER,
  ADD COLUMN IF NOT EXISTS golden_lead BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS permit_data JSONB,
  ADD COLUMN IF NOT EXISTS enrichment_data JSONB,
  ADD COLUMN IF NOT EXISTS last_contacted TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_leads_client_id ON public.leads(client_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_permit_number ON public.leads(permit_number);

-- Per-client access: a user can see/manage leads where client_id matches
-- the client_id in their JWT app_metadata.
CREATE POLICY "Users see own client leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (
    client_id IS NOT NULL
    AND client_id = COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'client_id'),
      (auth.jwt() -> 'user_metadata' ->> 'client_id')
    )
  );

CREATE POLICY "Users insert own client leads"
  ON public.leads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id IS NOT NULL
    AND client_id = COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'client_id'),
      (auth.jwt() -> 'user_metadata' ->> 'client_id')
    )
  );

CREATE POLICY "Users update own client leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (
    client_id IS NOT NULL
    AND client_id = COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'client_id'),
      (auth.jwt() -> 'user_metadata' ->> 'client_id')
    )
  )
  WITH CHECK (
    client_id IS NOT NULL
    AND client_id = COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'client_id'),
      (auth.jwt() -> 'user_metadata' ->> 'client_id')
    )
  );

CREATE POLICY "Users delete own client leads"
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (
    client_id IS NOT NULL
    AND client_id = COALESCE(
      (auth.jwt() -> 'app_metadata' ->> 'client_id'),
      (auth.jwt() -> 'user_metadata' ->> 'client_id')
    )
  );