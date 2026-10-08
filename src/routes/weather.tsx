import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CloudSun,
  Droplets,
  Wind,
  Search,
  Thermometer,
  CloudRain,
  Sun,
  Cloud,
  CloudSnow,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Weather Dashboard — React Toolkit" },
      {
        name: "description",
        content:
          "Search any city for temperature, humidity and wind conditions.",
      },
      { property: "og:title", content: "Weather Dashboard — React Toolkit" },
      {
        property: "og:description",
        content: "City search with temperature, humidity and wind.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WeatherPage,
});

const CONDITIONS = [
  { label: "Sunny", icon: Sun },
  { label: "Partly cloudy", icon: CloudSun },
  { label: "Overcast", icon: Cloud },
  { label: "Light rain", icon: CloudRain },
  { label: "Snow flurries", icon: CloudSnow },
] as const;

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function mockWeather(city: string) {
  const h = hashString(city.trim().toLowerCase());
  const temp = -5 + (h % 38); // -5..32 °C
  const condition = CONDITIONS[h % CONDITIONS.length]!;
  return {
    city: city.trim(),
    temp,
    feelsLike: temp - 2 + (h % 5),
    humidity: 30 + (h % 60),
    wind: 3 + (h % 38),
    windDir: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][h % 8],
    condition,
  };
}

function WeatherPage() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(() => mockWeather("Lisbon"));

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) setWeather(mockWeather(query));
  };

  const Icon = weather.condition.icon;

  return (
    <PageShell
      title="Weather Dashboard"
      description="Search a city to see its temperature, humidity and wind. Data is mocked locally for this demo."
    >
      <form onSubmit={search} className="flex max-w-md gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a city…"
            className="w-full rounded-xl border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Search
        </button>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-primary/25 bg-primary/10 p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {weather.city} · Now
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Icon className="size-12 text-primary" />
            <div>
              <p className="font-display text-6xl font-semibold leading-none">
                {weather.temp}°
                <span className="align-top text-2xl text-muted-foreground">
                  C
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {weather.condition.label} · feels {weather.feelsLike}°
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Droplets className="size-4" /> Humidity
            </span>
            <span className="font-mono text-lg">{weather.humidity}%</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wind className="size-4" /> Wind
            </span>
            <span className="font-mono text-lg">
              {weather.wind}{" "}
              <span className="text-sm text-muted-foreground">
                km/h {weather.windDir}
              </span>
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Thermometer className="size-4" /> Feels like
            </span>
            <span className="font-mono text-lg">{weather.feelsLike}°C</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
