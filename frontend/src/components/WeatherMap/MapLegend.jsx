import { WEATHER_LAYERS } from "../../services/weatherMapApi.js";

function MapLegend({ activeLayer }) {
  const layer = WEATHER_LAYERS[activeLayer];

  if (!layer || !layer.legend) return null;

  return (
    <div
      className="
        absolute
        bottom-6
        right-6
        z-[1000]
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
        px-4
        py-3
        shadow-lg
      "
    >
      <p className="text-xs text-gray-400 mb-2 font-medium">
        {layer.label}
      </p>

      <div className="flex items-center gap-3">
        {layer.legend.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <span
              className="w-4 h-4 rounded-full border border-white/20"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-[10px] text-gray-400 whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MapLegend;