-- Storage buckets & RLS policies (required for image / logo uploads)

INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;

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
