-- Places table (destinations / points of interest)
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
CREATE POLICY "anon read places" ON public.places
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admins all places" ON public.places;
CREATE POLICY "admins all places" ON public.places
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS trg_places_updated ON public.places;
CREATE TRIGGER trg_places_updated BEFORE UPDATE ON public.places FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Junction table: which places belong to which adventure
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
CREATE POLICY "anon read adventure_places" ON public.adventure_places
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admins all adventure_places" ON public.adventure_places;
CREATE POLICY "admins all adventure_places" ON public.adventure_places
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed data: Expedition places
INSERT INTO public.places (name, description, image_url, type, sort_order) VALUES
  ('Everest Base Camp', 'The legendary base camp at 5,364m at the foot of the world''s highest peak. The trek to Everest Base Camp is one of the most iconic adventures on Earth.', '', 'expedition', 1),
  ('Kala Patthar', 'At 5,545m, Kala Patthar offers the closest accessible viewpoint of Mount Everest. The sunrise view here is unforgettable.', '', 'expedition', 2),
  ('Khumbu Icefall', 'A chaotic cascade of towering ice seracs at the head of the Khumbu Glacier. One of the most technical sections of the Everest climb.', '', 'expedition', 3),
  ('Gorak Shep', 'The last settlement before Everest Base Camp at 5,164m. A small frozen lake and the final overnight stop for trekkers.', '', 'expedition', 4),
  ('Namche Bazaar', 'The bustling Sherpa capital at 3,440m. A vibrant market town with stunning Himalayan views, bakeries, and trekking gear shops.', '', 'expedition', 5),
  ('Annapurna Base Camp', 'At 4,130m, this amphitheater-like base camp is surrounded by a 360-degree panorama of Annapurna massif peaks.', '', 'expedition', 6),
  ('Poon Hill', 'The classic sunrise viewpoint at 3,210m offering breathtaking views of Dhaulagiri, Annapurna, and Machhapuchhre.', '', 'expedition', 7),
  ('Thorong La Pass', 'At 5,416m, this is the highest pass on the Annapurna Circuit and one of the most challenging and rewarding crossings in Nepal.', '', 'expedition', 8);

-- Seed data: Tour places
INSERT INTO public.places (name, description, image_url, type, sort_order) VALUES
  ('Nagarkot', 'A scenic hill station 32km from Kathmandu famous for sunrise views over the Himalayas including Mount Everest on clear days.', '', 'tour', 1),
  ('Bhaktapur Durbar Square', 'A UNESCO World Heritage Site with stunning medieval architecture, ancient palaces, and the famous 55 Window Palace.', '', 'tour', 2),
  ('Kathmandu Durbar Square', 'The historic heart of Kathmandu with ancient temples, palaces, and courtyards dating back to the Malla period.', '', 'tour', 3),
  ('Swayambhunath Stupa', 'Known as the Monkey Temple, this ancient religious complex atop a hill offers panoramic views of the Kathmandu Valley.', '', 'tour', 4),
  ('Pashupatinath Temple', 'One of the holiest Hindu temples dedicated to Lord Shiva, located on the banks of the Bagmati River.', '', 'tour', 5),
  ('Boudhanath Stupa', 'One of the largest spherical stupas in Nepal and a UNESCO World Heritage Site, a center of Tibetan Buddhism.', '', 'tour', 6),
  ('Patan Durbar Square', 'A UNESCO site featuring exquisite Newari architecture, ancient temples, and the Patan Museum.', '', 'tour', 7),
  ('Chandragiri Hill', 'A hilltop with a cable car ride offering panoramic Himalayan views and a historic Bhaleshwar Temple.', '', 'tour', 8);

-- Seed data: Trek places
INSERT INTO public.places (name, description, image_url, type, sort_order) VALUES
  ('Ghorepani', 'A charming village at 2,874m on the Annapurna trekking route, known for rhododendron forests and as the gateway to Poon Hill.', '', 'trek', 1),
  ('Ghandruk', 'A beautiful Gurung village with traditional stone houses, terraced fields, and stunning views of Annapurna South and Machhapuchhre.', '', 'trek', 2),
  ('Chhomrong', 'A scenic Gurung village at 2,170m serving as the gateway to the Annapurna Sanctuary trek with dramatic mountain views.', '', 'trek', 3),
  ('Phakding', 'A small settlement along the Everest region trek route, known for its pine forests and the rushing Dudh Koshi River.', '', 'trek', 4),
  ('Tengboche', 'Home to the famous Tengboche Monastery, the largest in the Khumbu region, with breathtaking views of Everest and Ama Dablam.', '', 'trek', 5),
  ('Dingboche', 'A Sherpa village at 4,410m known for its stone-walled potato fields and as an acclimatization stop with views of Lhotse and Island Peak.', '', 'trek', 6),
  ('Lobuche', 'A small settlement at 4,940m on the way to Everest Base Camp, offering stark high-altitude landscapes and Himalayan views.', '', 'trek', 7),
  ('Manang', 'A historic trading village at 3,519m on the Annapurna Circuit, surrounded by dramatic cliffs and offering stunning mountain panoramas.', '', 'trek', 8);
