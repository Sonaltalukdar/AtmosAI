import { useEffect, useState, useRef, useCallback } from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Rectangle,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { WEATHER_LAYERS, getAQIAtPoint } from "../../services/weatherMapApi.js";

// Default marker icon fix (Leaflet + Vite/Webpack bundling issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// OpenWeatherMap air_pollution API returns aqi index 1-5 (1=Good ... 5=Very Poor)
// Map that onto our 4-tier legend (Good / Moderate / Unhealthy / Hazardous)
function getAQIColor(aqi) {
  switch (aqi) {
    case 1:
      return "#22c55e"; // Good
    case 2:
      return "#eab308"; // Moderate (Fair)
    case 3:
      return "#eab308"; // Moderate
    case 4:
      return "#f97316"; // Unhealthy (Poor)
    case 5:
      return "#ef4444"; // Hazardous (Very Poor)
    default:
      return "#6b7280"; // unknown
  }
}

// Helper: map-er view programmatically change korte (search/current-location theke)
function FlyToLocation({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lon], 10, { duration: 1.2 });
    }
  }, [position, map]);

  return null;
}

// Helper: map click event capture korte
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

// Helper: container resize hole ba initial mount-e map size thik na thakle fix kore
function MapResizeFix() {
  const map = useMap();

  useEffect(() => {
    // initial mount-e thoda delay diye invalidate koro (layout settle howar por)
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // window resize hole o recalculate koro
    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
}

// AQI-er nijer tile na thakay, visible map area-e amra 2-step kore full
// coverage banai:
//  1) Ekta halka (sparse) SAMPLE_COLS x SAMPLE_ROWS grid-e actual API call
//     kore AQI value niye asha hoy (API rate-limit-bandhu).
//  2) Purota visible area-ke onek chhoto FILL_COLS x FILL_ROWS square-e
//     bhag kora hoy, ar protyek chhoto square-ke tar sobcheye kachhakachhi
//     sample point-er color deওয়া hoy (nearest-neighbor) — ফলে wind/temp
//     tile layer-er moto কোনো gap chhara পুরো এলাকা ঢaka thake।
const SAMPLE_COLS = 8;
const SAMPLE_ROWS = 6;
const FILL_COLS = 26;
const FILL_ROWS = 18;
const REFETCH_DEBOUNCE_MS = 600;

function AQIOverlay({ active }) {
  const map = useMap();
  const [samples, setSamples] = useState([]);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const loadSamples = useCallback(async () => {
    if (!active) return;

    const bounds = map.getBounds();
    const north = bounds.getNorth();
    const south = bounds.getSouth();
    const east = bounds.getEast();
    const west = bounds.getWest();

    const latStep = (north - south) / (SAMPLE_ROWS - 1 || 1);
    const lonStep = (east - west) / (SAMPLE_COLS - 1 || 1);

    const gridPoints = [];
    for (let r = 0; r < SAMPLE_ROWS; r++) {
      for (let c = 0; c < SAMPLE_COLS; c++) {
        gridPoints.push({
          lat: south + latStep * r,
          lon: west + lonStep * c,
        });
      }
    }

    const currentRequestId = ++requestIdRef.current;

    try {
      const results = await Promise.all(
        gridPoints.map(async (p) => {
          try {
            const data = await getAQIAtPoint(p.lat, p.lon);
            const aqi = data?.list?.[0]?.main?.aqi;
            return { ...p, aqi };
          } catch {
            return { ...p, aqi: null };
          }
        })
      );

      if (currentRequestId === requestIdRef.current) {
        setSamples(results.filter((p) => p.aqi));
      }
    } catch (error) {
      console.error("Failed to load AQI samples:", error);
    }
  }, [map, active]);

  useEffect(() => {
    if (!active) {
      setSamples([]);
      return;
    }

    loadSamples();

    const scheduleReload = () => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(loadSamples, REFETCH_DEBOUNCE_MS);
    };

    map.on("moveend", scheduleReload);
    map.on("zoomend", scheduleReload);

    return () => {
      clearTimeout(debounceRef.current);
      map.off("moveend", scheduleReload);
      map.off("zoomend", scheduleReload);
    };
  }, [active, map, loadSamples]);

  if (!active || samples.length === 0) return null;

  const bounds = map.getBounds();
  const north = bounds.getNorth();
  const south = bounds.getSouth();
  const east = bounds.getEast();
  const west = bounds.getWest();

  const cellLatSize = (north - south) / FILL_ROWS;
  const cellLonSize = (east - west) / FILL_COLS;

  const cells = [];
  for (let r = 0; r < FILL_ROWS; r++) {
    for (let c = 0; c < FILL_COLS; c++) {
      const cellLat = south + cellLatSize * (r + 0.5);
      const cellLon = west + cellLonSize * (c + 0.5);

      // nearest sample point (simple squared-distance search)
      let nearest = samples[0];
      let bestDist = Infinity;
      for (const s of samples) {
        const dLat = s.lat - cellLat;
        const dLon = s.lon - cellLon;
        const dist = dLat * dLat + dLon * dLon;
        if (dist < bestDist) {
          bestDist = dist;
          nearest = s;
        }
      }

      const cellBounds = [
        [south + cellLatSize * r, west + cellLonSize * c],
        [south + cellLatSize * (r + 1), west + cellLonSize * (c + 1)],
      ];

      cells.push({
        bounds: cellBounds,
        color: getAQIColor(nearest.aqi),
      });
    }
  }

  return (
    <>
      {cells.map((cell, i) => (
        <Rectangle
          key={i}
          bounds={cell.bounds}
          pathOptions={{
            color: "transparent",
            fillColor: cell.color,
            fillOpacity: 0.4,
            weight: 0,
          }}
        />
      ))}
    </>
  );
}

function MapContainer({
  activeLayer,
  flyToPosition,
  markerPosition,
  onMapClick,
}) {
  const layer = WEATHER_LAYERS[activeLayer];

  return (
    <LeafletMap
      center={[22.5726, 88.3639]} // default center (Kolkata) — user location ashle override hobe
      zoom={6}
      zoomControl={false}
      attributionControl={false}
      style={{ width: "100%", height: "100%", background: "#0a0a0f" }}
      whenReady={(map) => map.target.invalidateSize()}
    >
      {/* Dark base map tiles */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* Weather overlay tile (temp/wind/precipitation/clouds) — AQI-er nijer tile nei */}
      {layer?.tileUrl && (
        <TileLayer url={layer.tileUrl} opacity={0.6} key={activeLayer} />
      )}

      {/* AQI-er jonyo dense square grid overlay (full coverage, tile na thakay) */}
      <AQIOverlay active={activeLayer === "aqi"} />

      {/* Selected/searched location marker */}
      {markerPosition && (
        <Marker position={[markerPosition.lat, markerPosition.lon]} />
      )}

      <FlyToLocation position={flyToPosition} />
      <ClickHandler onMapClick={onMapClick} />
      <MapResizeFix />
    </LeafletMap>
  );
}

export default MapContainer;