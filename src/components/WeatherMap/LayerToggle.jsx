import { Thermometer, Wind, CloudRain, Cloud, Gauge } from "lucide-react";

const LAYER_OPTIONS = [
  { key: "temp", label: "Temp", icon: Thermometer },
  { key: "wind", label: "Wind", icon: Wind },
  { key: "precipitation", label: "Rain", icon: CloudRain },
  { key: "clouds", label: "Clouds", icon: Cloud },
  { key: "aqi", label: "AQI", icon: Gauge },
];

function LayerToggle({ activeLayer, onChange }) {
  return (
    <div
      className="
        absolute
        top-6
        left-1/2
        -translate-x-1/2
        z-[1000]
        flex
        items-center
        gap-2
        rounded-full
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
        px-2
        py-2
        shadow-lg
      "
    >
      {LAYER_OPTIONS.map(({ key, label, icon: Icon }) => {
        const isActive = activeLayer === key;

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`
              flex
              items-center
              gap-1.5
              rounded-full
              px-3.5
              py-1.5
              text-[13px]
              transition-all
              duration-300
              cursor-pointer
              ${
                isActive
                  ? "bg-white/[0.1] border border-sky-400/40 text-white"
                  : "border border-transparent text-gray-400 hover:bg-white/[0.06] hover:text-white"
              }
            `}
          >
            <Icon
              size={14}
              className={isActive ? "text-sky-400" : "text-gray-400"}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default LayerToggle;