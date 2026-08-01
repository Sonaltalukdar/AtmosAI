import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useWeatherCondition } from "../../Context/WeatherContext.jsx";
import { getWeatherByCoords, getForecastByCoords } from "../../services/weatherApi.js";
import { searchCity } from "../../services/weatherMapApi.js";

const SUGGESTION_DEBOUNCE_MS = 350;

const Searchbar = () => {
  const { setWeatherData, setForecastData } = useWeatherCondition();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  // Dropdown-er baire click korle bondho hobe
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Typing korar somoy debounce diye location suggestion fetch kora
  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      return;
    }

    setSuggestionsLoading(true);

    debounceRef.current = setTimeout(async () => {
      const currentRequestId = ++requestIdRef.current;

      try {
        const results = await searchCity(query.trim());

        if (currentRequestId === requestIdRef.current) {
          setSuggestions(results || []);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Location suggestion fetch failed:", err);
        if (currentRequestId === requestIdRef.current) {
          setSuggestions([]);
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setSuggestionsLoading(false);
        }
      }
    }, SUGGESTION_DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // displayName pass korle sheita diye weather.location override kora hoy,
  // jate user ja select korlo (e.g. "Kuntighat, IN") thikই dekhay —
  // backend/reverse-geocoding-er nearest-big-city name na dekhiye.
  const loadWeatherForCoords = async (lat, lon, displayName) => {
    setLoading(true);
    setError("");
    setShowDropdown(false);

    try {
      const data = await getWeatherByCoords(lat, lon);

      setWeatherData(
        displayName ? { ...data, location: displayName } : data
      );

      try {
        const forecast = await getForecastByCoords(lat, lon);
        setForecastData(forecast);
      } catch (forecastError) {
        console.error("Could not load forecast data:", forecastError);
      }

      setQuery("");
      setSuggestions([]);
    } catch (err) {
      setError("Could not load weather for this location");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    // Enter chaple, first suggestion thakle setai select kora hoy
    if (suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    }
  };

  const buildDisplayName = (place) => {
    return place.state
      ? `${place.name}, ${place.state}, ${place.country}`
      : `${place.name}, ${place.country}`;
  };

  const handleSelectSuggestion = (place) => {
    loadWeatherForCoords(place.lat, place.lon, buildDisplayName(place));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="search-glow flex items-center gap-2.5 bg-white/[0.05] border border-white/10 rounded-full px-4 h-[42px] w-full sm:w-[280px] backdrop-blur-xl">
        <Search size={16} className="text-gray-400 flex-shrink-0" />

        <input
          id="city-search-input"
          name="city-search"
          type="text"
          value={query}
          placeholder="Search for city"
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoComplete="off"
          className="bg-transparent outline-none w-full h-full text-white placeholder-gray-500 text-sm"
        />
      </div>

      {/* Suggestions dropdown */}
      {showDropdown && query.trim().length >= 2 && (
        <div
          className="
            absolute
            top-[50px]
            left-0
            w-[260px]
            sm:w-[320px]
            max-h-[280px]
            overflow-y-auto
            rounded-2xl
            bg-[#0A0F1D]
            border
            border-slate-700
            shadow-[0_25px_60px_rgba(0,0,0,0.75)]
            z-[999]
          "
        >
          {suggestionsLoading ? (
            <div className="flex items-center gap-2 px-4 py-3 text-gray-400 text-sm">
              <Loader2 size={14} className="animate-spin" />
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((place, i) => (
              <button
                key={`${place.lat}-${place.lon}-${i}`}
                onClick={() => handleSelectSuggestion(place)}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  text-gray-200
                  hover:bg-sky-500/10
                  hover:text-sky-400
                  transition-all
                  border-b
                  border-white/5
                  last:border-b-0
                "
              >
                <MapPin size={15} className="text-gray-400 shrink-0" />
                <span className="text-sm truncate">
                  {buildDisplayName(place)}
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-sm">No locations found</div>
          )}
        </div>
      )}

      {(loading || error) && (
        <div className="absolute top-[50px] left-0 w-full text-center">
          {loading && <p className="text-gray-400 text-xs">Loading weather...</p>}
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Searchbar;