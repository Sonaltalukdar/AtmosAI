import { useState, useRef, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { useWeatherCondition } from "../../Context/WeatherContext.jsx";
import { mockLocations, locationList } from "../../data/Location.js";

const Hero = () => {
  const { setWeatherData } = useWeatherCondition();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = locationList.filter((loc) =>
    loc.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (key, label) => {
    setWeatherData(mockLocations[key]);
    setQuery(label);
    setOpen(false);
  };

  return (
    <div className="flex-1 max-w-xl flex flex-col justify-center h-full">
      {/* Tagline */}

      <p className="hero-fade-1 flex items-center gap-2 text-blue-400 font-medium mb-3">
        AI Powered Weather Forecast
      </p>

      {/* Heading */}

      <h1 className="hero-fade-2 text-5xl md:text-6xl font-bold text-white leading-tight mb-8">
        Know Your Weather
        <br />
        <span className="text-blue-400">Instantly</span>
      </h1>

      {/* Search */}

      <div
        ref={wrapperRef}
        className="hero-fade-3 relative flex items-center gap-3 z-50"
      >
        {/* Search Box */}

        <div className="search-glow flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-full px-5 h-[46px] flex-1 backdrop-blur-xl">
          <Search
            size={18}
            className="text-gray-400 flex-shrink-0"
          />

          <input
            type="text"
            value={query}
            placeholder="Search for city..."
            onClick={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            className="bg-transparent outline-none w-full h-full text-white placeholder-gray-500 text-[15px]"
          />
        </div>

        {/* Location Button */}

        <button className="btn-lift shine location-pulse flex items-center gap-2 bg-white/[0.05] border border-sky-400/30 rounded-full px-6 h-[46px] text-white text-[15px] font-medium backdrop-blur-xl hover:bg-white/[0.08] transition-all">
          <MapPin size={16} className="text-sky-400" />
          Use My Location
        </button>

        {/* Dropdown */}

        {open && (
          <div
            className="
              absolute
              left-0
              top-[58px]
              w-[calc(100%-172px)]
              rounded-2xl
              bg-[#0A0F1D]
              border
              border-slate-700
              shadow-[0_25px_60px_rgba(0,0,0,0.75)]
              overflow-hidden
              z-[9999]
            "
          >
            {filtered.length > 0 ? (
              filtered.map((loc) => (
                <button
                  key={loc.key}
                  onClick={() =>
                    handleSelect(loc.key, loc.label)
                  }
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-5
                    py-3.5
                    text-left
                    text-gray-200
                    hover:bg-sky-500/10
                    hover:text-sky-400
                    transition-all
                    duration-200
                  "
                >
                  <MapPin
                    size={14}
                    className="text-sky-400 shrink-0"
                  />

                  {loc.label}
                </button>
              ))
            ) : (
              <p className="px-5 py-4 text-sm text-gray-500">
                No matching city
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;