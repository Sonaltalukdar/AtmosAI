import { X, Droplets, Wind, Gauge } from "lucide-react";

function LocationInfoCard({ data, onClose, loading }) {
  if (!loading && !data) return null;

  return (
    <div
      className="
        absolute
        bottom-6
        left-6
        z-[1000]
        w-full
        max-w-xs
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
        shadow-lg
        p-4
      "
    >
      {loading ? (
        <div className="flex items-center gap-2 py-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
          <span className="text-xs text-gray-400 ml-1">Fetching weather...</span>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-white font-semibold text-base">
                {data.name}
                {data.sys?.country ? `, ${data.sys.country}` : ""}
              </h3>
              <p className="text-gray-400 text-xs capitalize">
                {data.weather?.[0]?.description}
              </p>
            </div>

            <button
              onClick={onClose}
              className="
                shrink-0
                w-6
                h-6
                flex
                items-center
                justify-center
                rounded-full
                text-gray-400
                hover:bg-white/[0.08]
                hover:text-white
                transition-all
                duration-200
                cursor-pointer
              "
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            {data.weather?.[0]?.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                alt={data.weather[0].description}
                className="w-12 h-12"
              />
            )}
            <span className="gradient-text-blue text-3xl font-bold">
              {Math.round(data.main?.temp)}°C
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1 rounded-xl bg-white/[0.03] py-2">
              <Droplets size={14} className="text-sky-400" />
              <span className="text-xs text-gray-300">{data.main?.humidity}%</span>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-xl bg-white/[0.03] py-2">
              <Wind size={14} className="text-sky-400" />
              <span className="text-xs text-gray-300">{data.wind?.speed} m/s</span>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-xl bg-white/[0.03] py-2">
              <Gauge size={14} className="text-sky-400" />
              <span className="text-xs text-gray-300">{data.main?.pressure} hPa</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LocationInfoCard;