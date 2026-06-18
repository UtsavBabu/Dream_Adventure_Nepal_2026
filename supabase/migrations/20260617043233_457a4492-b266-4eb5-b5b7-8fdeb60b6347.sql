
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- updated_at helper
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- SITE SETTINGS (key/value JSON for hero, about, contact, footer, nav...)
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write site_settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ADVENTURES
CREATE TABLE public.adventures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  long_description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'Moderate',
  price text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Trek',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.adventures TO anon, authenticated;
GRANT ALL ON public.adventures TO authenticated;
GRANT ALL ON public.adventures TO service_role;
ALTER TABLE public.adventures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read adventures" ON public.adventures FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins write adventures" ON public.adventures FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_adventures_updated BEFORE UPDATE ON public.adventures FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  review text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins write testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_testimonials_updated BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- GALLERY
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT ALL ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read gallery" ON public.gallery_images FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins write gallery" ON public.gallery_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SEED SITE SETTINGS
INSERT INTO public.site_settings (key, value) VALUES
('hero', '{
  "badge": "Trusted Himalayan Adventure Experts Since 2005",
  "title_pre": "Explore Nepal Beyond",
  "title_highlight": "The Ordinary",
  "subtitle": "Experience breathtaking treks, mountain expeditions, helicopter tours and cultural journeys crafted by local experts.",
  "cta_primary": "Start Your Journey",
  "cta_secondary": "Watch Our Story",
  "video_url": "https://videos.pexels.com/video-files/2169880/2169880-uhd_3840_2160_30fps.mp4",
  "poster_url": "https://images.pexels.com/photos/2403568/pexels-photo-2403568.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "stats": [
    {"label": "Rating", "value": "4.9/5", "sub": "★★★★★"},
    {"label": "Happy Travelers", "value": "5000+", "sub": ""},
    {"label": "Years Experience", "value": "20+", "sub": ""},
    {"label": "Local Experts", "value": "100%", "sub": ""}
  ]
}'::jsonb),
('nav', '{
  "logo": "Dream Adventure Nepal",
  "cta": "Plan My Trip",
  "links": [
    {"label": "Home", "href": "/"},
    {"label": "Treks", "href": "/treks"},
    {"label": "Expeditions", "href": "/expeditions"},
    {"label": "Tours", "href": "/tours"},
    {"label": "About", "href": "#about"},
    {"label": "Gallery", "href": "#gallery"},
    {"label": "Contact", "href": "#contact"}
  ]
}'::jsonb),
('about', '{
  "eyebrow": "Why Choose Dream Adventure Nepal",
  "title": "Two decades of Himalayan expertise",
  "subtitle": "We craft expeditions that go beyond a checklist — built on safety, local knowledge, and the kind of stories you only get from the people who grew up under these mountains.",
  "features": [
    {"title": "Government Registered", "desc": "Fully licensed by the Nepal Tourism Board."},
    {"title": "Experienced Guides", "desc": "Sherpa-led teams with 10+ years on every route."},
    {"title": "Safety First", "desc": "Oxygen, satellite comms, and trained medics."},
    {"title": "Customized Trips", "desc": "Itineraries tailored to your pace and ambition."},
    {"title": "Best Price Guarantee", "desc": "No middlemen. Direct local pricing."},
    {"title": "24/7 Support", "desc": "Operations desk reachable anytime, anywhere."}
  ]
}'::jsonb),
('cta', '{
  "title": "Ready For Your Himalayan Adventure?",
  "subtitle": "Talk to a local expert. No commitments, no pressure — just honest answers.",
  "button": "Get Free Consultation"
}'::jsonb),
('contact', '{
  "email": "hello@dreamadventurenepal.com",
  "phone": "+977 1 4000000",
  "whatsapp": "+977 98 00000000",
  "address": "Thamel, Kathmandu, Nepal"
}'::jsonb),
('footer', '{
  "tagline": "Crafting Himalayan adventures since 2005.",
  "copyright": "© 2025 Dream Adventure Nepal. All rights reserved."
}'::jsonb);

-- SEED ADVENTURES
INSERT INTO public.adventures (title, slug, description, image_url, duration, difficulty, price, category, sort_order) VALUES
('Everest Base Camp Trek','everest-base-camp','Stand at the foot of the world''s highest mountain on this legendary 14-day trek through Sherpa heartland.','https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=1600','14 Days','Challenging','$1,499','Trek',1),
('Annapurna Circuit','annapurna-circuit','A complete loop through diverse landscapes, ancient villages and the dramatic Thorong La pass at 5,416m.','https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1600','16 Days','Moderate','$1,299','Trek',2),
('Upper Mustang','upper-mustang','Walk into the forbidden kingdom — a desert-like plateau of ochre cliffs and Tibetan-era monasteries.','https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1600','12 Days','Moderate','$2,199','Trek',3),
('Manaslu Circuit','manaslu-circuit','Remote, raw and uncrowded. Cross the Larkya La pass beneath the 8th highest peak on earth.','https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=1600','15 Days','Challenging','$1,699','Trek',4),
('Island Peak Climb','island-peak','A perfect introduction to Himalayan mountaineering at 6,189m, with full technical support.','https://images.pexels.com/photos/839462/pexels-photo-839462.jpeg?auto=compress&cs=tinysrgb&w=1600','18 Days','Expert','$2,899','Expedition',5),
('Everest Helicopter Tour','everest-heli','Breakfast at Everest View Hotel after sunrise over the Khumbu — the most efficient way to meet the giants.','https://images.pexels.com/photos/2724664/pexels-photo-2724664.jpeg?auto=compress&cs=tinysrgb&w=1600','1 Day','Easy','$1,099','Heli Tour',6);

-- SEED TESTIMONIALS
INSERT INTO public.testimonials (name, country, avatar_url, review, rating, sort_order) VALUES
('Sarah Mitchell','United Kingdom','https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400','The most thoughtfully organised trek I''ve ever done. Our guide Dawa felt like family by the end of week two.',5,1),
('Lukas Bauer','Germany','https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400','From the airport pickup to the summit of Island Peak — every single detail was handled. Truly world class.',5,2),
('Aiko Tanaka','Japan','https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400','Mustang felt like a different planet. I cannot recommend Dream Adventure Nepal enough for serious travellers.',5,3),
('James O''Connor','Australia','https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400','The heli tour was a bucket-list moment. Punctual, professional and unforgettable views.',5,4);

-- SEED GALLERY
INSERT INTO public.gallery_images (image_url, caption, sort_order) VALUES
('https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1200','Sunrise over Ama Dablam',1),
('https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1200','Prayer flags at altitude',2),
('https://images.pexels.com/photos/3389536/pexels-photo-3389536.jpeg?auto=compress&cs=tinysrgb&w=1200','Sherpa porter on the trail',3),
('https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200','High camp under the stars',4),
('https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1200','Annapurna sanctuary',5),
('https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=1200','Glacial lake reflections',6),
('https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg?auto=compress&cs=tinysrgb&w=1200','Approach to base camp',7),
('https://images.pexels.com/photos/3389528/pexels-photo-3389528.jpeg?auto=compress&cs=tinysrgb&w=1200','Monastery in the clouds',8);
