-- Create guides table (safe to re-run)
CREATE TABLE IF NOT EXISTS public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  speciality text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.guides TO anon, authenticated;
GRANT ALL ON public.guides TO authenticated;
GRANT ALL ON public.guides TO service_role;

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read guides" ON public.guides;
CREATE POLICY "public read guides" ON public.guides
  FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "admins write guides" ON public.guides;
CREATE POLICY "admins write guides" ON public.guides
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS trg_guides_updated ON public.guides;
CREATE TRIGGER trg_guides_updated
  BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Seed data (safe to re-run)
INSERT INTO public.guides (name, speciality, avatar_url, sort_order)
SELECT * FROM (VALUES
('Pasang Sherpa','Everest Region Expert','https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',1),
('Tenzing Bhote','Annapurna & Mustang Specialist','https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',2),
('Karma Lama','Technical Climbing Instructor','https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',3),
('Phurba Tamang','Cultural Tour Guide','https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400',4)) AS v(name, speciality, avatar_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.guides);
