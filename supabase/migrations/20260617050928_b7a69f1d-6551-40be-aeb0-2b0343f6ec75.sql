UPDATE public.site_settings
SET value = jsonb_set(
  value,
  '{video_url}',
  '"https://videos.pexels.com/video-files/2110772/2110772-uhd_3840_2160_30fps.mp4"'::jsonb
)
WHERE key = 'hero';