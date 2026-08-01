import { Marker } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin } from "lucide-react";

function createCustomIcon() {
  const iconMarkup = renderToStaticMarkup(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "rgba(56, 189, 248, 0.15)",
        border: "2px solid rgba(56, 189, 248, 0.6)",
        boxShadow: "0 0 12px rgba(56, 189, 248, 0.5)",
        backdropFilter: "blur(6px)",
      }}
    >
      <MapPin size={18} color="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function MapMarker({ position, onClick }) {
  if (!position) return null;

  return (
    <Marker
      position={[position.lat, position.lon]}
      icon={createCustomIcon()}
      eventHandlers={{
        click: () => onClick && onClick(position),
      }}
    />
  );
}

export default MapMarker;