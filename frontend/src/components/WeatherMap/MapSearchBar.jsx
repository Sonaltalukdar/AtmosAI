import { useState } from "react";
import { Search, LocateFixed } from "lucide-react";
import { searchCity } from "../../services/weatherMapApi.js";

function MapSearchBar({ onLocationSelect, onUseCurrentLocation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setShowResults(true);

    try {
      const data = await searchCity(query);
      setResults(data);
    } catch (error) {
      console.error("City search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (place) => {
    onLocationSelect({
      lat: place.lat,
      lon: place.lon,
      name: place.name,
      country: place.country,
      state: place.state,
    });

    setQuery(`${place.name}${place.state ? ", " + place.state : ""}, ${place.country}`);
    setShowResults(false);
    setResults([]);
  };

  return (
    <div
      className="
        absolute
        top-6
        left-6
        z-[1000]
        w-full
        max-w-xs
      "
    >
      <form
        onSubmit={handleSearch}
        className="
          flex
          items-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-white/[0.04]
          backdrop-blur-xl
          px-4
          py-2.5
          shadow-lg
        "
      >
        <Search size={16} className="text-gray-400 shrink-0" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city"
          className="
            flex-1
            bg-transparent
            outline-none
            text-sm
            text-white
            placeholder:text-gray-500
          "
        />

        <button
          type="button"
          onClick={onUseCurrentLocation}
          className="
            shrink-0
            flex
            items-center
            justify-center
            w-7
            h-7
            rounded-full
            text-sky-400
            hover:bg-white/[0.08]
            transition-all
            duration-300
            cursor-pointer
          "
          title="Use current location"
        >
          <LocateFixed size={15} />
        </button>
      </form>

      {showResults && (
        <div
          className="
            mt-2
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            backdrop-blur-xl
            shadow-lg
            overflow-hidden
          "
        >
          {loading && (
            <p className="text-xs text-gray-400 px-4 py-3">Searching...</p>
          )}

          {!loading && results.length === 0 && (
            <p className="text-xs text-gray-400 px-4 py-3">No results found</p>
          )}

          {!loading &&
            results.map((place, index) => (
              <button
                key={index}
                onClick={() => handleSelectResult(place)}
                className="
                  w-full
                  text-left
                  px-4
                  py-2.5
                  text-sm
                  text-gray-300
                  hover:bg-white/[0.08]
                  hover:text-white
                  transition-all
                  duration-200
                  cursor-pointer
                  border-b
                  border-white/5
                  last:border-b-0
                "
              >
                {place.name}
                {place.state ? `, ${place.state}` : ""}, {place.country}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default MapSearchBar;