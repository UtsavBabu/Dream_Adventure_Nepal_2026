-- Dream Adventure Nepal — content + imagery polish
-- 1) Fix hero/about copy typos  2) Replace off-theme / blank photography with
-- verified Himalayan imagery  3) Fill inclusions / exclusions / highlights /
-- "About this trek" for treks that were missing them.  All string literals are
-- dollar-quoted ($$...$$) so apostrophes need no escaping.

-- ─────────────────────────────────────────────────────────────
-- SITE SETTINGS: hero copy + poster, about image + feature typo
-- ─────────────────────────────────────────────────────────────
update site_settings
set value = jsonb_set(
              jsonb_set(
                jsonb_set(
                  value,
                  '{subtitle}',
                  to_jsonb($$Explore, Experience, and Inspire

Experience breathtaking treks, mountain expeditions, helicopter tours and cultural journeys crafted by local experts.$$::text)
                ),
                '{footer_text}',
                to_jsonb($$Government-licensed · Nepali team-led · 100% local team$$::text)
              ),
              '{poster_url}',
              to_jsonb($$https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920$$::text)
            )
where key = 'hero';

update site_settings
set value = jsonb_set(
              jsonb_set(
                value,
                '{image}',
                to_jsonb($$https://images.pexels.com/photos/372098/pexels-photo-372098.jpeg?auto=compress&cs=tinysrgb&w=1200$$::text)
              ),
              '{features,1,desc}',
              to_jsonb($$Experienced guides and teams with 10+ years on every route.$$::text)
            )
where key = 'about';

-- ─────────────────────────────────────────────────────────────
-- IMAGERY: replace off-theme / blank adventure photos
-- ─────────────────────────────────────────────────────────────
-- Ama Dablam: was snowboarders (848612) -> dramatic snow summit above cloud
update adventures set image_url =
  $$https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg?auto=compress&cs=tinysrgb&w=1600$$,
  updated_at = now()
where slug = 'ama-dablam-expedition';

-- Mera Peak: was blank -> trekker facing a snow peak
update adventures set image_url =
  $$https://images.pexels.com/photos/2450296/pexels-photo-2450296.jpeg?auto=compress&cs=tinysrgb&w=1600$$,
  updated_at = now()
where slug = 'mera-peak-climbing';

-- Manaslu & Tsum: was blank -> high alpine tented camp
update adventures set image_url =
  $$https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1600$$,
  updated_at = now()
where slug = 'manaslu-and-tsum-valley';

-- ─────────────────────────────────────────────────────────────
-- Unpublish the empty duplicate ABC entry (real one is annapurna-base-camp)
-- ─────────────────────────────────────────────────────────────
update adventures set is_published = false, updated_at = now()
where slug = 'annapurna-base-camp-(8-days-trek-)';

-- ─────────────────────────────────────────────────────────────
-- CONTENT: inclusions / exclusions / highlights / overview
-- ─────────────────────────────────────────────────────────────

-- Everest Base Camp Trek (Everest region)
update adventures set
  includes = jsonb_build_array(
    $$Airport pick-up and drop-off in a private vehicle$$,
    $$Round-trip Kathmandu–Lukla flights including airport departure taxes$$,
    $$3 nights' hotel accommodation in Kathmandu on a bed-and-breakfast basis$$,
    $$Teahouse/lodge accommodation on a twin-sharing basis throughout the trek$$,
    $$All standard meals (breakfast, lunch and dinner) during the trek$$,
    $$Government-licensed, English-speaking guide (salary, meals, insurance and equipment covered)$$,
    $$Sagarmatha National Park permit and Khumbu Pasang Lhamu Rural Municipality entry permit$$,
    $$A porter for every two trekkers (salary and insurance covered)$$,
    $$Comprehensive first-aid medical kit and pulse oximeter$$,
    $$All government taxes and official expenses$$
  ),
  excludes = jsonb_build_array(
    $$International airfare and Nepal entry visa fees$$,
    $$Travel and high-altitude emergency rescue / evacuation insurance (mandatory)$$,
    $$Lunch and dinner while in Kathmandu$$,
    $$Personal trekking gear, clothing and equipment$$,
    $$Hot showers, battery charging, Wi-Fi and bottled/boiled drinking water on the trail$$,
    $$Tips for the guide and porters$$,
    $$Personal expenses and any costs arising from delays beyond our control$$
  ),
  highlights = jsonb_build_array(
    $$Stand at Everest Base Camp (5,364 m) at the foot of the world's highest mountain$$,
    $$Sunrise panorama over Everest from Kala Patthar (5,545 m)$$,
    $$Explore Namche Bazaar, the vibrant Sherpa trading capital$$,
    $$Visit the sacred Tengboche Monastery beneath Ama Dablam$$,
    $$Up-close views of Everest, Lhotse, Nuptse and Ama Dablam$$,
    $$The thrilling mountain flight in and out of Lukla$$
  ),
  updated_at = now()
where slug = 'everest-base-camp';

-- Annapurna Circuit (Annapurna region)
update adventures set
  includes = jsonb_build_array(
    $$Airport pick-up and drop-off in a private vehicle$$,
    $$All ground transport to and from the trailhead as per the itinerary$$,
    $$3 nights' hotel accommodation in Kathmandu on a bed-and-breakfast basis$$,
    $$Teahouse/lodge accommodation on a twin-sharing basis throughout the trek$$,
    $$All standard meals (breakfast, lunch and dinner) during the trek$$,
    $$Government-licensed, English-speaking guide (salary, meals, insurance and equipment covered)$$,
    $$Annapurna Conservation Area Permit (ACAP) and TIMS card$$,
    $$A porter for every two trekkers (salary and insurance covered)$$,
    $$Comprehensive first-aid medical kit and pulse oximeter$$,
    $$All government taxes and official expenses$$
  ),
  excludes = jsonb_build_array(
    $$International airfare and Nepal entry visa fees$$,
    $$Travel and high-altitude emergency rescue / evacuation insurance (mandatory)$$,
    $$Lunch and dinner while in Kathmandu$$,
    $$Personal trekking gear, clothing and equipment$$,
    $$Hot showers, battery charging, Wi-Fi and bottled/boiled drinking water on the trail$$,
    $$Tips for the guide and porters$$,
    $$Personal expenses and any costs arising from delays beyond our control$$
  ),
  highlights = jsonb_build_array(
    $$Cross the legendary Thorong La Pass (5,416 m)$$,
    $$Pilgrimage to the sacred temple of Muktinath$$,
    $$Descend through the Kali Gandaki, the world's deepest gorge$$,
    $$Scenery from subtropical rice terraces to high alpine desert$$,
    $$Traditional Gurung, Thakali and Tibetan-influenced villages$$,
    $$Acclimatize amid the peaks of the Manang valley$$
  ),
  updated_at = now()
where slug = 'annapurna-circuit';

-- Upper Mustang (restricted, Annapurna region)
update adventures set
  includes = jsonb_build_array(
    $$Airport pick-up and drop-off in a private vehicle$$,
    $$Kathmandu–Pokhara and round-trip Pokhara–Jomsom flights$$,
    $$Hotel accommodation in Kathmandu and Pokhara on a bed-and-breakfast basis$$,
    $$Teahouse/lodge accommodation on a twin-sharing basis throughout the trek$$,
    $$All standard meals (breakfast, lunch and dinner) during the trek$$,
    $$Government-licensed, English-speaking guide (salary, meals, insurance and equipment covered)$$,
    $$Upper Mustang Restricted Area Permit and Annapurna Conservation Area Permit (ACAP)$$,
    $$A porter for every two trekkers (salary and insurance covered)$$,
    $$Comprehensive first-aid medical kit and pulse oximeter$$,
    $$All government taxes and official expenses$$
  ),
  excludes = jsonb_build_array(
    $$International airfare and Nepal entry visa fees$$,
    $$Travel and high-altitude emergency rescue / evacuation insurance (mandatory)$$,
    $$Lunch and dinner while in Kathmandu and Pokhara$$,
    $$Personal trekking gear, clothing and equipment$$,
    $$Hot showers, battery charging, Wi-Fi and bottled/boiled drinking water on the trail$$,
    $$Tips for the guide and porters$$,
    $$Personal expenses and any costs arising from delays beyond our control$$
  ),
  highlights = jsonb_build_array(
    $$Explore the walled medieval capital of Lo Manthang$$,
    $$Ancient cliff monasteries and mysterious sky-caves$$,
    $$Trans-Himalayan desert of ochre cliffs and wind-carved canyons$$,
    $$Deeply preserved Tibetan Buddhist culture and chortens$$,
    $$Follow the ancient Kali Gandaki salt-trade route$$,
    $$Distant views of Dhaulagiri and Nilgiri above the plateau$$
  ),
  updated_at = now()
where slug = 'upper-mustang';

-- Langtang Valley Trek (Langtang region)
update adventures set
  includes = jsonb_build_array(
    $$Airport pick-up and drop-off in a private vehicle$$,
    $$Round-trip Kathmandu–Syabrubesi transport by private/local vehicle$$,
    $$2 nights' hotel accommodation in Kathmandu on a bed-and-breakfast basis$$,
    $$Teahouse/lodge accommodation on a twin-sharing basis throughout the trek$$,
    $$All standard meals (breakfast, lunch and dinner) during the trek$$,
    $$Government-licensed, English-speaking guide (salary, meals, insurance and equipment covered)$$,
    $$Langtang National Park permit and TIMS card$$,
    $$A porter for every two trekkers (salary and insurance covered)$$,
    $$Comprehensive first-aid medical kit and pulse oximeter$$,
    $$All government taxes and official expenses$$
  ),
  excludes = jsonb_build_array(
    $$International airfare and Nepal entry visa fees$$,
    $$Travel and high-altitude emergency rescue / evacuation insurance (mandatory)$$,
    $$Lunch and dinner while in Kathmandu$$,
    $$Personal trekking gear, clothing and equipment$$,
    $$Hot showers, battery charging, Wi-Fi and bottled/boiled drinking water on the trail$$,
    $$Tips for the guide and porters$$,
    $$Personal expenses and any costs arising from delays beyond our control$$
  ),
  highlights = jsonb_build_array(
    $$Visit the serene Kyanjin Gompa monastery$$,
    $$Sunrise from the Kyanjin Ri and Tserko Ri viewpoints$$,
    $$Front-row views of Langtang Lirung (7,227 m)$$,
    $$Experience the Tamang and Tibetan-influenced mountain culture$$,
    $$Sample local yak cheese at the Kyanjin dairy$$,
    $$A peaceful, crowd-free alternative to Everest and Annapurna$$
  ),
  updated_at = now()
where slug = 'langtang-valley-trek-';

-- EBC Cho La Pass Trek (needs short + long overview + inc/exc; keeps its highlights)
update adventures set
  description = $$A grand Everest loop linking the turquoise Gokyo Lakes with Everest Base Camp over the icy Cho La Pass (5,420 m).$$,
  long_description = $$The Everest Cho La Pass Trek is the ultimate way to experience the Khumbu, combining the two most spectacular valleys of the Everest region in a single, challenging loop. From the classic trail to Everest Base Camp and the summit of Kala Patthar, the route crosses the glaciated Cho La Pass (5,420 m) into the Gokyo Valley, home to the shimmering turquoise Gokyo Lakes and Nepal's largest glacier, the Ngozumpa.

Beginning with the dramatic mountain flight to Lukla, the trek climbs through Sherpa villages, ancient monasteries and rhododendron forests inside Sagarmatha National Park, a UNESCO World Heritage Site. You acclimatize in the bustling trading hub of Namche Bazaar before ascending to Everest Base Camp and the celebrated Kala Patthar viewpoint for sunrise over Everest, Lhotse and Nuptse.

Crossing the Cho La Pass is the adventurous heart of the journey — a steep, icy col that rewards trekkers with a real sense of high-mountain accomplishment. Descending into Gokyo, the climb of Gokyo Ri delivers arguably the finest single panorama in Nepal, taking in four 8,000-metre peaks at once: Everest, Lhotse, Makalu and Cho Oyu. This is a demanding but immensely rewarding trek for those who want the very best of the Everest region away from the busiest trails.$$,
  includes = jsonb_build_array(
    $$Airport pick-up and drop-off in a private vehicle$$,
    $$Round-trip Kathmandu–Lukla flights including airport departure taxes$$,
    $$3 nights' hotel accommodation in Kathmandu on a bed-and-breakfast basis$$,
    $$Teahouse/lodge accommodation on a twin-sharing basis throughout the trek$$,
    $$All standard meals (breakfast, lunch and dinner) during the trek$$,
    $$Government-licensed, English-speaking guide (salary, meals, insurance and equipment covered)$$,
    $$Sagarmatha National Park permit and Khumbu Pasang Lhamu Rural Municipality entry permit$$,
    $$A porter for every two trekkers (salary and insurance covered)$$,
    $$Comprehensive first-aid medical kit and pulse oximeter$$,
    $$All government taxes and official expenses$$
  ),
  excludes = jsonb_build_array(
    $$International airfare and Nepal entry visa fees$$,
    $$Travel and high-altitude emergency rescue / evacuation insurance (mandatory)$$,
    $$Lunch and dinner while in Kathmandu$$,
    $$Personal trekking gear, clothing and equipment$$,
    $$Hot showers, battery charging, Wi-Fi and bottled/boiled drinking water on the trail$$,
    $$Tips for the guide and porters$$,
    $$Personal expenses and any costs arising from delays beyond our control$$
  ),
  updated_at = now()
where slug = 'ebc-chola-pass-trek';

-- Manaslu & Tsum Valley (restricted) — full overview, highlights and standard lists
update adventures set
  description = $$A remote circuit around the world's eighth-highest peak, weaving in the sacred hidden Tsum Valley over the Larke La Pass (5,106 m).$$,
  long_description = $$The Manaslu Circuit with Tsum Valley is one of Nepal's most rewarding off-the-beaten-path adventures, encircling Mount Manaslu (8,163 m) — the world's eighth-highest mountain — while adding a detour into the sacred, hidden Tsum Valley. This restricted-area trek follows the ancient Budhi Gandaki river gorge from lush lowland villages up to the wild, glaciated high country of the Larke La Pass (5,106 m).

The Tsum Valley is a culturally distinct 'hidden valley' with deep Tibetan Buddhist roots, ringed by the Ganesh and Sringi Himal ranges. Here you'll find centuries-old monasteries such as Mu Gompa and Rachen Gompa, long mani walls, and a way of life that has changed little in generations. Because the region borders Tibet, special restricted-area permits are required, which has helped keep the trail quiet and its culture wonderfully intact.

The circuit combines dramatic mountain scenery, remote wilderness, warm Gurung and Tibetan hospitality, and far fewer crowds than the Everest or Annapurna regions. Crossing the Larke La is the high point in every sense — a long, exhilarating pass day with sweeping views of Himlung, Cheo, Kang Guru and the distant Annapurnas. It is an ideal choice for trekkers seeking genuine remoteness and cultural depth on a true Himalayan circuit.$$,
  includes = jsonb_build_array(
    $$Airport pick-up and drop-off in a private vehicle$$,
    $$Round-trip ground transport to Soti Khola and from Dharapani by private/local vehicle$$,
    $$2 nights' hotel accommodation in Kathmandu on a bed-and-breakfast basis$$,
    $$Teahouse/lodge accommodation on a twin-sharing basis throughout the trek$$,
    $$All standard meals (breakfast, lunch and dinner) during the trek$$,
    $$Government-licensed, English-speaking guide (salary, meals, insurance and equipment covered)$$,
    $$Manaslu & Tsum Valley Restricted Area Permits, MCAP and ACAP permits$$,
    $$A porter for every two trekkers (salary and insurance covered)$$,
    $$Comprehensive first-aid medical kit and pulse oximeter$$,
    $$All government taxes and official expenses$$
  ),
  excludes = jsonb_build_array(
    $$International airfare and Nepal entry visa fees$$,
    $$Travel and high-altitude emergency rescue / evacuation insurance (mandatory)$$,
    $$Lunch and dinner while in Kathmandu$$,
    $$Personal trekking gear, clothing and equipment$$,
    $$Hot showers, battery charging, Wi-Fi and bottled/boiled drinking water on the trail$$,
    $$Tips for the guide and porters$$,
    $$Personal expenses and any costs arising from delays beyond our control$$
  ),
  highlights = jsonb_build_array(
    $$Cross the dramatic Larke La Pass (5,106 m)$$,
    $$Explore the sacred, hidden Tsum Valley$$,
    $$Circle Manaslu (8,163 m), the world's eighth-highest peak$$,
    $$Ancient monasteries — Mu Gompa and Rachen Gompa$$,
    $$Remote restricted-area wilderness with few crowds$$,
    $$Rich Tibetan Buddhist and Gurung mountain culture$$
  ),
  updated_at = now()
where slug = 'manaslu-and-tsum-valley';
