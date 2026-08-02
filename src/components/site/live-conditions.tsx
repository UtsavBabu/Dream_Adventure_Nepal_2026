import { useEffect, useState } from "react";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Sunrise,
} from "lucide-react";

const SPOTS = [
  { name: "Everest Base Camp", sub: "Khumbu · 5,364 m", lat: 28.0, lon: 86.86 },
  { name: "Annapurna · Pokhara", sub: "Gandaki · 822 m", lat: 28.21, lon: 83.99 },
  { name: "Kathmandu", sub: "Valley · 1,400 m", lat: 27.71, lon: 85.32 },
];

type Spot = {
  current?: { temperature_2m?: number; weather_code?: number; wind_speed_10m?: number };
  daily?: { sunrise?: string[] };
};

function wx(code?: number): { label: string; Icon: typeof Sun } {
  if (code == null) return { label: "—", Icon: CloudSun };
  if (code === 0) return { label: "Clear skies", Icon: Sun };
  if (code <= 2) return { label: "Mostly clear", Icon: CloudSun };
  if (code === 3) return { label: "Overcast", Icon: Cloud };
  if (code <= 48) return { label: "Fog", Icon: CloudFog };
  if (code <= 67) return { label: "Rain", Icon: CloudRain };
  if (code <= 77) return { label: "Snow", Icon: CloudSnow };
  if (code <= 82) return { label: "Showers", Icon: CloudRain };
  if (code <= 86) return { label: "Snow", Icon: CloudSnow };
  return { label: "Thunderstorm", Icon: CloudLightning };
}

export function LiveConditions() {
  const [data, setData] = useState<Spot[] | null>(null);

  useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${SPOTS.map((s) => s.lat).join(",")}` +
      `&longitude=${SPOTS.map((s) => s.lon).join(",")}` +
      `&current=temperature_2m,weather_code,wind_speed_10m&daily=sunrise&timezone=Asia%2FKathmandu&forecast_days=1`;
    let alive = true;
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        if (alive) setData(Array.isArray(j) ? j : [j]);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mx-auto max-w-reading text-center">
          <div className="eyebrow">Right now in the Himalaya</div>
          <h2 className="mt-4 text-balance font-display text-h2 font-medium text-primary">
            The mountains are awake
          </h2>
          <p className="mt-4 text-subtitle text-muted-foreground">
            Live conditions from the peaks — the same skies your journey begins under.
          </p>
        </div>

        <div className="reveal stagger mt-14 grid gap-6 sm:grid-cols-3">
          {SPOTS.map((s, i) => {
            const d = data?.[i];
            const temp = d?.current?.temperature_2m;
            const { label, Icon } = wx(d?.current?.weather_code);
            const wind = d?.current?.wind_speed_10m;
            const sunrise = d?.daily?.sunrise?.[0]?.slice(11);
            const ready = temp != null;
            return (
              <div key={s.name} className="rounded-3xl border border-border bg-white p-7 shadow-glass">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display text-xl text-primary">{s.name}</div>
                    <div className="mt-0.5 text-caption uppercase tracking-wider text-muted-foreground">
                      {s.sub}
                    </div>
                  </div>
                  <Icon className={`h-8 w-8 ${ready ? "text-accent" : "text-border"}`} />
                </div>

                <div className="mt-6 flex items-end gap-3">
                  <div className="font-display text-5xl font-medium leading-none text-primary">
                    {ready ? `${Math.round(temp)}°` : <span className="text-border">—°</span>}
                  </div>
                  <div className="pb-1 text-small font-medium text-muted-foreground">
                    {ready ? label : "loading…"}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-5 border-t border-border pt-4 text-caption text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Wind className="h-3.5 w-3.5 text-accent" />
                    {wind != null ? `${Math.round(wind)} km/h` : "—"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Sunrise className="h-3.5 w-3.5 text-accent" />
                    {sunrise ? `Sunrise ${sunrise}` : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="reveal mt-6 text-center text-caption text-muted-foreground">
          <span className="relative mr-1.5 inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Live conditions · Asia/Kathmandu time
        </p>
      </div>
    </section>
  );
}
