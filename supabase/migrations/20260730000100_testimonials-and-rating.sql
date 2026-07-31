-- Per site owner's confirmation:
--
-- 1) The four seeded testimonials are placeholder SAMPLE text, not real client
--    reviews. Showing fabricated reviews undermines trust more than showing none,
--    so unpublish them. The testimonials section auto-hides when there are zero
--    published reviews; re-add real ones (with photos, country, trek name) via the
--    admin panel and they will reappear.
UPDATE public.testimonials
SET is_published = false,
    updated_at = now()
WHERE name IN ('Sarah Mitchell', 'Lukas Bauer', 'Aiko Tanaka', 'James O''Connor');

-- 2) Fix the inconsistent hero rating tile: it read "4/5" sitting next to a row of
--    five filled stars. Corrected to a consistent value.
--    NOTE: confirm this matches your real average rating in Admin → Settings.
UPDATE public.site_settings
SET value = jsonb_set(value, '{stats,0,value}', '"4.9/5"'::jsonb)
WHERE key = 'hero';
