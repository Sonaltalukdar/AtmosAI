import { WEATHER_LAYERS } from "../../services/weatherMapApi.js";

function MapLegend({ activeLayer }) {
  const layer = WEATHER_LAYERS[activeLayer];

  if (!layer || !layer.legend) return null;

  return (
    <div
      className="
        absolute
        top-[168px]
        right-3
        bottom-auto
        left-auto
        sm:top-auto
        sm:bottom-6
        sm:right-6
        z-[1000]
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
        px-3
        py-2.5
        sm:px-4
        sm:py-3
        shadow-lg
      "
    >
      <p className="text-[11px] sm:text-xs text-gray-400 mb-1.5 sm:mb-2 font-medium">
        {layer.label}
      </p>

      <div className="flex items-center gap-2 sm:gap-3">
        {layer.legend.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <span
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white/20"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-[9px] sm:text-[10px] text-gray-400 whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MapLegend;