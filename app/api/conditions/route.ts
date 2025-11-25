// app/api/conditions/route.ts
import { NextResponse } from "next/server";

/**
 * Live weather for Coastal Beach Company using Open-Meteo.
 * Returns blended top-level “current” fields + per-location slices (30A / PCB),
 * and compact hourly/daily arrays for your forecast strip.
 */

type Hourly = {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  windspeed_10m: number[];
  winddirection_10m: number[];
  uv_index: number[];
  precipitation_probability: number[];
  weathercode: number[];
  is_day: number[];
};

type Daily = {
  time: string[];
  sunrise: string[];
  sunset: string[];
};

type OMResponse = {
  timezone: string;
  hourly: Hourly;
  daily: Daily;
};

type Slice = {
  tempF: number | null;
  feelsF: number | null;
  windMph: number | null;
  windDeg: number | null;
  uv: number | null;
  rainChancePct: number | null;
  sunrise: string | null;
  sunset: string | null;
};

function f(n: number | null | undefined) {
  return n == null || !Number.isFinite(n) ? null : Math.round(n);
}
function fmtTimeLocal(iso?: string | null) {
  if (!iso) return null;
  // local short time like "6:41 AM"
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function nearestHourIndex(times: string[], now = new Date()) {
  // pick the index with minimum |t - now|
  let best = 0;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (let i = 0; i < times.length; i++) {
    const t = new Date(times[i]).getTime();
    const diff = Math.abs(t - now.getTime());
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return best;
}

function sliceFrom(om: OMResponse): Slice {
  const i = nearestHourIndex(om.hourly.time);
  const next3 = [i, i + 1, i + 2].filter((x) => x < om.hourly.time.length);

  const rainMax = next3.reduce((m, idx) => {
    const v = om.hourly.precipitation_probability[idx];
    return Math.max(m, Number.isFinite(v) ? v : 0);
  }, 0);

  // daily sunrise/sunset – pick first day in the feed
  const sunrise = fmtTimeLocal(om.daily.sunrise?.[0] ?? null);
  const sunset = fmtTimeLocal(om.daily.sunset?.[0] ?? null);

  return {
    tempF: f(cToF(om.hourly.temperature_2m[i])),
    feelsF: f(cToF(om.hourly.apparent_temperature[i])),
    windMph: f(om.hourly.windspeed_10m[i]), // we request mph below
    windDeg: f(om.hourly.winddirection_10m[i]),
    uv: f(om.hourly.uv_index[i]),
    rainChancePct: f(rainMax),
    sunrise,
    sunset,
  };
}

function mapHourly(om: OMResponse, take = 7) {
  const out = [];
  const i0 = nearestHourIndex(om.hourly.time);
  for (let k = 0; k < take && i0 + k < om.hourly.time.length; k++) {
    const i = i0 + k;
    out.push({
      time: om.hourly.time[i],
      tempF: f(cToF(om.hourly.temperature_2m[i])),
      windMph: f(om.hourly.windspeed_10m[i]),
      precipPct: f(om.hourly.precipitation_probability[i]),
      uv: f(om.hourly.uv_index[i]),
      weathercode: om.hourly.weathercode[i] ?? null,
      isDay: om.hourly.is_day[i] ?? 1,
    });
  }
  return out;
}

function mapDaily(om: OMResponse, take = 7) {
  // Use daily sunrise/sunset and the daily high temp derived from hours per day (simple)
  const out = [];
  for (let d = 0; d < take && d < om.daily.time.length; d++) {
    out.push({
      date: om.daily.time[d],
      sunrise: fmtTimeLocal(om.daily.sunrise?.[d] ?? null),
      sunset: fmtTimeLocal(om.daily.sunset?.[d] ?? null),
    });
  }
  return out;
}

function cToF(c: number | null | undefined) {
  if (c == null || !Number.isFinite(c)) return null;
  return (c * 9) / 5 + 32;
}

const SW = { lat: 30.396, lon: -86.228 }; // South Walton (30A)
const PCB = { lat: 30.176, lon: -85.805 }; // Panama City Beach

async function fetchOM(lat: number, lon: number): Promise<OMResponse> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    timezone: "auto",
    windspeed_unit: "mph",
    hourly: [
      "temperature_2m",
      "apparent_temperature",
      "windspeed_10m",
      "winddirection_10m",
      "uv_index",
      "precipitation_probability",
      "weathercode",
      "is_day",
    ].join(","),
    daily: ["sunrise", "sunset"].join(","),
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const r = await fetch(url, { next: { revalidate: 300 } });
  if (!r.ok) {
    throw new Error(`Open-Meteo ${r.status}`);
  }
  return (await r.json()) as OMResponse;
}

export async function GET() {
  try {
    const [sw, pcb] = await Promise.all([
      fetchOM(SW.lat, SW.lon),
      fetchOM(PCB.lat, PCB.lon),
    ]);

    const cur30a = sliceFrom(sw);
    const curPcb = sliceFrom(pcb);

    // blended = prefer 30A; if something is missing, fall back to PCB
    const blended: Slice = {
      tempF: cur30a.tempF ?? curPcb.tempF,
      feelsF: cur30a.feelsF ?? curPcb.feelsF,
      windMph: cur30a.windMph ?? curPcb.windMph,
      windDeg: cur30a.windDeg ?? curPcb.windDeg,
      uv: cur30a.uv ?? curPcb.uv,
      rainChancePct: cur30a.rainChancePct ?? curPcb.rainChancePct,
      sunrise: cur30a.sunrise ?? curPcb.sunrise,
      sunset: cur30a.sunset ?? curPcb.sunset,
    };

    const payload = {
      lastUpdated: new Date().toISOString(),
      // top-level current (what your card reads as fallback)
      ...blended,
      // per-location current
      current30a: cur30a,
      currentPcb: curPcb,
      // hourly/daily for the strip (both locations)
      hourly30a: mapHourly(sw, 7),
      hourlyPcb: mapHourly(pcb, 7),
      daily30a: mapDaily(sw, 7),
      dailyPcb: mapDaily(pcb, 7),
      __conditions_api_version: "COASTAL-v3",
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: String(err?.message ?? err),
        lastUpdated: new Date().toISOString(),
      },
      { status: 502 }
    );
  }
}