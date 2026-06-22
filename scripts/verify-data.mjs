import { createClient } from "@supabase/supabase-js";

// Load env
import fs from "fs";
const envPath = ".env";
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const sep = trimmed.indexOf("=");
      if (sep > 0) {
        let value = trimmed.slice(sep + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[trimmed.slice(0, sep).trim()] = value;
      }
    }
  }
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const { data: adventures, error } = await supabase
  .from("adventures")
  .select("title, slug, category, price, duration, difficulty")
  .order("sort_order");

if (error) {
  console.error("Error:", error);
  process.exit(1);
}

console.log(`\n=== Adventures (${adventures.length} total) ===\n`);
for (const a of adventures) {
  console.log(`${a.category.padEnd(10)} ${a.title.padEnd(50)} ${(a.price || "").padEnd(10)} ${a.duration.padEnd(12)} ${a.difficulty}`);
}

const { data: newTours } = await supabase
  .from("adventures")
  .select("title, slug")
  .in("slug", ["kathmandu-valley-day-tour", "chisapani-nagarkot-hike", "pokhara-tour", "chitwan-national-park-tour"]);

console.log(`\n=== Tours imported: ${newTours?.length || 0} ===`);
for (const t of newTours || []) {
  console.log(`  ✓ ${t.title} (${t.slug})`);
}

const { data: newTreks } = await supabase
  .from("adventures")
  .select("title, slug")
  .in("slug", ["gosaikunda-lake-trek", "tamang-heritage-trek", "helambu-trek", "annapurna-base-camp", "mardi-himal-base-camp", "gokyo-lake-trek", "everest-base-camp-helicopter-return", "tsum-valley-trek", "khopra-ridge-trek", "kanchenjunga-circuit-trek", "upper-dolpo-circuit-trek", "makalu-base-camp-trek", "dhaulagiri-circuit-trek", "rara-lake-trek", "ganesh-himal-base-camp"]);

console.log(`\n=== New treks imported: ${newTreks?.length || 0} ===`);
for (const t of newTreks || []) {
  console.log(`  ✓ ${t.title} (${t.slug})`);
}

// Check highlights for a specific trek
const { data: abc } = await supabase
  .from("adventures")
  .select("highlights, itinerary")
  .eq("slug", "annapurna-base-camp")
  .single();

if (abc) {
  console.log(`\n=== Annapurna Base Camp Highlights (${abc.highlights?.length || 0} items) ===`);
  for (const h of abc.highlights || []) {
    console.log(`  • ${h}`);
  }
}
