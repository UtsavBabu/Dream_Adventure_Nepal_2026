-- Dream Adventure Nepal
-- 1) Add a reusable `badge` column to adventures (e.g. "Booking Open · 2026")
-- 2) Add the Kailash Mansarovar Yatra as a new destination (category Tour)
-- Idempotent: delete-then-insert the managed slug so re-runs are safe.

alter table adventures add column if not exists badge text;

delete from adventures where slug = 'kailash-mansarovar-yatra';

insert into adventures (
  id, title, slug, description, long_description, image_url,
  duration, difficulty, price, category, sort_order, is_published,
  itinerary, map_embed_url, includes, excludes, highlights, badge,
  created_at, updated_at
) values (
  gen_random_uuid(),
  $$Kailash Mansarovar Yatra$$,
  $$kailash-mansarovar-yatra$$,
  $$A sacred journey to Mount Kailash (6,638 m) and holy Lake Mansarovar — the spiritual heart of the Himalaya, revered by Hindus, Buddhists, Jains and Bön.$$,
  $$The Kailash Mansarovar Yatra is one of the most sacred pilgrimages on Earth — a journey to Mount Kailash (6,638 m) and the shimmering holy Lake Mansarovar (4,590 m) on the remote Tibetan plateau. Revered by Hindus as the abode of Lord Shiva, by Buddhists as the sacred home of Demchok, and holy to Jains and the ancient Bön faith, this is a voyage of profound spiritual significance set against some of the most awe-inspiring high-altitude scenery in the world.

Departing from Kathmandu, the overland route crosses the Nepal–Tibet border and climbs onto the vast Tibetan plateau, passing Saga and the sacred waters of Lake Mansarovar before reaching Darchen, the gateway to the holy mountain. The spiritual highlight is the Kailash Kora — a 52 km circumambulation of Mount Kailash completed over three days, crossing the demanding Dolma La Pass (5,630 m), the highest and most revered point of the parikrama.

We operate this yatra with careful acclimatization built into the itinerary, an experienced Tibetan and Nepali crew, comfortable transport and lodging, supplementary oxygen and a comprehensive medical kit — so pilgrims of every background can undertake this life-changing journey safely. Bookings are now open for our 2026 departures (May to September).$$,
  $$https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1600$$,
  $$14 Days$$,
  $$Challenging$$,
  $$$2,950$$,
  $$Tour$$,
  0,
  true,
  jsonb_build_array(
    jsonb_build_object('day', 1, 'title', $$Arrival in Kathmandu$$, 'description', $$Welcome at Tribhuvan International Airport and transfer to your hotel. Evening yatra briefing and documentation check.$$),
    jsonb_build_object('day', 2, 'title', $$Kathmandu — preparation & Pashupatinath$$, 'description', $$Visit the sacred Pashupatinath temple, complete permit formalities and prepare gear for the journey ahead.$$),
    jsonb_build_object('day', 3, 'title', $$Drive to Kerung (Gyirong), Tibet border$$, 'description', $$Scenic drive north to the Nepal–Tibet frontier, completing immigration into Tibet and overnight at Kerung (2,700 m).$$),
    jsonb_build_object('day', 4, 'title', $$Acclimatization day in Kerung$$, 'description', $$A vital rest and acclimatization day with short hikes to help your body adjust to the increasing altitude.$$),
    jsonb_build_object('day', 5, 'title', $$Drive Kerung to Saga$$, 'description', $$Ascend onto the Tibetan plateau, crossing high passes with sweeping views en route to Saga (4,600 m).$$),
    jsonb_build_object('day', 6, 'title', $$Drive Saga to Lake Mansarovar$$, 'description', $$Continue across the plateau to the shores of the holy Lake Mansarovar (4,590 m) for a first, unforgettable darshan.$$),
    jsonb_build_object('day', 7, 'title', $$Mansarovar parikrama — transfer to Darchen$$, 'description', $$Morning prayers and holy bath at the lake, then drive to Darchen (4,670 m), gateway to Mount Kailash.$$),
    jsonb_build_object('day', 8, 'title', $$Kora Day 1 — Darchen to Dirapuk$$, 'description', $$Begin the sacred circumambulation, walking beneath the towering north face of Mount Kailash to Dirapuk (4,900 m).$$),
    jsonb_build_object('day', 9, 'title', $$Kora Day 2 — Dolma La Pass to Zuthulpuk$$, 'description', $$The most demanding day: cross the revered Dolma La Pass (5,630 m) before descending to Zuthulpuk (4,790 m).$$),
    jsonb_build_object('day', 10, 'title', $$Kora Day 3 — Zuthulpuk to Darchen, drive to Saga$$, 'description', $$Complete the Kora and drive back across the plateau to Saga for the night.$$),
    jsonb_build_object('day', 11, 'title', $$Drive Saga to Kerung$$, 'description', $$Retrace the route down from the high plateau toward the border town of Kerung.$$),
    jsonb_build_object('day', 12, 'title', $$Drive Kerung to Kathmandu$$, 'description', $$Cross back into Nepal and descend to Kathmandu for a celebratory evening.$$),
    jsonb_build_object('day', 13, 'title', $$Reserve day in Kathmandu$$, 'description', $$A contingency day to absorb any weather or border delays, with free time for rest and shopping.$$),
    jsonb_build_object('day', 14, 'title', $$Final departure$$, 'description', $$Transfer to the airport for your onward journey, carrying the blessings of Kailash and Mansarovar.$$)
  ),
  $$$$,
  jsonb_build_array(
    $$Airport pick-up and drop-off in Kathmandu$$,
    $$All ground transport Kathmandu–Tibet–Kathmandu in comfortable vehicles$$,
    $$Hotel accommodation in Kathmandu and guesthouse/lodge on the Tibet leg (twin-sharing)$$,
    $$All vegetarian meals throughout the yatra$$,
    $$Tibet/China Kailash travel permit, group visa and all entry fees$$,
    $$Experienced yatra leader, Tibetan guide and support crew$$,
    $$Supplementary oxygen, pulse oximeter and comprehensive medical kit$$,
    $$Yaks and porters for personal duffels during the Kailash Kora$$,
    $$All government taxes and official expenses$$
  ),
  jsonb_build_array(
    $$International airfare to and from Kathmandu$$,
    $$Travel and high-altitude emergency rescue / evacuation insurance (mandatory)$$,
    $$Nepal re-entry visa and personal expenses$$,
    $$Emergency helicopter, or personal pony/porter hire$$,
    $$Tips for guides, drivers and crew$$,
    $$Any cost arising from delays, border closures or events beyond our control$$
  ),
  jsonb_build_array(
    $$Circumambulate sacred Mount Kailash (6,638 m) on the 52 km Kora$$,
    $$Holy darshan and bath at Lake Mansarovar (4,590 m)$$,
    $$Cross the revered Dolma La Pass (5,630 m)$$,
    $$A pilgrimage sacred to Hindus, Buddhists, Jains and Bön$$,
    $$Journey across the dramatic, wide-open Tibetan plateau$$,
    $$Fully supported with oxygen, a medic and built-in acclimatization$$
  ),
  $$Booking Open · 2026$$,
  now(),
  now()
);
