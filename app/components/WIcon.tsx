// app/components/WIcon.tsx
import {
    WiDaySunny,
    WiNightClear,
    WiDayCloudy,
    WiNightAltCloudy,
    WiCloud,
    WiCloudy,
    WiFog,
    WiRain,
    WiShowers,
    WiThunderstorm,
    WiSnow,
    WiSleet,
  } from "react-icons/wi";
  
  /** Open-Meteo weathercode → polished icon (with night handling). */
  export function WIcon({
    code,
    night,
    size = 28,
  }: {
    code?: number | null;
    night?: boolean;
    size?: number;
  }) {
    if (code == null) return <WiCloud className="text-slate-400" size={size} />;
  
    if (code === 0)
      return night ? <WiNightClear size={size} /> : <WiDaySunny size={size} />;
    if (code === 1 || code === 2)
      return night ? (
        <WiNightAltCloudy size={size} />
      ) : (
        <WiDayCloudy size={size} />
      );
    if (code === 3) return <WiCloudy size={size} />;
    if (code === 45 || code === 48) return <WiFog size={size} />;
    if ([51, 53, 55].includes(code)) return <WiShowers size={size} />; // drizzle
    if ([56, 57].includes(code)) return <WiSleet size={size} />; // freezing drizzle
    if ([61, 63, 65, 80, 81, 82].includes(code)) return <WiRain size={size} />; // rain
    if ([66, 67].includes(code)) return <WiSleet size={size} />; // freezing rain
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <WiSnow size={size} />; // snow
    if ([95, 96, 99].includes(code)) return <WiThunderstorm size={size} />; // thunder
    return <WiCloud className="text-slate-400" size={size} />;
  }