-- =====================================================
-- COMPLETE SUPABASE SETUP FOR DREAM ADVENTURE NEPAL
-- Run this entire script in the Supabase SQL Editor
-- =====================================================

-- 1. ROLES & AUTH FUNCTIONS
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- 2. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read site_settings" ON public.site_settings;
CREATE POLICY "public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admins write site_settings" ON public.site_settings;
CREATE POLICY "admins write site_settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS trg_site_settings_updated ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 3. ADVENTURES
CREATE TABLE IF NOT EXISTS public.adventures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  long_description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'Moderate',
  price text NOT NULL DEFAULT '',
  category      text        NOT NULL DEFAULT 'Trek',
  sort_order    int         NOT NULL DEFAULT 0,
  is_published  boolean     NOT NULL DEFAULT true,
  itinerary     jsonb       NOT NULL DEFAULT '[]'::jsonb,
  map_embed_url text        NOT NULL DEFAULT '',
  includes      jsonb       NOT NULL DEFAULT '[]'::jsonb,
  excludes      jsonb       NOT NULL DEFAULT '[]'::jsonb,
  highlights    jsonb       NOT NULL DEFAULT '[]'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.adventures TO anon, authenticated;
GRANT ALL ON public.adventures TO authenticated;
GRANT ALL ON public.adventures TO service_role;
ALTER TABLE public.adventures ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read adventures" ON public.adventures;
CREATE POLICY "public read adventures" ON public.adventures FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "admins write adventures" ON public.adventures;
CREATE POLICY "admins write adventures" ON public.adventures FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS trg_adventures_updated ON public.adventures;
CREATE TRIGGER trg_adventures_updated BEFORE UPDATE ON public.adventures FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 4. TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
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
DROP POLICY IF EXISTS "public read testimonials" ON public.testimonials;
CREATE POLICY "public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "admins write testimonials" ON public.testimonials;
CREATE POLICY "admins write testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS trg_testimonials_updated ON public.testimonials;
CREATE TRIGGER trg_testimonials_updated BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 5. GALLERY
CREATE TABLE IF NOT EXISTS public.gallery_images (
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
DROP POLICY IF EXISTS "public read gallery" ON public.gallery_images;
CREATE POLICY "public read gallery" ON public.gallery_images FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "admins write gallery" ON public.gallery_images;
CREATE POLICY "admins write gallery" ON public.gallery_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. TEAM MEMBERS
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

-- 7. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adventure_id uuid NOT NULL REFERENCES public.adventures(id) ON DELETE CASCADE,
  adventure_title text NOT NULL DEFAULT '',
  adventure_slug text NOT NULL DEFAULT '',
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  start_date date NOT NULL,
  number_of_people int NOT NULL DEFAULT 1,
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  payment_method text NOT NULL DEFAULT 'pay_later' CHECK (payment_method IN ('online','pay_later','bank_transfer')),
  payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','partial','paid','refunded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.bookings TO authenticated;
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon insert bookings" ON public.bookings;
CREATE POLICY "anon insert bookings" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
DROP POLICY IF EXISTS "admins read bookings" ON public.bookings;
CREATE POLICY "admins read bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admins update bookings" ON public.bookings;
CREATE POLICY "admins update bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS trg_bookings_updated ON public.bookings;
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 8A. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  method text NOT NULL DEFAULT 'online' CHECK (method IN ('online','bank_transfer','cash','other')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  transaction_id text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
GRANT INSERT ON public.payments TO anon;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon insert payments" ON public.payments;
CREATE POLICY "anon insert payments" ON public.payments
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
DROP POLICY IF EXISTS "admins all payments" ON public.payments;
CREATE POLICY "admins all payments" ON public.payments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS trg_payments_updated ON public.payments;
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 8. PLACES (destinations / points of interest)
-- NOTE: New seed data appended in the bootstrap section below
CREATE TABLE IF NOT EXISTS public.places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  lat double precision,
  lng double precision,
  type text NOT NULL DEFAULT 'expedition' CHECK (type IN ('expedition','tour','trek')),
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.places TO anon, authenticated;
GRANT ALL ON public.places TO authenticated;
GRANT ALL ON public.places TO service_role;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon read places" ON public.places;
CREATE POLICY "anon read places" ON public.places FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admins all places" ON public.places;
CREATE POLICY "admins all places" ON public.places FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS trg_places_updated ON public.places;
CREATE TRIGGER trg_places_updated BEFORE UPDATE ON public.places FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 8B. ADVENTURE_PLACES (junction)
CREATE TABLE IF NOT EXISTS public.adventure_places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adventure_id uuid NOT NULL REFERENCES public.adventures(id) ON DELETE CASCADE,
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  day_number int NOT NULL DEFAULT 1,
  sort_order int NOT NULL DEFAULT 0,
  UNIQUE (adventure_id, place_id)
);
GRANT SELECT ON public.adventure_places TO anon, authenticated;
GRANT ALL ON public.adventure_places TO authenticated;
GRANT ALL ON public.adventure_places TO service_role;
ALTER TABLE public.adventure_places ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon read adventure_places" ON public.adventure_places;
CREATE POLICY "anon read adventure_places" ON public.adventure_places FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admins all adventure_places" ON public.adventure_places;
CREATE POLICY "admins all adventure_places" ON public.adventure_places FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 9. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_messages TO authenticated;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon insert contact_messages" ON public.contact_messages;
CREATE POLICY "anon insert contact_messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
DROP POLICY IF EXISTS "admins read contact_messages" ON public.contact_messages;
CREATE POLICY "admins read contact_messages" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admins update contact_messages" ON public.contact_messages;
CREATE POLICY "admins update contact_messages" ON public.contact_messages
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 8. GUIDES
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
CREATE POLICY "public read guides" ON public.guides FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "admins write guides" ON public.guides;
CREATE POLICY "admins write guides" ON public.guides FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS trg_guides_updated ON public.guides;
CREATE TRIGGER trg_guides_updated BEFORE UPDATE ON public.guides FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 8. PERMISSIONS (must be after all function creations)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated;

-- 8. BOOTSTRAP FIRST ADMIN POLICY
DROP POLICY IF EXISTS "bootstrap first admin" ON public.user_roles;
CREATE POLICY "bootstrap first admin" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND role = 'admin'
    AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
  );
GRANT INSERT ON public.user_roles TO authenticated;

-- =====================================================
-- SEED DATA
-- =====================================================

-- 9. SITE SETTINGS
INSERT INTO public.site_settings (key, value)
SELECT * FROM (VALUES
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
}'::jsonb)) AS v(key, value)
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

-- 10. ADVENTURES (comprehensive seed)
INSERT INTO public.adventures (title, slug, description, long_description, image_url, duration, difficulty, price, category, sort_order, itinerary, includes, excludes, highlights)
SELECT * FROM (VALUES
-- TREKS (6)
('Everest Base Camp Trek','everest-base-camp','Stand at the foot of the world''s highest mountain on this legendary 14-day trek through Sherpa heartland.','The Everest Base Camp Trek is the quintessential Himalayan adventure. Starting with a thrilling flight into Lukla, you''ll trek through pine forests, cross suspension bridges laden with prayer flags, and ascend through Sherpa villages to the iconic base camp at 5,364m. The journey offers world-class mountain views including Everest, Lhotse, Nuptse, and Ama Dablam. Acclimatisation days in Namche Bazaar and Dingboche help you adjust to the altitude while exploring monasteries, museums, and the famous Everest View Hotel. The final push to Kala Patthar at 5,545m delivers the closest accessible sunrise view of Everest — an experience that stays with you forever.','https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=1600','14 Days','Challenging','$1,499','Trek',1,
'[{"day":1,"title":"Arrive in Kathmandu","description":"Welcome to Nepal! Transfer to your hotel in Thamel. Evening briefing with your trek leader at 6 PM."},{"day":2,"title":"Fly to Lukla, Trek to Phakding","description":"Early morning flight to Lukla (2,845m). Begin trekking through pine forests to Phakding (2,610m). 3-4 hours walking."},{"day":3,"title":"Trek to Namche Bazaar","description":"Cross the famous Hillary Suspension Bridge and climb steadily to Namche Bazaar (3,440m), the Sherpa capital. 5-6 hours."},{"day":4,"title":"Acclimatisation in Namche","description":"Hike to Everest View Hotel for panoramic views. Visit the Sherpa Museum and local monasteries. Rest and hydrate."},{"day":5,"title":"Trek to Tengboche","description":"Follow the Dudh Koshi river through forests filled with rhododendrons to Tengboche (3,860m). Visit the famous monastery."},{"day":6,"title":"Trek to Dingboche","description":"Continue through alpine terrain to Dingboche (4,410m). Views of Ama Dablam grow closer with every step."},{"day":7,"title":"Acclimatisation in Dingboche","description":"Acclimatisation hike to Nagarjun Hill (5,100m) for views of Lhotse, Makalu, and Cho Oyu."},{"day":8,"title":"Trek to Lobuche","description":"Ascend to Lobuche (4,940m) through rocky terrain with stunning views of the Khumbu Glacier."},{"day":9,"title":"Trek to Gorak Shep, Visit EBC","description":"Reach Gorak Shep (5,164m), drop bags, then hike to Everest Base Camp (5,364m). Stand at the foot of the world''s highest peak!"},{"day":10,"title":"Kala Patthar Sunrise, Descend to Pheriche","description":"Pre-dawn hike to Kala Patthar (5,545m) for sunrise over Everest. Descend to Pheriche (4,371m)."},{"day":11,"title":"Trek to Namche Bazaar","description":"Descent through rhododendron forests back to Namche Bazaar. Celebrate with hot showers and bakery treats!"},{"day":12,"title":"Trek to Lukla","description":"Final day of trekking through familiar trails back to Lukla. Farewell dinner with the crew."},{"day":13,"title":"Fly to Kathmandu","description":"Morning flight back to Kathmandu. Free afternoon for souvenir shopping or rest."},{"day":14,"title":"Departure","description":"Airport transfer and farewell. Namaste, until we meet again!"}]'::jsonb,
'["All airport transfers in Kathmandu","Round-trip flights Kathmandu–Lukla","Twin-sharing teahouse accommodation","Three meals daily while trekking","Experienced English-speaking trek leader","Porter service (1 porter per 2 trekkers)","Duffel bag for trek","All trekking permits (TIMS + National Park)","First aid kit including pulse oximeter","Certificate of achievement"]'::jsonb,
'["International flights","Nepal visa fees","Travel insurance (mandatory, must cover helicopter evacuation)","Personal trekking equipment","Hot showers and charging fees on trail","Alcoholic beverages and soft drinks","Tips for guides and porters"]'::jsonb,
'["Fly into Lukla — the worlds most thrilling airport","Cross suspension bridges draped in prayer flags","Sunrise over Everest from Kala Patthar (5,545m)","Explore the Sherpa capital of Namche Bazaar","Visit Tengboche Monastery with Everest backdrop","Stand at Everest Base Camp (5,364m)"]'::jsonb),
('Annapurna Circuit','annapurna-circuit','A complete loop through diverse landscapes, ancient villages and the dramatic Thorong La pass at 5,416m.','The Annapurna Circuit is often ranked among the worlds best treks — and for good reason. This 16-day journey circles the entire Annapurna massif, taking you from subtropical valleys at 800m through pine forests, alpine meadows, and across the Thorong La Pass at 5,416m — the highest pass in Nepal. You''ll pass through traditional Gurung and Manangi villages, ancient monasteries, and natural hot springs. The diversity of landscapes is staggering: one morning you''re walking through a rhododendron forest, and three days later you''re crossing a high-altitude desert surrounded by 7,000m peaks. It''s a trek of epic proportions.','https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1600','16 Days','Moderate','$1,299','Trek',2,
'[{"day":1,"title":"Arrive in Kathmandu","description":"Arrival and transfer to hotel. Trip briefing and equipment check."},{"day":2,"title":"Drive to Jagat","description":"Scenic 8-hour drive from Kathmandu to Jagat (1,300m). Introductions to the local culture."},{"day":3,"title":"Trek to Dharapani","description":"Walk through terraced fields and forest to Dharapani (1,960m). First glimpses of Annapurna."},{"day":4,"title":"Trek to Chame","description":"Follow the Marsyangdi River through pine forests to Chame (2,670m). Hot springs nearby."},{"day":5,"title":"Trek to Upper Pisang","description":"Climb through forests with expanding views of Annapurna II to Upper Pisang (3,300m)."},{"day":6,"title":"Trek to Manang","description":"Cross the dramatic Paungda Danda rock face to reach Manang (3,519m)."},{"day":7,"title":"Acclimatisation in Manang","description":"Hike to Gangapurna Lake and Icefall (5,100m). Explore the old village and monastery."},{"day":8,"title":"Trek to Yak Kharka","description":"Ascend through alpine terrain to Yak Kharka (4,110m). Views of Annapurna III and Gangapurna."},{"day":9,"title":"Trek to Thorong Phedi","description":"Final ascent before the pass. Reach Thorong Phedi base camp (4,525m)."},{"day":10,"title":"Cross Thorong La Pass","description":"Early start. Cross Thorong La (5,416m) — the highest point. Descend to Muktinath (3,710m). Visit the sacred temple."},{"day":11,"title":"Trek to Kagbeni","description":"Walk through the arid Mustang landscape to Kagbeni (2,800m)."},{"day":12,"title":"Trek to Jomsom","description":"Easy walking along the Kali Gandaki gorge to Jomsom (2,743m). Apple brandy tasting!"},{"day":13,"title":"Fly to Pokhara","description":"Scenic flight to Pokhara. Free afternoon to relax by Phewa Lake."},{"day":14,"title":"Explore Pokhara","description":"Visit Devi''s Falls, Gupteshwor Cave, and the World Peace Pagoda. Optional paragliding."},{"day":15,"title":"Drive to Kathmandu","description":"Tourist bus back to Kathmandu. Farewell dinner in the evening."},{"day":16,"title":"Departure","description":"Transfer to airport. Safe travels!"}]'::jsonb,
'["All ground transport as per itinerary","Flight Jomsom–Pokhara","Teahouse accommodation","Three meals daily","English-speaking trek leader","Porter service","Annapurna Conservation Area permit","TIMS card","First aid kit"]'::jsonb,
'["International flights","Nepal visa","Travel insurance","Personal equipment","Hot showers","Alcohol and tips"]'::jsonb,
'["Cross Thorong La Pass (5,416m) — the highest trekking pass in Nepal","Experience six climate zones in two weeks","Visit the sacred Muktinath temple","Relax in natural hot springs at Chame","Explore the medieval village of Kagbeni","Fly out of Jomsom with Himalayan views"]'::jsonb),
('Upper Mustang Trek','upper-mustang','Walk into the forbidden kingdom — a desert-like plateau of ochre cliffs and Tibetan-era monasteries.','Upper Mustang is a land unlike anywhere else on Earth. Once a restricted kingdom closed to foreigners until 1992, this arid, windswept plateau north of the Annapurna range feels more like Tibet than Nepal. The landscape is a surreal mix of ochre cliffs, deep gorges, and whitewashed monasteries perched on impossibly dramatic ridges. The capital, Lo Manthang, is a walled city of earthen homes that has remained virtually unchanged for centuries. This trek offers a rare window into a culture that has preserved its Tibetan Buddhist traditions, language, and art for over 600 years.','https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1600','14 Days','Moderate','$2,199','Trek',3,
'[{"day":1,"title":"Arrive in Kathmandu","description":"Arrival and hotel check-in. Evening briefing about the Mustang region."},{"day":2,"title":"Fly to Pokhara","description":"Short flight to Pokhara. Scenic drive to the trailhead."},{"day":3,"title":"Drive to Kagbeni","description":"Drive through the Kali Gandaki gorge to Kagbeni, the gateway to Upper Mustang."},{"day":4,"title":"Trek to Chele","description":"Begin walking through dramatic red rock canyons to Chele (3,100m)."},{"day":5,"title":"Trek to Syangmoche","description":"Pass through traditional Tibetan villages with ancient chortens."},{"day":6,"title":"Trek to Ghami","description":"Cross a vast plateau with views of Nilgiri and Annapurna."},{"day":7,"title":"Trek to Charang","description":"Descend into the Charang Valley, visiting a 700-year-old monastery."},{"day":8,"title":"Trek to Lo Manthang","description":"Arrive at the walled capital of the Mustang Kingdom (3,840m)."},{"day":9,"title":"Explore Lo Manthang","description":"Full day exploring the royal palace, monasteries, and cave dwellings."},{"day":10,"title":"Trek to Dhakmar","description":"Walk through the most colorful landscapes of the entire trek."},{"day":11,"title":"Trek to Ghiling","description":"Descend through terraced fields and ancient irrigation systems."},{"day":12,"title":"Trek to Jomsom","description":"Final hiking day back to Jomsom. Celebration dinner."},{"day":13,"title":"Fly to Pokhara","description":"Scenic flight over the Annapurna range. Free afternoon."},{"day":14,"title":"Drive to Kathmandu","description":"Return to Kathmandu. Farewell dinner included."}]'::jsonb,
'["All domestic flights (Kathmandu–Pokhara, Pokhara–Jomsom, Jomsom–Pokhara)","Hotel in Kathmandu and Pokhara","Lodge/teahouse accommodation on trek","All meals on trek","Special Upper Mustang permit","Annapurna Conservation Area permit","English-speaking guide","Porter service","First aid kit and pulse oximeter"]'::jsonb,
'["International flights","Nepal visa","Travel insurance","Personal trekking gear","Hot showers","Alcoholic drinks","Tips"]'::jsonb,
'["Explore the walled city of Lo Manthang","Visit ancient Tibetan Buddhist monasteries","Walk through surreal red rock canyons","Experience a culture frozen in time","Photograph the dramatic ochre landscapes","Interact with the friendly Mustangi people"]'::jsonb),
('Manaslu Circuit Trek','manaslu-circuit','Remote, raw and uncrowded. Cross the Larkya La pass beneath the 8th highest peak on earth.','The Manaslu Circuit is rapidly becoming Nepal''s next great trek — offering the raw beauty of the Annapurna Circuit without the crowds. This 15-day journey circles Mount Manaslu (8,163m), the 8th highest mountain on Earth, through remote villages that have changed little in centuries. The trail passes through the Tsum Valley, a sacred hidden valley of Tibetan Buddhism, before crossing the formidable Larkya La Pass (5,106m) with its panoramic views of Manaslu, Himlung Himal, and Cheo Himal. This is a trek for those who seek genuine solitude and authentic Himalayan culture.','https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=1600','15 Days','Challenging','$1,699','Trek',4,
'[{"day":1,"title":"Arrive in Kathmandu","description":"Arrival and hotel transfer. Trip preparation and gear check."},{"day":2,"title":"Drive to Soti Khola","description":"8-hour drive from Kathmandu to Soti Khola (700m)."},{"day":3,"title":"Trek to Machha Khola","description":"Follow the Budhi Gandaki River through subtropical forests."},{"day":4,"title":"Trek to Jagat","description":"Enter the Manaslu Conservation Area. Traditional Gurung villages."},{"day":5,"title":"Trek to Deng","description":"Ascend through terraced fields and bamboo groves."},{"day":6,"title":"Trek to Namrung","description":"Views of Manaslu become more dramatic with every step."},{"day":7,"title":"Trek to Samagaon","description":"Enter the high alpine zone. Explore the base camp route."},{"day":8,"title":"Acclimatisation Day","description":"Hike to Manaslu Base Camp (4,800m). Visit the Pungyen Gompa monastery."},{"day":9,"title":"Trek to Samdo","description":"Continue to Samdo (3,875m), a traditional Tibetan trading post."},{"day":10,"title":"Trek to Larkya Phedi","description":"Final ascent to the pass base camp (4,460m)."},{"day":11,"title":"Cross Larkya La Pass","description":"Cross the high pass (5,106m) with incredible mountain panoramas. Descend to Bimthang."},{"day":12,"title":"Trek to Tilche","description":"Gradual descent through rhododendron and pine forests."},{"day":13,"title":"Trek to Dharapani","description":"Join the Annapurna Circuit trail for the final stretch."},{"day":14,"title":"Drive to Kathmandu","description":"Long scenic drive back to Kathmandu."},{"day":15,"title":"Departure","description":"Transfer to airport. End of service."}]'::jsonb,
'["Private ground transport","Teahouse accommodation","All meals on trek","English-speaking trek leader","Porter service","Manaslu Conservation Area permit","Restricted Area permit","TIMS card","First aid kit","Satellite phone (emergency use)"]'::jsonb,
'["International flights","Nepal visa","Travel insurance with helicopter evacuation","Personal camping/trekking gear","Hot showers","Alcohol and drinks","Tips"]'::jsonb,
'["Trek around the 8th highest mountain in the world","Cross Larkya La Pass (5,106m)","Explore ancient Tibetan Buddhist monasteries","Experience the untouched Tsum Valley","Wilderness camping in remote locations","Fewer trekkers — genuine solitude"]'::jsonb),
('Ghorepani Poon Hill Trek','poon-hill-trek','A short but spectacular trek through rhododendron forests with the best sunrise panorama in Nepal.','The Ghorepani Poon Hill trek is perfect for those with limited time but unlimited appetite for mountain views. In just 5 days, you''ll climb through some of Nepal''s most beautiful rhododendron forests to Poon Hill (3,210m), where the sunrise view takes in the entire Annapurna range — from Dhaulagiri in the west to Machhapuchhre in the east. The trail passes through traditional Gurung villages, past terraced fields, and through the Annapurna Conservation Area. This is the most accessible taste of the Nepalese Himalayas you can find.','https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1600','5 Days','Easy','$599','Trek',5,
'[{"day":1,"title":"Drive to Nayapul, Trek to Tikhedhunga","description":"Scenic drive from Pokhara to Nayapul. Begin trekking through terraced fields to Tikhedhunga (1,570m)."},{"day":2,"title":"Trek to Ghorepani","description":"Climb the famous 3,300 stone steps through rhododendron forest to Ghorepani (2,870m)."},{"day":3,"title":"Poon Hill Sunrise, Trek to Tadapani","description":"Pre-dawn hike to Poon Hill for stunning sunrise over the Annapurnas and Dhaulagiri. Trek through forest to Tadapani."},{"day":4,"title":"Trek to Ghandruk","description":"Descend through beautiful forests to the Gurung village of Ghandruk (1,940m)."},{"day":5,"title":"Trek to Nayapul, Drive to Pokhara","description":"Final descent to Nayapul. Drive back to Pokhara. Free afternoon."}]'::jsonb,
'["All ground transport","Teahouse accommodation","All meals on trek","English-speaking guide","Porter service","Annapurna Conservation Area permit","TIMS card","First aid kit"]'::jsonb,
'["International flights","Nepal visa","Travel insurance","Personal gear","Hot showers","Tips"]'::jsonb,
'["Witness the best sunrise panorama in the Himalayas","Walk through rhododendron forests in bloom","Visit the traditional Gurung village of Ghandruk","Perfect for short itineraries","Great introduction to Nepalese trekking"]'::jsonb),
('Langtang Valley Trek','langtang-valley','The closest high-altitude trek to Kathmandu through beautiful forests and sacred lakes.','The Langtang Valley is often called the "Valley of Glaciers" and offers some of the most accessible high-altitude trekking in Nepal. Just a 7-hour drive from Kathmandu, the trail leads through dense forests of bamboo and rhododendron, past cascading waterfalls, to the stunning Langtang Valley at 3,800m. The region was devastated by the 2015 earthquake, but the recovery has been remarkable — new lodges, rebuilt monasteries, and the famous Langtang cheese factory are all operating again. Highlights include the serene Kyanjin Gompa monastery, views of Langtang Lirung (7,227m), and the challenging climb to Tserko Ri for panoramic views.','https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1600','9 Days','Moderate','$899','Trek',6,
'[{"day":1,"title":"Arrive in Kathmandu","description":"Arrival and hotel transfer. Trek briefing."},{"day":2,"title":"Drive to Syabrubesi","description":"7-hour scenic drive through the Trisuli Valley to Syabrubesi (1,550m)."},{"day":3,"title":"Trek to Lama Hotel","description":"Walk through bamboo and rhododendron forests alongside the Langtang River."},{"day":4,"title":"Trek to Langtang Village","description":"Emerging from the forest into the beautiful Langtang Valley."},{"day":5,"title":"Trek to Kyanjin Gompa","description":"Continue to Kyanjin Gompa (3,800m). Visit the monastery and cheese factory."},{"day":6,"title":"Acclimatisation & Hike to Tserko Ri","description":"Hike to Tserko Ri (5,033m) for spectacular views. Optional visit to the Ice Wall."},{"day":7,"title":"Descend to Lama Hotel","description":"Begin descent back through the valley."},{"day":8,"title":"Trek to Syabrubesi","description":"Final day of trekking. Hot shower and celebration."},{"day":9,"title":"Drive to Kathmandu","description":"Return drive to Kathmandu. Farewell dinner."}]'::jsonb,
'["Private ground transport Kathmandu–Syabrubesi","Teahouse accommodation","All meals on trek","English-speaking guide","Porter service","Langtang National Park permit","TIMS card","First aid kit"]'::jsonb,
'["International flights","Nepal visa","Travel insurance","Personal gear","Hot showers","Tips"]'::jsonb,
'["Explore the beautiful Langtang Valley","Visit the famous Kyanjin Gompa monastery","Sample local Langtang cheese","Climb Tserko Ri (5,033m)","Close to Kathmandu — minimal travel time","Remarkable post-earthquake recovery story"]'::jsonb),

-- EXPEDITIONS (5)
('Island Peak Climb','island-peak','A perfect introduction to Himalayan mountaineering at 6,189m, with full technical support.','Island Peak (Imja Tse) at 6,189m is widely regarded as the best introductory climbing peak in Nepal. Its name comes from its appearance from Dingboche — a solitary peak rising from the surrounding glacier like an island in a sea of ice. This 18-day expedition combines the Everest Base Camp trek with a technically challenging summit climb. You''ll receive comprehensive training in rope techniques, ice axe use, and crevasse rescue before making your summit bid. The final climb involves a steep snow slope, a thrilling ridge walk, and a breathtaking view from the summit that takes in Everest, Lhotse, Makalu, and the whole Khumbu region.','https://images.pexels.com/photos/839462/pexels-photo-839462.jpeg?auto=compress&cs=tinysrgb&w=1600','18 Days','Expert','$2,899','Expedition',7,
'[{"day":1,"title":"Arrive in Kathmandu","description":"Arrival at Tribhuvan International Airport. Transfer to hotel in Thamel. Evening expedition briefing with your climbing leader."},{"day":2,"title":"Equipment Check & Prep","description":"Full equipment check at the expedition office. Rent or buy any missing gear. Explore Kathmandu."},{"day":3,"title":"Fly to Lukla, Trek to Phakding","description":"Early flight to Lukla. Begin trekking to Phakding (2,610m)."},{"day":4,"title":"Trek to Namche Bazaar","description":"Climb to Namche Bazaar (3,440m) — the Sherpa capital and your last chance for quality gear."},{"day":5,"title":"Acclimatisation in Namche","description":"Hike to Everest View Hotel for sunrise. Visit the Sherpa Museum."},{"day":6,"title":"Trek to Tengboche","description":"Trek through forests to Tengboche (3,860m). Visit the famous monastery."},{"day":7,"title":"Trek to Dingboche","description":"Continue to Dingboche (4,410m). Views of Ama Dablam and Lhotse."},{"day":8,"title":"Acclimatisation in Dingboche","description":"Acclimatisation hike to 5,100m. Technical training on the glacier."},{"day":9,"title":"Trek to Chhukung","description":"Short walk to Chhukung (4,730m) — the base for Island Peak climbing preparation."},{"day":10,"title":"Training Day","description":"Full day of technical training: rope skills, ice axe arrest, crevasse rescue on a nearby glacier."},{"day":11,"title":"Trek to Island Peak Base Camp","description":"Gentle climb to base camp (5,200m). Set up camp. Summit briefing."},{"day":12,"title":"Summit Push!","description":"Early start. Climb through the steep headwall to the summit ridge. Reach the top at 6,189m! Descend back to base camp."},{"day":13,"title":"Contingency / Reserve Day","description":"Weather reserve day. Extra day for summit attempt if needed."},{"day":14,"title":"Descend to Pangboche","description":"Trek back down to Pangboche village (3,985m). Hot shower and celebration."},{"day":15,"title":"Trek to Namche Bazaar","description":"Descent through rhododendron forests back to Namche."},{"day":16,"title":"Trek to Lukla","description":"Final day of walking. Farewell dinner with the team."},{"day":17,"title":"Fly to Kathmandu","description":"Morning flight back to Kathmandu. Free afternoon. Farewell dinner."},{"day":18,"title":"Departure","description":"Airport transfer. End of service."}]'::jsonb,
'["Airport transfers in Kathmandu","Flight Kathmandu–Lukla–Kathmandu","Hotel in Kathmandu (3 nights BB)","Expert climbing Sherpa (1:1 ratio)","All meals on trek and at base camp","Group climbing equipment (ropes, ice screws, etc.)","Personal climbing gear (crampons, harness, ice axe)","Island Peak climbing permit","TIMS card and National Park fees","Satellite phone and VHF radio","Emergency oxygen","Certificate of ascent"]'::jsonb,
'["International flights","Nepal visa","Travel insurance with helicopter evacuation","Personal clothing and boots","Alcoholic drinks","Tips for climbing crew","Excess baggage on Lukla flight"]'::jsonb,
'["Stand on top of a 6,189m Himalayan peak","Panoramic views of Everest, Lhotse, Makalu and Ama Dablam","Learn technical mountaineering skills","Trek through the legendary Khumbu region","Experience high-altitude camping","Achieve a genuine mountaineering milestone"]'::jsonb),
('Mera Peak Climb','mera-peak','Nepal''s highest permitted trekking peak at 6,476m with panoramic views of five 8,000m giants.','Mera Peak is the highest of Nepal''s "trekking peaks" and offers one of the most spectacular summit panoramas in the Himalayas. At 6,476m, the summit provides an unobstructed view of five 8,000m peaks — Everest, Kanchenjunga, Lhotse, Makalu, and Cho Oyu — plus dozens of other Himalayan giants. The climb is technically moderate (mainly snow and glacier walking with some steeper sections), making it an excellent first 6,000m peak. The approach through the remote Hinku Valley is a wilderness experience in itself, passing through beautiful forests, alpine meadows, and alongside the stunning Amphu Lapcha pass.','https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg?auto=compress&cs=tinysrgb&w=1600','21 Days','Expert','$3,499','Expedition',8,
'[{"day":1,"title":"Arrive in Kathmandu","description":"Arrival. Hotel transfer. Expedition briefing."},{"day":2,"title":"Fly to Lukla","description":"Flight to Lukla. Prepare for the trek ahead."},{"day":3,"title":"Trek to Chhuthawa","description":"Begin the approach through the remote Hinku Valley."},{"day":4,"title":"Trek to Kothe","description":"Walk through rhododendron and pine forests."},{"day":5,"title":"Trek to Thagnak","description":"Enter alpine terrain with views of Mera Peak."},{"day":6,"title":"Trek to Khare","description":"Arrive at Khare (5,000m) — base camp for Mera Peak."},{"day":7,"title":"Acclimatisation & Training","description":"Technical training on crevasse rescue and rope work."},{"day":8,"title":"Trek to Mera High Camp","description":"Climb to high camp (5,800m). Prepare for summit."},{"day":9,"title":"Summit Mera Peak","description":"Early summit attempt. Return to Khare."},{"day":10,"title":"Reserve / Contingency Day","description":"Extra day for weather or rest."},{"day":11,"title":"Trek to Kothe","description":"Begin descent back through the valley."},{"day":12,"title":"Trek to Lukla","description":"Final day of trekking. Celebration dinner."},{"day":13,"title":"Fly to Kathmandu","description":"Flight back to Kathmandu. Farewell dinner."}]'::jsonb,
'["Airport transfers","Domestic flights","Hotel in Kathmandu","Expert climbing Sherpa (1:1)","All meals on trek and expedition","Group climbing gear","Mera Peak climbing permit","National Park permits","Satellite communication","Emergency oxygen","Summit certificate"]'::jsonb,
'["International flights","Nepal visa","Travel insurance","Personal clothing","Tips","Alcoholic drinks"]'::jsonb,
'["Climb the highest trekking peak in Nepal","Unobstructed views of 5 eight-thousanders","Experience true high-altitude mountaineering","Remote wilderness through the Hinku Valley","Perfect progression peak for Everest aspirations","Panoramic summit views of the entire Himalaya"]'::jsonb),
('Ama Dablam Expedition','ama-dablam','The most technically beautiful peak in the Himalayas — a true mountaineering challenge at 6,812m.','Ama Dablam (6,812m) is widely regarded as the most beautiful mountain in the Himalayas. Its name means "Mother''s Necklace" — a reference to the hanging glacier that drapes across its southwest face like a traditional pendant. This is a serious technical expedition requiring previous mountaineering experience. The climb involves steep ice and mixed terrain, exposed ridgelines, and sections of vertical ice climbing. The summit ridge is knife-edged with staggering drops on either side. But for those who succeed, the view from the top — with Everest, Lhotse, and Makalu arrayed before you — is the finest in the Khumbu.','https://images.pexels.com/photos/1266312/pexels-photo-1266312.jpeg?auto=compress&cs=tinysrgb&w=1600','24 Days','Expert','$5,999','Expedition',9,
'[{"day":1,"title":"Arrive in Kathmandu","description":"Arrival and expedition briefing."},{"day":2,"title":"Expedition Prep in Kathmandu","description":"Full gear check. Final permits and logistics."},{"day":3,"title":"Fly to Lukla","description":"Flight to Lukla. Begin trekking to Phakding."},{"day":4,"title":"Trek to Namche Bazaar","description":"Climb to Namche Bazaar."},{"day":5,"title":"Acclimatisation","description":"Rest day in Namche."},{"day":6,"title":"Trek to Tengboche","description":"Walk to Tengboche. Visit the monastery."},{"day":7,"title":"Trek to Ama Dablam Base Camp","description":"Arrive at base camp (4,600m). Set up camp."},{"day":8,"title":"Puja Ceremony","description":"Traditional Buddhist puja ceremony blessing the expedition."},{"day":9,"title":"Load Carry to Camp 1","description":"Establish Camp 1 (5,400m)."},{"day":10,"title":"Rest at Base Camp","description":"Rest and preparation day."},{"day":11,"title":"Move to Camp 1","description":"Move to Camp 1. Overnight."},{"day":12,"title":"Establish Camp 2","description":"Fix ropes to Camp 2 (5,900m)."},{"day":13,"title":"Rest at Base Camp","description":"Descend to rest."},{"day":14,"title":"Move to Camp 1","description":"Move back to Camp 1."},{"day":15,"title":"Move to Camp 2","description":"Move to Camp 2."},{"day":16,"title":"Summit Bid","description":"Early summit attempt. Return to Camp 2."},{"day":17,"title":"Reserve Day","description":"Extra summit day if needed."},{"day":18,"title":"Descend to Base Camp","description":"Packed and descend."},{"day":19,"title":"Trek to Namche","description":"Begin return trek."},{"day":20,"title":"Trek to Lukla","description":"Return to Lukla."},{"day":21,"title":"Fly to Kathmandu","description":"Return to Kathmandu."}]'::jsonb,
'["All airport transfers","Domestic flights","Hotel in Kathmandu","Expert climbing Sherpa (1:1)","High-quality tent and camp equipment","All meals on expedition","Group climbing gear (ropes, ice screws, etc.)","Ama Dablam climbing permit","Satellite phone and internet","Emergency oxygen and mask","Summit certificate"]'::jsonb,
'["International flights","Nepal visa","Travel insurance","Personal climbing equipment","Tips","Alcoholic drinks","Personal medical kit"]'::jsonb,
'["Climb the most beautiful mountain in the Himalayas","Technical ice and mixed climbing","Panoramic views of Everest, Lhotse and Makalu","Experience world-class alpine mountaineering","Traditional puja ceremony at base camp","Lifetime achievement summit"]'::jsonb),
('Lobuche Peak Climb','lobuche-peak','A stunning 6,119m peak in the Everest region, perfect training for higher expeditions.','Lobuche Peak (6,119m) is one of the most accessible 6,000m climbing peaks in the Everest region. Located near the famous Everest Base Camp trail, it offers a superb mountaineering experience with a relatively short summit day. The climb involves walking on glaciers, some steep snow slopes, and a final ridge to the summit. From the top, the views are staggering: Everest, Nuptse, Lhotse, Pumori, and Ama Dablam all laid out in a 360-degree panorama. This expedition is ideal as a standalone climb or as preparation for higher objectives like Island Peak or Ama Dablam.','https://images.pexels.com/photos/1268853/pexels-photo-1268853.jpeg?auto=compress&cs=tinysrgb&w=1600','17 Days','Challenging','$2,499','Expedition',10,
'[{"day":1,"title":"Arrive in Kathmandu","description":"Arrival and hotel transfer."},{"day":2,"title":"Fly to Lukla, Trek to Phakding","description":"Flight to Lukla. Begin trekking."},{"day":3,"title":"Trek to Namche","description":"Climb to Namche Bazaar."},{"day":4,"title":"Acclimatisation","description":"Rest and acclimatise in Namche."},{"day":5,"title":"Trek to Tengboche","description":"Trek through forests to Tengboche monastery."},{"day":6,"title":"Trek to Dingboche","description":"Continue to Dingboche."},{"day":7,"title":"Acclimatisation in Dingboche","description":"Rest day with acclimatisation hike."},{"day":8,"title":"Trek to Lobuche Base Camp","description":"Arrive at Lobuche Base Camp (4,900m)."},{"day":9,"title":"Training & Preparation","description":"Technical training and briefing."},{"day":10,"title":"Move to High Camp","description":"Climb to high camp (5,400m)."},{"day":11,"title":"Summit Lobuche Peak","description":"Summit attempt. Descend to base camp."},{"day":12,"title":"Reserve Day","description":"Extra day for summit attempt."},{"day":13,"title":"Descend to Pangboche","description":"Begin return journey."},{"day":14,"title":"Trek to Namche","description":"Descend through forests."},{"day":15,"title":"Trek to Lukla","description":"Return to Lukla."},{"day":16,"title":"Fly to Kathmandu","description":"Return flight."},{"day":17,"title":"Departure","description":"Airport transfer."}]'::jsonb,
'["Airport transfers","Domestic flights","Hotel in Kathmandu","Climbing Sherpa","All meals","Group climbing gear","Lobuche climbing permit","National Park permit","Satellite phone","Emergency oxygen"]'::jsonb,
'["International flights","Nepal visa","Travel insurance","Personal gear","Tips","Alcohol"]'::jsonb,
'["Climb a genuine 6,119m Himalayan peak","360-degree Everest panorama from summit","Technical glacier and snow climbing","Excellent preparation for higher peaks","Located on the classic EBC trekking route","Supportive climbing Sherpa team"]'::jsonb),
('Dhampus Peak Climb','dhampus-peak','A remote 6,012m peak in the Dhaulagiri region with few climbers and pristine routes.','Dhampus Peak (6,012m) is one of Nepal''s hidden mountaineering gems. Located in the remote Dhaulagiri region near the French Pass, it sees far fewer climbers than the peaks of the Khumbu. The approach crosses the breathtaking Dhaulagiri base camp and the French Pass (5,360m) before reaching the peak. The climbing involves glacier travel, steep snow slopes, and a spectacular summit ridge. From the top, the view of the entire Dhaulagiri massif and the Annapurna range is absolutely unparalleled. This is the perfect expedition for climbers seeking solitude and pristine mountain wilderness.','https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1600','19 Days','Expert','$2,799','Expedition',11,
'[{"day":1,"title":"Arrive in Kathmandu","description":"Arrival and briefing."},{"day":2,"title":"Drive to Beni","description":"Scenic drive to the trailhead."},{"day":3,"title":"Trek to Dharapani","description":"Begin the approach trek."},{"day":4,"title":"Trek to Muri","description":"Walk through traditional villages."},{"day":5,"title":"Trek to Boghara","description":"Enter alpine terrain."},{"day":6,"title":"Trek to Dobang","description":"Continue through forests."},{"day":7,"title":"Trek to Sallaghari","description":"Views of Dhaulagiri appear."},{"day":8,"title":"Arrive at Dhaulagiri Base Camp","description":"Set up base camp at 4,700m."},{"day":9,"title":"Rest & Prep","description":"Acclimatisation and training."},{"day":10,"title":"Trek to French Pass","description":"Cross the French Pass (5,360m)."},{"day":11,"title":"Set Up Advanced Base Camp","description":"Establish ABC at 5,100m."},{"day":12,"title":"Summit Dhampus Peak","description":"Early summit bid on Dhampus Peak."},{"day":13,"title":"Reserve Day","description":"Extra summit day."},{"day":14,"title":"Descend to Dhaulagiri Base Camp","description":"Return to base camp."},{"day":15,"title":"Trek to Muri","description":"Begin descent."},{"day":16,"title":"Trek to Beni","description":"Return to the roadhead."},{"day":17,"title":"Drive to Pokhara","description":"Scenic drive to Pokhara."},{"day":18,"title":"Drive to Kathmandu","description":"Return to Kathmandu."},{"day":19,"title":"Departure","description":"Airport transfer."}]'::jsonb,
'["All ground transport","Hotel in Kathmandu","Tented camp on trek","All meals","Climbing Sherpa","Group equipment","Dhampus Peak permit","TIMS card","Dhaulagiri Conservation Area permit","Satellite phone"]'::jsonb,
'["International flights","Nepal visa","Travel insurance","Personal equipment","Tips","Alcohol"]'::jsonb,
'["Climb a pristine 6,012m peak","Explore the remote Dhaulagiri region","Cross the dramatic French Pass","Almost no other climbers — true solitude","Views of the entire Dhaulagiri massif","Wilderness expedition experience"]'::jsonb),

-- TOURS (5)
('Nagarkot Sunrise & Heritage Tour','nagarkot-sunrise','Watch the sun rise over the Himalayas from Nagarkot, then explore the medieval cities of the Kathmandu Valley.','This one-day tour combines the best of two worlds: sunrise over the Himalayas from the scenic hill station of Nagarkot, followed by a deep dive into the UNESCO World Heritage Sites of the Kathmandu Valley. You''ll be picked up early from your hotel and driven to Nagarkot (2,175m) where, on a clear day, you can see the entire Himalayan arc from Everest in the east to Annapurna in the west. After breakfast with a view, you''ll visit Bhaktapur Durbar Square — the best-preserved medieval city in Nepal — and continue through the valley''s other cultural treasures.','https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1600','1 Day','Easy','$89','Tour',12,
'[{"day":1,"title":"Nagarkot Sunrise & Valley Heritage","description":"4 AM pickup from hotel. Drive to Nagarkot (1 hr) for sunrise over the Himalayas. Breakfast at the viewpoint. Visit Bhaktapur Durbar Square, then continue to Bodhnath Stupa and Pashupatinath Temple. Return to hotel by 3 PM."}]'::jsonb,
'["Hotel pickup and drop-off","Private air-conditioned vehicle","English-speaking tour guide","Breakfast at Nagarkot viewpoint","All entry fees to heritage sites","Bottled water"]'::jsonb,
'["Personal expenses","Lunch","Tips for guide and driver"]'::jsonb,
'["Sunrise over the Himalayas from Nagarkot","Explore Bhaktapur Durbar Square (UNESCO)","Visit the sacred Boudhanath Stupa","Experience Pashupatinath Temple","All in one comfortable day trip"]'::jsonb),
('Kathmandu Valley World Heritage Tour','kathmandu-heritage-tour','Explore seven UNESCO World Heritage Sites in the Kathmandu Valley in two unforgettable days.','The Kathmandu Valley is home to seven UNESCO World Heritage Sites, each a masterpiece of art, architecture, and spirituality. This two-day tour takes you to every one of them, from the ancient durbar squares of Kathmandu, Patan, and Bhaktapur to the sacred religious sites of Swayambhunath, Boudhanath, Pashupatinath, and Changu Narayan. You''ll be guided by a licensed cultural expert who will bring the history, mythology, and living traditions of each site to life. This is the most comprehensive cultural tour of the valley available.','https://images.pexels.com/photos/3389536/pexels-photo-3389536.jpeg?auto=compress&cs=tinysrgb&w=1600','2 Days','Easy','$229','Tour',13,
'[{"day":1,"title":"Patan, Boudhanath & Pashupatinath","description":"Morning: Patan Durbar Square (UNESCO) — explore the ancient royal palace and Golden Temple. Afternoon: Boudhanath Stupa (UNESCO) — the largest stupa in Nepal. Evening: Pashupatinath Temple (UNESCO) — observe evening aarti ceremony on the Bagmati River."},{"day":2,"title":"Swayambhunath, Kathmandu Durbar Square & Bhaktapur","description":"Pre-dawn: Swayambhunath Stupa (UNESCO) — sunrise over the valley. Mid-morning: Kathmandu Durbar Square (UNESCO) — visit the Living Goddess Kumari. Afternoon: Bhaktapur Durbar Square (UNESCO) — explore the 55 Window Palace. Late: Changu Narayan Temple (UNESCO) — the oldest temple in Nepal."}]'::jsonb,
'["Hotel pickup and drop-off","Private transport","Licensed cultural guide","All UNESCO site entry fees","Breakfast on Day 2","Bottled water"]'::jsonb,
'["Lunches and dinners","Personal expenses","Tips","Hotel accommodation"]'::jsonb,
'["Visit all 7 UNESCO World Heritage Sites in the valley","Watch the evening aarti at Pashupatinath","Meet the Living Goddess Kumari","See sunrise from Swayambhunath","Expert cultural guide throughout"]'::jsonb),
('Pokhara Adventure & Relaxation','pokhara-adventure','Paraglide over Phewa Lake, explore mysterious caves, and relax in Nepal''s adventure capital.','Pokhara is Nepal''s undisputed adventure capital — a beautiful lakeside city nestled beneath the Annapurna range. This 3-day tour packs in the best experiences: paragliding over Phewa Lake with views of Machhapuchhre, exploring the mysterious Gupteshwor Cave and Devi''s Falls, watching sunrise from Sarangkot, and enjoying the laid-back lakeside atmosphere. You''ll also visit the World Peace Pagoda for a panoramic view of the city, mountains, and lake. With the right mix of adventure, nature, and relaxation, this is the perfect escape from Kathmandu.','https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1600','3 Days','Easy','$349','Tour',14,
'[{"day":1,"title":"Drive to Pokhara & Lakeside Evening","description":"Scenic 6-hour drive or 25-minute flight from Kathmandu to Pokhara. Check into your lakeside hotel. Evening stroll along Phewa Lake. Optional kayaking. Dinner at a lakeside restaurant."},{"day":2,"title":"Sarangkot Sunrise & Paragliding","description":"Pre-dawn drive to Sarangkot (1,592m) for sunrise over the Annapurna range. After breakfast: paragliding over the lake (optional). Afternoon: visit Devi''s Falls, Gupteshwor Cave, and the International Mountain Museum."},{"day":3,"title":"World Peace Pagoda & Return","description":"Morning hike to the World Peace Pagoda for panoramic views. Visit a Tibetan refugee camp. Afternoon drive or flight back to Kathmandu."}]'::jsonb,
'["Hotel pickup and drop-off","Round-trip tourist bus (or optional flight)","2 nights hotel in Pokhara (BB basis)","English-speaking guide","Sarangkot sunrise transfer","All entry fees as per itinerary","Bottled water"]'::jsonb,
'["Paragliding (optional — $99 extra)","Meals except breakfast","Personal expenses","Tips"]'::jsonb,
'["Paraglide over Phewa Lake with Himalayan views","Watch sunrise from Sarangkot","Explore Devi''s Falls and Gupteshwor Cave","Hike to the World Peace Pagoda","Relax by the lakeside"]'::jsonb),
('Chitwan Safari & Jungle Adventure','chitwan-safari','Track rhinos on elephant-back, canoe alongside crocodiles, and explore Nepal''s premier national park.','Chitwan National Park — a UNESCO World Heritage Site — is Nepal''s most famous wildlife reserve, home to Bengal tigers, one-horned rhinoceros, Asian elephants, leopards, sloth bears, and over 500 species of birds. This 3-day safari takes you deep into the jungle with expert naturalist guides. You''ll explore on elephant-back, in dugout canoes, and on foot. You''ll visit the elephant breeding center, learn about Tharu village culture, and spend evenings around the campfire listening to the sounds of the jungle. It''s a completely different side of Nepal — hot, humid, lowland, and teeming with life.','https://images.pexels.com/photos/2433970/pexels-photo-2433970.jpeg?auto=compress&cs=tinysrgb&w=1600','3 Days','Easy','$399','Tour',15,
'[{"day":1,"title":"Drive to Chitwan & Tharu Village","description":"5-hour drive from Kathmandu to Chitwan. Check into jungle lodge. Afternoon: visit a traditional Tharu village and learn about the local culture. Evening: Tharu cultural dance performance."},{"day":2,"title":"Jungle Safari & Canoeing","description":"Early morning: elephant-back safari into the deep jungle. Search for rhinos, deer, and tigers. Afternoon: dugout canoe ride along the Rapti River — watch for crocodiles and birds. Evening: nature walk with naturalist guide."},{"day":3,"title":"Birdwatching & Return","description":"Early morning birdwatching walk with expert naturalist. Visit the elephant breeding center. Afternoon drive back to Kathmandu."}]'::jsonb,
'["Hotel pickup and drop-off","Round-trip private transport","2 nights jungle lodge (full board)","English-speaking naturalist guide","Elephant-back safari (1 hr)","Dugout canoe ride","Birdwatching walk","Tharu cultural program","Chitwan National Park entry fee"]'::jsonb,
'["Visa and international flights","Travel insurance","Personal expenses","Tips","Alcoholic drinks"]'::jsonb,
'["Track one-horned rhinos on elephant-back","Canoe alongside crocodiles","Search for the elusive Bengal tiger","Explore the jungle with expert naturalists","Experience Tharu village culture"]'::jsonb),
('Everest Scenic Helicopter Tour','everest-heli','Breakfast at Everest View Hotel — the most spectacular helicopter flight on Earth.','The Everest Helicopter Tour is the ultimate bucket-list experience. In just a few hours, you''ll fly from Kathmandu into the heart of the Khumbu, weaving between Himalayan giants like a bird. The flight path takes you over terraced hills, past steep valleys, and directly toward the Everest massif. You''ll land at the famous Everest View Hotel (3,962m) for champagne breakfast with the entire Himalayan range laid out before you. This isn''t just a helicopter ride — it''s the most efficient and unforgettable way to experience the world''s highest mountains without weeks of trekking.','https://images.pexels.com/photos/2724664/pexels-photo-2724664.jpeg?auto=compress&cs=tinysrgb&w=1600','1 Day','Easy','$1,099','Tour',16,
'[{"day":1,"title":"Everest Helicopter Tour","description":"5:30 AM: Hotel pickup. Transfer to the domestic airport terminal. 6:00 AM: Safety briefing and boarding. 6:30 AM: Takeoff. Flight path: Kathmandu → Lukla → Namche → Tengboche → Kala Patthar (circling Everest)! 8:00 AM: Landing at Everest View Hotel for champagne breakfast. 8:45 AM: Return flight via the same breathtaking route. 10:00 AM: Arrive back in Kathmandu. 10:30 AM: Return to hotel. Rest of day free to explore."}]'::jsonb,
'["Hotel pickup and drop-off","Helicopter with experienced pilots","Champagne breakfast at Everest View Hotel","Safety briefing and equipment","All landing and airport fees","Certificate of flight"]'::jsonb,
'["Personal expenses","Travel insurance","Tips for pilot and crew","Meals other than breakfast"]'::jsonb,
'["Fly alongside Mount Everest itself","Land at the highest hotel on Earth","Champagne breakfast at 3,962m","Complete experience in half a day","Unmatched aerial photography opportunities","The ultimate bucket-list experience"]'::jsonb)) AS v(title, slug, description, long_description, image_url, duration, difficulty, price, category, sort_order, itinerary, includes, excludes, highlights)
WHERE NOT EXISTS (SELECT 1 FROM public.adventures);

-- 11. TESTIMONIALS
INSERT INTO public.testimonials (name, country, avatar_url, review, rating, sort_order)
SELECT * FROM (VALUES
('Sarah Mitchell','United Kingdom','https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400','The most thoughtfully organised trek I''ve ever done. Our guide Dawa felt like family by the end of week two.',5,1),
('Lukas Bauer','Germany','https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400','From the airport pickup to the summit of Island Peak — every single detail was handled. Truly world class.',5,2),
('Aiko Tanaka','Japan','https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400','Mustang felt like a different planet. I cannot recommend Dream Adventure Nepal enough for serious travellers.',5,3),
('James O''Connor','Australia','https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400','The heli tour was a bucket-list moment. Punctual, professional and unforgettable views.',5,4)) AS v(name, country, avatar_url, review, rating, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials);

-- 12. GALLERY
INSERT INTO public.gallery_images (image_url, caption, sort_order)
SELECT * FROM (VALUES
('https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1200','Sunrise over Ama Dablam',1),
('https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1200','Prayer flags at altitude',2),
('https://images.pexels.com/photos/3389536/pexels-photo-3389536.jpeg?auto=compress&cs=tinysrgb&w=1200','Sherpa porter on the trail',3),
('https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200','High camp under the stars',4),
('https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1200','Annapurna sanctuary',5),
('https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg?auto=compress&cs=tinysrgb&w=1200','Glacial lake reflections',6),
('https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg?auto=compress&cs=tinysrgb&w=1200','Approach to base camp',7),
('https://images.pexels.com/photos/3389528/pexels-photo-3389528.jpeg?auto=compress&cs=tinysrgb&w=1200','Monastery in the clouds',8)) AS v(image_url, caption, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_images);

-- 13. TEAM MEMBERS
INSERT INTO public.team_members (name, role, bio, avatar_url, sort_order)
SELECT * FROM (VALUES
('Dawa Sherpa','Lead Guide & Founder','With over 20 years of experience in the Himalayas, Dawa has led expeditions across all major peaks and treks in Nepal.','https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',1),
('Mingma Tamang','Senior Trek Leader','Mingma has been guiding treks since 2008 and knows the Annapurna and Everest regions like the back of his hand.','https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',2),
('Pema Lama','Operations Manager','Pema ensures every trip runs smoothly behind the scenes — from permits to porters to accommodation.','https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',3),
('Nima Gurung','Heli Tour Specialist','Nima coordinates all helicopter operations and ensures safe, timely flights for our heli tour guests.','https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400',4)) AS v(name, role, bio, avatar_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.team_members);

-- 14. GUIDES
INSERT INTO public.guides (name, speciality, avatar_url, sort_order)
SELECT * FROM (VALUES
('Pasang Sherpa','Everest Region Expert','https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',1),
('Tenzing Bhote','Annapurna & Mustang Specialist','https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',2),
('Karma Lama','Technical Climbing Instructor','https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',3),
('Phurba Tamang','Cultural Tour Guide','https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400',4)) AS v(name, speciality, avatar_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.guides);

-- 15. PLACES (destinations)
INSERT INTO public.places (name, description, image_url, type, sort_order)
SELECT * FROM (VALUES
-- Expedition places
('Everest Base Camp','The legendary base camp at 5,364m at the foot of the world''s highest peak. The trek to Everest Base Camp is one of the most iconic adventures on Earth.','','expedition',1),
('Kala Patthar','At 5,545m, Kala Patthar offers the closest accessible viewpoint of Mount Everest. The sunrise view here is unforgettable.','','expedition',2),
('Khumbu Icefall','A chaotic cascade of towering ice seracs at the head of the Khumbu Glacier. One of the most technical sections of the Everest climb.','','expedition',3),
('Gorak Shep','The last settlement before Everest Base Camp at 5,164m. A small frozen lake and the final overnight stop for trekkers.','','expedition',4),
('Namche Bazaar','The bustling Sherpa capital at 3,440m. A vibrant market town with stunning Himalayan views, bakeries, and trekking gear shops.','','expedition',5),
('Annapurna Base Camp','At 4,130m, this amphitheater-like base camp is surrounded by a 360-degree panorama of Annapurna massif peaks.','','expedition',6),
('Poon Hill','The classic sunrise viewpoint at 3,210m offering breathtaking views of Dhaulagiri, Annapurna, and Machhapuchhre.','','expedition',7),
('Thorong La Pass','At 5,416m, this is the highest pass on the Annapurna Circuit and one of the most challenging and rewarding crossings in Nepal.','','expedition',8),
('Lukla Airport','The most thrilling airport in the world — a steep airstrip carved into the mountainside, gateway to the Everest region.','','expedition',9),
('Chhukung Valley','A high-altitude valley at 4,730m used as the staging area for Island Peak and other climbing expeditions.','','expedition',10),
('Mera Peak Summit','At 6,476m, the highest trekking peak in Nepal offering panoramic views of five 8,000m peaks.','','expedition',11),
('Ama Dablam Base Camp','The base camp for climbing one of the most beautiful mountains in the world at 4,600m.','','expedition',12),
-- Tour places
('Nagarkot','A scenic hill station 32km from Kathmandu famous for sunrise views over the Himalayas including Mount Everest on clear days.','','tour',1),
('Bhaktapur Durbar Square','A UNESCO World Heritage Site with stunning medieval architecture, ancient palaces, and the famous 55 Window Palace.','','tour',2),
('Kathmandu Durbar Square','The historic heart of Kathmandu with ancient temples, palaces, and courtyards dating back to the Malla period.','','tour',3),
('Swayambhunath Stupa','Known as the Monkey Temple, this ancient religious complex atop a hill offers panoramic views of the Kathmandu Valley.','','tour',4),
('Pashupatinath Temple','One of the holiest Hindu temples dedicated to Lord Shiva, located on the banks of the Bagmati River.','','tour',5),
('Boudhanath Stupa','One of the largest spherical stupas in Nepal and a UNESCO World Heritage Site, a center of Tibetan Buddhism.','','tour',6),
('Patan Durbar Square','A UNESCO site featuring exquisite Newari architecture, ancient temples, and the Patan Museum.','','tour',7),
('Chandragiri Hill','A hilltop with a cable car ride offering panoramic Himalayan views and a historic Bhaleshwar Temple.','','tour',8),
('Phewa Lake','The enchanting lake in Pokhara reflecting the Annapurna range. Known for boating, lakeside dining, and the Tal Barahi temple.','','tour',9),
('Sarangkot','A hill station just outside Pokhara famous for paragliding and stunning sunrise views over the Annapurna range.','','tour',10),
('Devi''s Falls','A unique waterfall in Pokhara that disappears into an underground gorge. Also known as Patale Chhango.','','tour',11),
('Chitwan National Park','A UNESCO World Heritage Site and Nepal''s premier wildlife reserve home to tigers, rhinos, elephants, and hundreds of bird species.','','tour',12),
('Everest View Hotel','The highest placed hotel in the world at 3,962m with panoramic views of Everest and the Khumbu region.','','tour',13),
('Lumbini','The birthplace of Lord Buddha, a UNESCO World Heritage Site and one of the most important pilgrimage sites in the world.','','tour',14),
-- Trek places
('Ghorepani','A charming village at 2,874m on the Annapurna trekking route, known for rhododendron forests and the gateway to Poon Hill.','','trek',1),
('Ghandruk','A beautiful Gurung village with traditional stone houses, terraced fields, and stunning views of Annapurna South and Machhapuchhre.','','trek',2),
('Chhomrong','A scenic Gurung village at 2,170m serving as the gateway to the Annapurna Sanctuary trek with dramatic mountain views.','','trek',3),
('Phakding','A small settlement along the Everest region trek route, known for its pine forests and the rushing Dudh Koshi River.','','trek',4),
('Tengboche','Home to the famous Tengboche Monastery, the largest in the Khumbu region, with breathtaking views of Everest and Ama Dablam.','','trek',5),
('Dingboche','A Sherpa village at 4,410m known for its stone-walled potato fields and as an acclimatization stop with views of Lhotse and Island Peak.','','trek',6),
('Lobuche','A small settlement at 4,940m on the way to Everest Base Camp, offering stark high-altitude landscapes and Himalayan views.','','trek',7),
('Manang','A historic trading village at 3,519m on the Annapurna Circuit, surrounded by dramatic cliffs and offering stunning mountain panoramas.','','trek',8),
('Kyanjin Gompa','A beautiful monastery at 3,870m in the Langtang Valley, surrounded by cheese factories and spectacular mountain scenery.','','trek',9),
('Tilicho Lake','The highest lake in the world at 4,919m, located in the Annapurna range with breathtaking turquoise waters.','','trek',10),
('Muktinath Temple','A sacred temple at 3,710m revered by both Hindus and Buddhists, with 108 water spouts and eternal flames.','','trek',11),
('Gosaikunda Lake','A sacred alpine lake at 4,380m, part of the Langtang trek route, believed to be the abode of Lord Shiva.','','trek',12)) AS v(name, description, image_url, type, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.places);

-- 16. UPDATE HERO VIDEO URL
UPDATE public.site_settings
SET value = jsonb_set(
  value,
  '{video_url}',
  '"https://videos.pexels.com/video-files/2110772/2110772-uhd_3840_2160_30fps.mp4"'::jsonb
)
WHERE key = 'hero';

-- 17. STORAGE BUCKETS & POLICIES (for image / logo uploads)
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
