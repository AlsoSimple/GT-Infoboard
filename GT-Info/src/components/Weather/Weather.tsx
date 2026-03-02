
import ClearDayIcon from "../../assets/icons/ClearDayIcon.svg";
import PartlyCloudyDay from "../../assets/icons/PartlyCloudyDay.svg";
import cloudIcon from "../../assets/icons/cloudIcon.svg";
import FoggyIcon from "../../assets/icons/FoggyIcon.svg";
import RainyIcon from "../../assets/icons/RainyIcon.svg";
import SnowyIcon from "../../assets/icons/SnowyIcon.svg";
import { useFetch } from "../../hooks/useFetch.ts";

export function Weather() {


  const { data, isLoading, error } = useFetch<any>(
      'https://api.open-meteo.com/v1/forecast?latitude=57.048&longitude=9.9187&current_weather=true&timezone=auto'
    );
    console.log(data);
    if (isLoading) {
      return <h1>Loading data... {error}</h1>;
    }
  
    if (error) {
      return <h1>Error: {error}</h1>;
    }

  // Map weather codes to icons
  const weatherCodeToIcon: Record<number, string> = {
    0: ClearDayIcon, // Clear sky
    1: PartlyCloudyDay, // Mainly clear
    2: PartlyCloudyDay, // Partly cloudy
    3: cloudIcon, // Overcast
    45: FoggyIcon, // Fog
    48: FoggyIcon, // Depositing rime fog
    51: RainyIcon, // Light drizzle
    53: RainyIcon, // Moderate drizzle
    55: RainyIcon, // Dense drizzle
    56: RainyIcon, // Light freezing drizzle
    57: RainyIcon, // Dense freezing drizzle
    61: RainyIcon, // Slight rain
    63: RainyIcon, // Moderate rain
    65: RainyIcon, // Heavy rain
    66: RainyIcon, // Light freezing rain
    67: RainyIcon, // Heavy freezing rain
    71: SnowyIcon, // Slight snow fall
    73: SnowyIcon, // Moderate snow fall
    75: SnowyIcon, // Heavy snow fall
    77: SnowyIcon, // Snow grains
    80: RainyIcon, // Slight rain showers
    81: RainyIcon, // Moderate rain showers
    82: RainyIcon, // Violent rain showers
    85: SnowyIcon, // Slight snow showers
    86: SnowyIcon, // Heavy snow showers
    95: RainyIcon, // Thunderstorm
    96: RainyIcon, // Thunderstorm with slight hail
    99: RainyIcon, // Thunderstorm with heavy hail
  };

  const weatherCode = data?.current_weather?.weathercode;
  const weatherIcon = weatherCodeToIcon[weatherCode] || cloudIcon;

  return(
    <div>
      <img src={weatherIcon} alt="Weather icon" style={{ width: 64, height: 64, backgroundColor: "black"}} /> {/* styling is temporary */}
      <p>{data?.current_weather?.temperature}°C</p>
    </div>
  )
}

/* 
Weather codes:
0: Clear sky
1: Mainly clear
2: Partly cloudy
3: Overcast
45: Fog
48: Depositing rime fog
51: Light drizzle
53: Moderate drizzle
55: Dense drizzle
56: Light freezing drizzle
57: Dense freezing drizzle
61: Slight rain
63: Moderate rain
65: Heavy rain
66: Light freezing rain
67: Heavy freezing rain
71: Slight snow fall
73: Moderate snow fall
75: Heavy snow fall
77: Snow grains
80: Slight rain showers
81: Moderate rain showers
82: Violent rain showers
85: Slight snow showers
86: Heavy snow showers
95: Thunderstorm
96: Thunderstorm with slight hail
99: Thunderstorm with heavy hail */