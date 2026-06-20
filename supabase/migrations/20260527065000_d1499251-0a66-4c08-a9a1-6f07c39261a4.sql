CREATE UNIQUE INDEX IF NOT EXISTS leads_client_permit_unique
  ON public.leads (client_id, permit_number)
  WHERE permit_number IS NOT NULL;