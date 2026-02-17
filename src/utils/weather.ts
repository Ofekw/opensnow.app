/**
 * WMO Weather interpretation codes → human label + emoji icon.
 * https://open-meteo.com/en/docs#weathervariables
 */

interface WeatherDesc {
  label: string;
  icon: string;
}

const WMO_MAP: Record<number, WeatherDesc> = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Dense drizzle', icon: '🌧️' },
  56: { label: 'Light freezing drizzle', icon: '🌧️' },
  57: { label: 'Freezing drizzle', icon: '🌧️' },
  61: { label: 'Slight rain', icon: '🌦️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  66: { label: 'Light freezing rain', icon: '🌧️' },
  67: { label: 'Freezing rain', icon: '🌧️' },
  71: { label: 'Slight snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '🌨️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  77: { label: 'Snow grains', icon: '❄️' },
  80: { label: 'Slight rain showers', icon: '🌦️' },
  81: { label: 'Rain showers', icon: '🌧️' },
  82: { label: 'Violent rain showers', icon: '🌧️' },
  85: { label: 'Slight snow showers', icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '❄️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm w/ hail', icon: '⛈️' },
  99: { label: 'Thunderstorm w/ heavy hail', icon: '⛈️' },
};

export function weatherDescription(code: number): WeatherDesc {
  return WMO_MAP[code] ?? { label: `Code ${code}`, icon: '❓' };
}

/** Format temperature for display */
export function fmtTemp(celsius: number, unit: 'C' | 'F' = 'F'): string {
  if (unit === 'F') {
    return `${Math.round(celsius * 9 / 5 + 32)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

/** Format elevation for display */
export function fmtElevation(meters: number, unit: 'ft' | 'm' = 'ft'): string {
  if (unit === 'ft') {
    return `${Math.round(meters * 3.28084).toLocaleString()}ft`;
  }
  return `${Math.round(meters).toLocaleString()}m`;
}

/** cm → inches */
export function cmToIn(cm: number): number {
  return cm / 2.54;
}

/** Format snowfall for display */
export function fmtSnow(cm: number, unit: 'in' | 'cm' = 'in'): string {
  if (unit === 'in') {
    return `${cmToIn(cm).toFixed(1)}"`;
  }
  return `${cm.toFixed(1)}cm`;
}

/**
 * Calculate rain dot rating (0-3 dots) based on rain amount in inches
 * 0 dots: no rain
 * 1 dot: 0" to 0.1"
 * 2 dots: 0.1" to 0.5"
 * 3 dots: > 0.5"
 */
export function getRainDotRating(rainInches: number): number {
  if (rainInches <= 0) return 0;
  if (rainInches <= 0.1) return 1;
  if (rainInches <= 0.5) return 2;
  return 3;
}
