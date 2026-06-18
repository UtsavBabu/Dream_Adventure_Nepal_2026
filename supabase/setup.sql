-- 1. CREATE TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon, authenticated;
GRANT ALL ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read team_members" ON public.team_members;
CREATE POLICY "public read team_members" ON public.team_members FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "admins write team_members" ON public.team_members;
CREATE POLICY "admins write team_members" ON public.team_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS trg_team_members_updated ON public.team_members;
CREATE TRIGGER trg_team_members_updated BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 2. SEED TEAM MEMBERS
INSERT INTO public.team_members (name, role, bio, avatar_url, sort_order) VALUES
('Dawa Sherpa','Lead Guide & Founder','With over 20 years of experience in the Himalayas, Dawa has led expeditions across all major peaks and treks in Nepal.','https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',1),
('Mingma Tamang','Senior Trek Leader','Mingma has been guiding treks since 2008 and knows the Annapurna and Everest regions like the back of his hand.','https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',2),
('Pema Lama','Operations Manager','Pema ensures every trip runs smoothly behind the scenes — from permits to porters to accommodation.','https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',3),
('Nima Gurung','Heli Tour Specialist','Nima coordinates all helicopter operations and ensures safe, timely flights for our heli tour guests.','https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400',4)
ON CONFLICT DO NOTHING;

-- 3. CREATE STORAGE BUCKETS FOR IMAGE UPLOADS
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;

-- 4. STORAGE POLICIES
DROP POLICY IF EXISTS "public read images" ON storage.objects;
CREATE POLICY "public read images" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('images', 'logos'));

DROP POLICY IF EXISTS "auth upload images" ON storage.objects;
CREATE POLICY "auth upload images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('images', 'logos'));

DROP POLICY IF EXISTS "auth update images" ON storage.objects;
CREATE POLICY "auth update images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('images', 'logos'));

DROP POLICY IF EXISTS "auth delete images" ON storage.objects;
CREATE POLICY "auth delete images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('images', 'logos'));
