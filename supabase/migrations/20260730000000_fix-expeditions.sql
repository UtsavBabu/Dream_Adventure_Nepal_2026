-- Fix the Expeditions section so the listings match what the site advertises
-- (Island Peak, Mera Peak, Ama Dablam) instead of a single miscategorized viewpoint.
--
-- 1) Remove the non-technical "Tsergo Ri" viewpoint from the Expedition category.
--    Its own description says it is a 5,033m NON-TECHNICAL viewpoint in Langtang,
--    so it does not belong under "Climbing Expeditions". We unpublish it (reversible)
--    rather than delete it, so the content can be recategorized as a Trek later.
UPDATE public.adventures
SET is_published = false,
    updated_at = now()
WHERE slug = 'Tsergo Ri';

-- 2) Add the three flagship climbing expeditions the site already advertises.
--    Prices/durations are industry-standard estimates — please verify and adjust
--    in the admin panel to match your actual packages.
INSERT INTO public.adventures
  (title, slug, description, long_description, image_url, duration, difficulty, price, category, sort_order, is_published, itinerary, includes, excludes, highlights)
VALUES
-- ── Island Peak (Imja Tse) ──────────────────────────────────────────────
(
  'Island Peak Climbing (Imja Tse)',
  'island-peak-climbing',
  $desc$Nepal's most popular trekking-peak climb (6,189 m) in the heart of the Everest region — acclimatize through the Khumbu, then take on a genuine glacier and headwall summit day.$desc$,
  $long$Island Peak, or Imja Tse (6,189 m / 20,305 ft), is the classic introduction to Himalayan mountaineering and the most-climbed 6,000 m peak in Nepal. The expedition follows the legendary Everest Base Camp trail through Namche Bazaar, Tengboche and Dingboche for careful acclimatization before turning up the Imja Valley to the peak's base camp.

Summit day begins in the dark with a steep climb to the crampon point, a roped glacier crossing threaded between crevasses, and a fixed-line ascent of the ~100 m headwall to a spectacular airy ridge. From the top you stand encircled by Lhotse, Nuptse, Makalu and Baruntse. Basic mountaineering skills are taught and refreshed at base camp, making this an ideal first Himalayan summit for fit trekkers with an appetite for a real climb.$long$,
  'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=1600',
  '16 Days',
  'Challenging',
  '$2,450',
  'Expedition',
  10,
  true,
  $itin$[
    {"day":1,"title":"Fly Kathmandu → Lukla, trek to Phakding","description":"Scenic mountain flight to Lukla (2,840 m), then an easy trek along the Dudh Koshi to Phakding (2,610 m)."},
    {"day":2,"title":"Phakding → Namche Bazaar","description":"Enter Sagarmatha National Park, cross suspension bridges and climb to the Sherpa capital, Namche Bazaar (3,440 m)."},
    {"day":3,"title":"Namche — acclimatization day","description":"Acclimatization hike to the Everest View Hotel and Khumjung village; first views of Everest, Lhotse and Ama Dablam."},
    {"day":4,"title":"Namche → Tengboche","description":"Trail through rhododendron forest to Tengboche (3,860 m) and its famous monastery beneath Ama Dablam."},
    {"day":5,"title":"Tengboche → Dingboche","description":"Cross the Imja Khola and ascend to the patchwork fields of Dingboche (4,410 m)."},
    {"day":6,"title":"Dingboche — acclimatization day","description":"Acclimatization climb toward Nangkartshang peak for panoramic views; return to sleep low."},
    {"day":7,"title":"Dingboche → Chhukung","description":"Short walk up the Imja Valley to Chhukung (4,730 m)."},
    {"day":8,"title":"Basic mountaineering training at Chhukung","description":"Skills day: fixed-rope ascending/descending, crampon and ice-axe technique, harness and knots."},
    {"day":9,"title":"Chhukung → Island Peak Base Camp","description":"Trek to Island Peak Base Camp (5,100 m); afternoon gear check and briefing."},
    {"day":10,"title":"Summit Island Peak (6,189 m), return to base camp","description":"Pre-dawn start, steep climb to the crampon point, glacier crossing and the fixed-line headwall to the summit ridge. Descend to base camp."},
    {"day":11,"title":"Contingency / reserve day","description":"Spare day for weather or a second summit attempt."},
    {"day":12,"title":"Base Camp → Pangboche","description":"Descend the valley back to Pangboche (3,930 m)."},
    {"day":13,"title":"Pangboche → Namche Bazaar","description":"Long descent back to Namche Bazaar."},
    {"day":14,"title":"Namche → Lukla","description":"Final trekking day back down to Lukla."},
    {"day":15,"title":"Fly Lukla → Kathmandu","description":"Return flight to Kathmandu; celebratory dinner in the evening."},
    {"day":16,"title":"Departure","description":"Transfer to the airport for your onward journey."}
  ]$itin$,
  $inc$[
    "Airport transfers and Kathmandu–Lukla–Kathmandu flights",
    "Government-licensed climbing Sherpa and trekking guide",
    "Island Peak climbing permit, TIMS card and Sagarmatha National Park fees",
    "All lodge/tea-house accommodation on trek and tented camp at base camp",
    "Group climbing equipment (rope, ice screws, snow bar) and porters",
    "Three meals a day during the trek and climb"
  ]$inc$,
  $exc$[
    "International airfare and Nepal visa",
    "Personal climbing gear (boots, crampons, harness, ice axe) — rental available",
    "Travel and high-altitude rescue insurance",
    "Personal expenses, drinks and tips"
  ]$exc$,
  $hl$[
    "Summit a genuine 6,189 m Himalayan peak — the classic first 6,000er",
    "Trek the iconic Everest Base Camp trail through Namche and Tengboche",
    "Hands-on mountaineering training before summit day",
    "360° summit views of Lhotse, Nuptse, Makalu and Baruntse"
  ]$hl$
),
-- ── Mera Peak ───────────────────────────────────────────────────────────
(
  'Mera Peak Climbing',
  'mera-peak-climbing',
  $desc$The highest trekking peak in Nepal (6,476 m) — a wild, non-technical glacier climb through the remote Hinku Valley, crowned by a summit view of five 8,000 m giants.$desc$,
  $long$Mera Peak (6,476 m / 21,247 ft) is the highest of Nepal's trekking peaks and one of the great high-altitude walk-ups of the Himalaya. The route escapes the busier Everest trails, crossing the forested Zatrwa La into the roadless Hinku Valley for a genuine wilderness approach.

Although the climbing is non-technical — mostly a steady glacier ascent in crampons on a rope team — the altitude makes Mera a serious undertaking that demands good fitness and proper acclimatization. The reward is one of the finest summit panoramas on earth: Everest, Lhotse, Cho Oyu, Makalu and Kangchenjunga, five of the world's six highest mountains, laid out in a single sweep.$long$,
  'https://images.pexels.com/photos/2403568/pexels-photo-2403568.jpeg?auto=compress&cs=tinysrgb&w=1600',
  '17 Days',
  'Challenging',
  '$2,650',
  'Expedition',
  11,
  true,
  $itin$[
    {"day":1,"title":"Fly Kathmandu → Lukla, trek to Chhutanga","description":"Mountain flight to Lukla (2,840 m), then trek toward Chhutanga (3,050 m)."},
    {"day":2,"title":"Cross Zatrwa La → Thuli Kharka","description":"Climb over the Zatrwa La pass (4,600 m) into the Hinku Valley; descend to Thuli Kharka."},
    {"day":3,"title":"Thuli Kharka → Kothe","description":"Descend through rhododendron and pine forest to Kothe (3,600 m) beside the Hinku Khola."},
    {"day":4,"title":"Kothe → Thaknak","description":"Gentle valley walk to Thaknak (4,350 m), passing the sacred Gompa at Gondishung."},
    {"day":5,"title":"Thaknak — acclimatization day","description":"Acclimatization hike toward Sabai Tsho glacial lake; return to sleep at Thaknak."},
    {"day":6,"title":"Thaknak → Khare","description":"Climb beside the moraine to Khare (5,045 m), the last settlement before the peak."},
    {"day":7,"title":"Khare — training & acclimatization","description":"Glacier and fixed-line skills day on the lower Mera glacier."},
    {"day":8,"title":"Khare → Mera Base Camp","description":"Cross onto the glacier and climb to Mera Base Camp (5,300 m)."},
    {"day":9,"title":"Base Camp → Mera High Camp","description":"Ascend the glacier to High Camp (5,780 m) on a rocky spur with huge sunset views."},
    {"day":10,"title":"Summit Mera Peak (6,476 m), descend to Khare","description":"Pre-dawn glacier ascent to the summit for the five-8,000er panorama, then long descent to Khare."},
    {"day":11,"title":"Contingency / reserve day","description":"Spare day held for weather or a second summit attempt."},
    {"day":12,"title":"Khare → Kothe","description":"Retrace the valley down to Kothe."},
    {"day":13,"title":"Kothe → Thuli Kharka","description":"Climb back up the valley toward the Zatrwa La."},
    {"day":14,"title":"Cross Zatrwa La → Lukla","description":"Recross the pass and descend to Lukla."},
    {"day":15,"title":"Fly Lukla → Kathmandu","description":"Return flight to Kathmandu; rest and celebration."},
    {"day":16,"title":"Reserve day in Kathmandu","description":"Buffer day in case of Lukla flight delays."},
    {"day":17,"title":"Departure","description":"Transfer to the airport for your onward journey."}
  ]$itin$,
  $inc$[
    "Airport transfers and Kathmandu–Lukla–Kathmandu flights",
    "Government-licensed climbing Sherpa and trekking guide",
    "Mera Peak climbing permit, TIMS card and Makalu Barun National Park fees",
    "All lodge/tea-house accommodation and tented camps above Khare",
    "Group climbing equipment, ropes and porters",
    "Three meals a day during the trek and climb"
  ]$inc$,
  $exc$[
    "International airfare and Nepal visa",
    "Personal climbing gear (boots, crampons, harness, ice axe) — rental available",
    "Travel and high-altitude rescue insurance",
    "Personal expenses, drinks and tips"
  ]$exc$,
  $hl$[
    "Stand on the summit of Nepal's highest trekking peak, 6,476 m",
    "See five of the world's six highest mountains from the top",
    "Wilderness approach through the remote, roadless Hinku Valley",
    "Non-technical glacier climb ideal for fit first-time high-altitude climbers"
  ]$hl$
),
-- ── Ama Dablam ──────────────────────────────────────────────────────────
(
  'Ama Dablam Expedition',
  'ama-dablam-expedition',
  $desc$The "Matterhorn of the Himalaya" (6,812 m) — a serious technical expedition on the classic Southwest Ridge, for experienced alpinists chasing one of the most beautiful summits on earth.$desc$,
  $long$Ama Dablam (6,812 m / 22,349 ft) is widely regarded as one of the most beautiful mountains in the world and a benchmark technical objective in the Everest region. Unlike the trekking peaks, this is a full expedition on the classic Southwest Ridge — a sustained mixed climb over rock, snow and ice with exposed sections, fixed lines and three high camps.

The expedition allows generous time for acclimatization rotations between base camp and the higher camps before a summit push through the famous "Mushroom Ridge" and the hanging glacier (the *dablam*) that gives the peak its name. This climb is for fit, experienced mountaineers comfortable on steep fixed ropes at altitude; prior 6,000 m experience (such as Island or Mera Peak) is strongly recommended.$long$,
  'https://images.pexels.com/photos/848612/pexels-photo-848612.jpeg?auto=compress&cs=tinysrgb&w=1600',
  '30 Days',
  'Expert',
  '$8,900',
  'Expedition',
  12,
  true,
  $itin$[
    {"day":1,"title":"Arrive Kathmandu","description":"Airport transfer, expedition briefing and gear check in Kathmandu (1,400 m)."},
    {"day":2,"title":"Expedition preparation & permits","description":"Final logistics, permit formalities and equipment inspection."},
    {"day":3,"title":"Fly Lukla, trek to Phakding","description":"Mountain flight to Lukla and easy trek to Phakding (2,610 m)."},
    {"day":4,"title":"Phakding → Namche Bazaar","description":"Enter Sagarmatha National Park and climb to Namche (3,440 m)."},
    {"day":5,"title":"Namche — acclimatization","description":"Acclimatization day with a hike to the Everest View viewpoint."},
    {"day":6,"title":"Namche → Tengboche → Pangboche","description":"Trek past Tengboche monastery to Pangboche (3,930 m)."},
    {"day":7,"title":"Pangboche → Ama Dablam Base Camp","description":"Ascend to Ama Dablam Base Camp (4,600 m); set up expedition camp."},
    {"day":8,"title":"Base camp rest & training","description":"Rope-fixing review, rock and ice skills, and rest for acclimatization."},
    {"day":9,"title":"Acclimatization rotation to Camp 1","description":"Carry loads and touch Camp 1 (5,700 m) on the ridge, return to base camp."},
    {"day":10,"title":"Rest at base camp","description":"Recovery and weather assessment."},
    {"day":11,"title":"Rotation: Camp 1 → Camp 2","description":"Climb fixed lines to the exposed Camp 2 (6,000 m) perched on the ridge."},
    {"day":12,"title":"Return to base camp","description":"Descend to base camp to recover after the rotation."},
    {"day":13,"title":"Rest and weather window planning","description":"Rest days at base camp waiting for a settled summit window."},
    {"day":14,"title":"Summit push: Base Camp → Camp 1","description":"Begin the summit rotation, climbing to Camp 1."},
    {"day":15,"title":"Camp 1 → Camp 2","description":"Ascend the technical ridge to Camp 2."},
    {"day":16,"title":"Camp 2 → Camp 3","description":"Climb through the Mushroom Ridge to Camp 3 (6,300 m) below the dablam."},
    {"day":17,"title":"Summit Ama Dablam (6,812 m), descend to Camp 2","description":"Pre-dawn summit bid on steep snow and ice; descend to a lower camp after the top."},
    {"day":18,"title":"Descend to Base Camp","description":"Continue down the fixed lines to base camp."},
    {"day":19,"title":"Contingency / summit reserve day","description":"Spare summit-window day for weather."},
    {"day":20,"title":"Contingency / summit reserve day","description":"Additional buffer day for the summit push."},
    {"day":21,"title":"Pack up base camp","description":"Break down camp and prepare to trek out."},
    {"day":22,"title":"Base Camp → Namche Bazaar","description":"Long descent back to Namche Bazaar."},
    {"day":23,"title":"Namche → Lukla","description":"Final trekking day to Lukla."},
    {"day":24,"title":"Fly Lukla → Kathmandu","description":"Return flight to Kathmandu."},
    {"day":25,"title":"Reserve day in Kathmandu","description":"Buffer for Lukla flight delays; celebration dinner."},
    {"day":26,"title":"Departure","description":"Transfer to the airport for your onward journey."}
  ]$itin$,
  $inc$[
    "Airport transfers and Kathmandu–Lukla–Kathmandu flights",
    "Experienced expedition climbing Sherpa (1:1 on summit day) and base-camp staff",
    "Ama Dablam climbing permit, Liaison officer, TIMS and national park fees",
    "Full base-camp service with tents, dining tent, cook and kitchen crew",
    "Fixed ropes, group climbing hardware and high-camp logistics",
    "All meals throughout the expedition"
  ]$inc$,
  $exc$[
    "International airfare and Nepal visa",
    "Personal technical climbing equipment and high-altitude clothing",
    "Comprehensive expedition and high-altitude helicopter-rescue insurance",
    "Supplementary oxygen (available on request), personal expenses and tips",
    "Summit bonus for climbing Sherpa"
  ]$exc$,
  $hl$[
    "Climb one of the most beautiful and iconic peaks in the Himalaya",
    "Classic technical Southwest Ridge with fixed lines and three high camps",
    "Generous acclimatization rotations for a safe summit window",
    "1:1 climbing Sherpa support on summit day"
  ]$hl$
)
ON CONFLICT (slug) DO UPDATE SET
  title            = EXCLUDED.title,
  description      = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  image_url        = EXCLUDED.image_url,
  duration         = EXCLUDED.duration,
  difficulty       = EXCLUDED.difficulty,
  price            = EXCLUDED.price,
  category         = EXCLUDED.category,
  sort_order       = EXCLUDED.sort_order,
  is_published     = EXCLUDED.is_published,
  itinerary        = EXCLUDED.itinerary,
  includes         = EXCLUDED.includes,
  excludes         = EXCLUDED.excludes,
  highlights       = EXCLUDED.highlights,
  updated_at       = now();
