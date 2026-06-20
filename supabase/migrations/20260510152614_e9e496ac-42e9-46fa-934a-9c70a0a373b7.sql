CREATE OR REPLACE FUNCTION public.get_public_leads()
RETURNS TABLE (
  id uuid,
  first_name text,
  company_masked text,
  city text,
  state text,
  industry text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    l.id,
    split_part(l.name, ' ', 1) AS first_name,
    CASE
      WHEN l.company IS NULL THEN NULL
      WHEN length(l.company) <= 2 THEN l.company
      ELSE left(l.company, 2) || repeat('*', greatest(length(l.company) - 2, 1))
    END AS company_masked,
    l.city,
    l.state,
    l.industry,
    l.created_at
  FROM public.leads l
  ORDER BY l.created_at DESC
  LIMIT 24;
$$;

REVOKE ALL ON FUNCTION public.get_public_leads() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_leads() TO anon, authenticated;