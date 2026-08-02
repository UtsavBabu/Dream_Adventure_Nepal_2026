-- Dream Adventure Nepal
-- 1) Make inclusions/exclusions genuinely region-specific (transport, permits and
--    region caveats differ) instead of one shared template.
-- 2) Annotate the Kailash itinerary with per-day altitudes (incl. the return legs)
--    so the elevation profile rises to Dolma La and descends back to Kathmandu.

-- ── Everest region: Everest Base Camp (Lukla flights, Sagarmatha permits) ──
update adventures set
  includes = jsonb_build_array(
    $$Round-trip Kathmandu–Lukla flights, including airport departure taxes$$,
    $$Airport transfers in Kathmandu by private vehicle$$,
    $$3 nights' 3-star hotel in Kathmandu on a bed-and-breakfast basis$$,
    $$Teahouse/lodge accommodation on a twin-sharing basis during the trek$$,
    $$All meals (breakfast, lunch and dinner) during the trek$$,
    $$Government-licensed Everest-region guide (salary, meals, insurance and gear covered)$$,
    $$A porter for every two trekkers (salary and insurance covered)$$,
    $$Sagarmatha National Park permit and Khumbu Pasang Lhamu Rural Municipality entry permit$$,
    $$First-aid medical kit and pulse oximeter$$,
    $$All government taxes and official expenses$$
  ),
  excludes = jsonb_build_array(
    $$International airfare and Nepal entry visa fees$$,
    $$Travel and high-altitude emergency rescue / evacuation insurance (mandatory)$$,
    $$Lunch and dinner while in Kathmandu$$,
    $$Personal trekking gear — down jacket and sleeping bag can be rented in Kathmandu$$,
    $$Extra hotel/lodge nights if Lukla flights are delayed by weather$$,
    $$Hot showers, device charging, Wi-Fi and bottled/boiled water on the trail$$,
    $$Tips for the guide and porters, and personal expenses$$
  ),
  updated_at = now()
where slug = 'everest-base-camp';

-- ── Everest region: EBC Cho La Pass (adds glacier-pass gear) ──
update adventures set
  includes = jsonb_build_array(
    $$Round-trip Kathmandu–Lukla flights, including airport departure taxes$$,
    $$Airport transfers in Kathmandu by private vehicle$$,
    $$3 nights' 3-star hotel in Kathmandu on a bed-and-breakfast basis$$,
    $$Teahouse/lodge accommodation on a twin-sharing basis during the trek$$,
    $$All meals (breakfast, lunch and dinner) during the trek$$,
    $$Government-licensed Everest-region guide (salary, meals, insurance and gear covered)$$,
    $$Group safety gear and crampons for the Cho La Pass crossing$$,
    $$A porter for every two trekkers (salary and insurance covered)$$,
    $$Sagarmatha National Park permit and Khumbu Pasang Lhamu Rural Municipality entry permit$$,
    $$First-aid medical kit and pulse oximeter$$
  ),
  excludes = jsonb_build_array(
    $$International airfare and Nepal entry visa fees$$,
    $$Travel and high-altitude emergency rescue / evacuation insurance (mandatory)$$,
    $$Lunch and dinner while in Kathmandu$$,
    $$Personal trekking and glacier gear (down jacket / sleeping bag rentable in Kathmandu)$$,
    $$Extra nights if Lukla flights are delayed by weather$$,
    $$Hot showers, charging, Wi-Fi and bottled/boiled water on the trail$$,
    $$Tips for the guide and porters, and personal expenses$$
  ),
  updated_at = now()
where slug = 'ebc-chola-pass-trek';

-- ── Annapurna region: Annapurna Circuit (overland via Pokhara, ACAP+TIMS) ──
update adventures set
  includes = jsonb_build_array(
    $$Kathmandu–Besisahar and Tatopani/Jomsom–Pokhara–Kathmandu ground transport (tourist bus / shared jeep)$$,
    $$Airport transfers in Kathmandu by private vehicle$$,
    $$2 nights' hotel in Kathmandu and 1 night in Pokhara on a bed-and-breakfast basis$$,
    $$Teahouse/lodge accommodation on a twin-sharing basis during the trek$$,
    $$All meals (breakfast, lunch and dinner) during the trek$$,
    $$Government-licensed Annapurna-region guide (salary, meals, insurance and gear covered)$$,
    $$A porter for every two trekkers (salary and insurance covered)$$,
    $$Annapurna Conservation Area Permit (ACAP) and TIMS card$$,
    $$First-aid medical kit and pulse oximeter$$,
    $$All government taxes and official expenses$$
  ),
  excludes = jsonb_build_array(
    $$International airfare and Nepal entry visa fees$$,
    $$Travel and high-altitude emergency rescue / evacuation insurance (mandatory)$$,
    $$Lunch and dinner while in Kathmandu and Pokhara$$,
    $$Optional Jomsom–Pokhara flight if you choose to shorten the descent$$,
    $$Personal trekking gear and equipment$$,
    $$Hot showers, charging, Wi-Fi and bottled/boiled water on the trail$$,
    $$Tips for the guide and porters, and personal expenses$$
  ),
  updated_at = now()
where slug = 'annapurna-circuit';

-- ── Langtang region: Langtang Valley (Syabrubesi drive, Langtang NP+TIMS) ──
update adventures set
  includes = jsonb_build_array(
    $$Round-trip Kathmandu–Syabrubesi drive (shared jeep / local bus)$$,
    $$Airport transfers in Kathmandu by private vehicle$$,
    $$2 nights' hotel in Kathmandu on a bed-and-breakfast basis$$,
    $$Teahouse/lodge accommodation on a twin-sharing basis during the trek$$,
    $$All meals (breakfast, lunch and dinner) during the trek$$,
    $$Government-licensed Langtang-region guide (salary, meals, insurance and gear covered)$$,
    $$A porter for every two trekkers (salary and insurance covered)$$,
    $$Langtang National Park permit and TIMS card$$,
    $$First-aid medical kit and pulse oximeter$$,
    $$All government taxes and official expenses$$
  ),
  excludes = jsonb_build_array(
    $$International airfare and Nepal entry visa fees$$,
    $$Travel and high-altitude emergency rescue / evacuation insurance (mandatory)$$,
    $$Meals in Kathmandu (except breakfast)$$,
    $$Private jeep upgrade for the Syabrubesi drive (shared is included)$$,
    $$Personal trekking gear and equipment$$,
    $$Hot showers, charging, Wi-Fi and bottled/boiled water on the trail$$,
    $$Tips for the guide and porters, and personal expenses$$
  ),
  updated_at = now()
where slug = 'langtang-valley-trek-';

-- ── Restricted / trans-Himalaya: Upper Mustang (Jomsom flights, special permit) ──
update adventures set
  includes = jsonb_build_array(
    $$Kathmandu–Pokhara and round-trip Pokhara–Jomsom flights$$,
    $$Upper Mustang Restricted Area Permit (USD 500, first 10 days) and ACAP$$,
    $$Airport transfers by private vehicle$$,
    $$Hotels in Kathmandu and Pokhara on a bed-and-breakfast basis$$,
    $$Teahouse/lodge accommodation on a twin-sharing basis during the trek$$,
    $$All meals (breakfast, lunch and dinner) during the trek$$,
    $$Government-licensed guide (minimum two trekkers required for the restricted area)$$,
    $$A porter for every two trekkers (salary and insurance covered)$$,
    $$First-aid medical kit and pulse oximeter$$,
    $$All government taxes and official expenses$$
  ),
  excludes = jsonb_build_array(
    $$International airfare and Nepal entry visa fees$$,
    $$Travel and high-altitude emergency rescue / evacuation insurance (mandatory)$$,
    $$Restricted-area permit extension beyond 10 days (USD 50 per extra day)$$,
    $$Meals in Kathmandu and Pokhara (except breakfast)$$,
    $$Personal trekking gear and equipment$$,
    $$Charging, Wi-Fi and bottled/boiled water on the trail$$,
    $$Tips for the guide and porters, and personal expenses$$
  ),
  updated_at = now()
where slug = 'upper-mustang';

-- ── Restricted: Manaslu & Tsum Valley (overland jeep, dual restricted permits) ──
update adventures set
  includes = jsonb_build_array(
    $$Kathmandu–Machha Khola and Dharapani–Besisahar–Kathmandu ground transport (shared jeep)$$,
    $$Manaslu and Tsum Valley Restricted Area Permits, MCAP and ACAP$$,
    $$Airport transfers by private vehicle$$,
    $$2 nights' hotel in Kathmandu on a bed-and-breakfast basis$$,
    $$Teahouse/lodge accommodation on a twin-sharing basis during the trek$$,
    $$All meals (breakfast, lunch and dinner) during the trek$$,
    $$Government-licensed guide (minimum two trekkers required for the restricted area)$$,
    $$A porter for every two trekkers (salary and insurance covered)$$,
    $$First-aid medical kit and pulse oximeter$$,
    $$All government taxes and official expenses$$
  ),
  excludes = jsonb_build_array(
    $$International airfare and Nepal entry visa fees$$,
    $$Travel and high-altitude emergency rescue / evacuation insurance (mandatory)$$,
    $$Restricted-area permit fees are higher in Sep–Nov (seasonal surcharge)$$,
    $$Meals in Kathmandu (except breakfast)$$,
    $$Personal trekking gear and equipment$$,
    $$Charging, Wi-Fi and bottled/boiled water on the trail$$,
    $$Tips for the guide and porters, and personal expenses$$
  ),
  updated_at = now()
where slug = 'manaslu-and-tsum-valley';

-- ── Kailash: per-day altitudes on every overnight (ascent + descent) ──
update adventures set
  itinerary = jsonb_build_array(
    jsonb_build_object('day', 1, 'title', $$Arrival in Kathmandu$$, 'description', $$Welcome at Tribhuvan International Airport and transfer to your hotel in Kathmandu (1,400 m). Evening yatra briefing and documentation check.$$),
    jsonb_build_object('day', 2, 'title', $$Kathmandu — preparation & Pashupatinath$$, 'description', $$Visit the sacred Pashupatinath temple and complete permit formalities in Kathmandu (1,400 m), preparing gear for the journey ahead.$$),
    jsonb_build_object('day', 3, 'title', $$Drive to Kerung (Gyirong), Tibet border$$, 'description', $$Scenic drive north to the Nepal–Tibet frontier, completing immigration into Tibet and overnight at Kerung (2,700 m).$$),
    jsonb_build_object('day', 4, 'title', $$Acclimatization day in Kerung$$, 'description', $$A vital rest and acclimatization day at Kerung (2,700 m) with short hikes to help your body adjust to the increasing altitude.$$),
    jsonb_build_object('day', 5, 'title', $$Drive Kerung to Saga$$, 'description', $$Ascend onto the Tibetan plateau, crossing high passes with sweeping views en route to Saga (4,600 m).$$),
    jsonb_build_object('day', 6, 'title', $$Drive Saga to Lake Mansarovar$$, 'description', $$Continue across the plateau to the shores of the holy Lake Mansarovar (4,590 m) for a first, unforgettable darshan.$$),
    jsonb_build_object('day', 7, 'title', $$Mansarovar parikrama — transfer to Darchen$$, 'description', $$Morning prayers and holy bath at the lake, then drive to Darchen (4,670 m), gateway to Mount Kailash.$$),
    jsonb_build_object('day', 8, 'title', $$Kora Day 1 — Darchen to Dirapuk$$, 'description', $$Begin the sacred circumambulation, walking beneath the towering north face of Mount Kailash to Dirapuk (4,900 m).$$),
    jsonb_build_object('day', 9, 'title', $$Kora Day 2 — Dolma La Pass to Zuthulpuk$$, 'description', $$The most demanding day: cross the revered Dolma La Pass (5,630 m) before descending to Zuthulpuk (4,790 m).$$),
    jsonb_build_object('day', 10, 'title', $$Kora Day 3 — Zuthulpuk to Darchen, drive to Saga$$, 'description', $$Complete the Kora and drive back across the plateau to Saga (4,600 m) for the night.$$),
    jsonb_build_object('day', 11, 'title', $$Drive Saga to Kerung$$, 'description', $$Retrace the route down from the high plateau toward the border town of Kerung (2,700 m).$$),
    jsonb_build_object('day', 12, 'title', $$Drive Kerung to Kathmandu$$, 'description', $$Cross back into Nepal and descend to Kathmandu (1,400 m) for a celebratory evening.$$),
    jsonb_build_object('day', 13, 'title', $$Reserve day in Kathmandu$$, 'description', $$A contingency day in Kathmandu (1,400 m) to absorb any weather or border delays, with free time for rest and shopping.$$),
    jsonb_build_object('day', 14, 'title', $$Final departure$$, 'description', $$Transfer to the airport for your onward journey, carrying the blessings of Kailash and Mansarovar.$$)
  ),
  updated_at = now()
where slug = 'kailash-mansarovar-yatra';
