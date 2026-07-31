-- Add social media links and legal registration details supplied by the owner.
-- Rendered in the site footer (see footer-cta.tsx). Editable later via admin.
INSERT INTO public.site_settings (key, value) VALUES
  ('social', '{
     "instagram": "https://www.instagram.com/dreamadventurenepal/",
     "facebook": "https://www.facebook.com/profile.php?id=61592491374757"
   }'::jsonb),
  ('legal', '{
     "registration_no": "396637/83/84",
     "registrar": "Company Registrar Office of Nepal"
   }'::jsonb)
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value, updated_at = now();
