import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Adventure = {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  image_url: string;
  duration: string;
  difficulty: string;
  price: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  badge?: string | null;
  itinerary: { day: number; title: string; description: string }[];
  map_embed_url: string;
  includes: string[];
  excludes: string[];
  highlights: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  country: string;
  avatar_url: string;
  review: string;
  rating: number;
  sort_order: number;
  is_published: boolean;
};

export type GalleryImage = {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
  is_published: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar_url: string;
  sort_order: number;
  is_published: boolean;
};

export type Place = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  lat: number | null;
  lng: number | null;
  type: "expedition" | "tour" | "trek";
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AdventurePlace = {
  id: string;
  adventure_id: string;
  place_id: string;
  day_number: number;
  sort_order: number;
  place?: Place;
};

export type Guide = {
  id: string;
  name: string;
  speciality: string;
  avatar_url: string;
  sort_order: number;
  is_published: boolean;
};

export type SiteSettings = Record<string, unknown>;

const STALE_10M = 10 * 60 * 1000;
const GC_1H = 60 * 60 * 1000;

export const siteSettingsQuery = queryOptions({
  queryKey: ["site_settings"],
  staleTime: STALE_10M,
  gcTime: GC_1H,
  queryFn: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase.from("site_settings").select("key,value");
    if (error) throw error;
    const map: SiteSettings = {};
    for (const row of data ?? []) map[row.key] = row.value;
    return map;
  },
});

export const adventuresQuery = queryOptions({
  queryKey: ["adventures"],
  staleTime: STALE_10M,
  gcTime: GC_1H,
  queryFn: async (): Promise<Adventure[]> => {
    const { data, error } = await supabase
      .from("adventures")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as Adventure[];
  },
});

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  staleTime: STALE_10M,
  gcTime: GC_1H,
  queryFn: async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Testimonial[];
  },
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  staleTime: STALE_10M,
  gcTime: GC_1H,
  queryFn: async (): Promise<GalleryImage[]> => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as GalleryImage[];
  },
});

export const adventureBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["adventure", slug],
    staleTime: STALE_10M,
    gcTime: GC_1H,
    queryFn: async (): Promise<Adventure> => {
      const { data, error } = await supabase
        .from("adventures")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as unknown as Adventure;
    },
  });

export const teamMembersQuery = queryOptions({
  queryKey: ["team_members"],
  staleTime: STALE_10M,
  gcTime: GC_1H,
  queryFn: async (): Promise<TeamMember[]> => {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as TeamMember[];
  },
});

export const placesQuery = queryOptions({
  queryKey: ["places"],
  staleTime: STALE_10M,
  gcTime: GC_1H,
  queryFn: async (): Promise<Place[]> => {
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Place[];
  },
});

export const adventurePlacesQuery = (adventureId: string) =>
  queryOptions({
    queryKey: ["adventure_places", adventureId],
    staleTime: STALE_10M,
    gcTime: GC_1H,
    queryFn: async (): Promise<AdventurePlace[]> => {
      const { data, error } = await supabase
        .from("adventure_places")
        .select("*, place:place_id(*)")
        .eq("adventure_id", adventureId)
        .order("day_number", { ascending: true })
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as AdventurePlace[];
    },
  });

export const guidesQuery = queryOptions({
  queryKey: ["guides"],
  staleTime: STALE_10M,
  gcTime: GC_1H,
  queryFn: async (): Promise<Guide[]> => {
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Guide[];
  },
});
