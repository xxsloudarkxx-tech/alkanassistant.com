CREATE TABLE public.voice_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  service text,
  city text,
  urgency text,
  notes text,
  scheduled_at timestamptz,
  gcal_event_id text,
  gcal_event_link text,
  transcript jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.voice_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert voice bookings"
  ON public.voice_bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins manage voice bookings"
  ON public.voice_bookings FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));