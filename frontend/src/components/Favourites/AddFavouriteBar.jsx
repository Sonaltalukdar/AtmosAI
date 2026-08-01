import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { searchCity } from "../../services/weatherMapApi.js";

function AddFavouriteBar({ onAdd }) {
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

    const handleSelect = (place) => {
        onAdd(place);
        setQuery("");
        setResults([]);
        setShowResults(false);
    };

    return (
        <div className="relative w-full max-w-md">

            {/* Search Bar */}
            <form
                onSubmit={handleSearch}
                className="
                    flex
                    items-center
                    gap-2
                    w-full
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.04]
                    backdrop-blur-xl
                    px-3
                    sm:px-4
                    py-2.5
                    shadow-lg
                "
            >
                <Search
                    size={16}
                    className="
                        text-gray-400
                        shrink-0
                    "
                />

                <input
                    type="text"
                    value={query}
                    onChange={(e) =>
                        setQuery(e.target.value)
                    }
                    placeholder="Add cities to favourites"
                    className="
                        min-w-0
                        flex-1
                        bg-transparent
                        outline-none
                        text-[13px]
                        sm:text-sm
                        text-white
                        placeholder:text-gray-500
                    "
                />
            </form>


            {/* Search Results */}
            {showResults && (
                <div
                    className="
                        absolute
                        top-full
                        left-0
                        mt-2
                        w-full
                        max-h-60
                        overflow-y-auto
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#0d111c]/95
                        backdrop-blur-xl
                        shadow-lg
                        overflow-x-hidden
                        z-10
                    "
                >

                    {/* Loading */}
                    {loading && (
                        <p
                            className="
                                text-xs
                                text-gray-400
                                px-4
                                py-3
                            "
                        >
                            Searching...
                        </p>
                    )}


                    {/* No Results */}
                    {!loading &&
                        results.length === 0 && (
                            <p
                                className="
                                    text-xs
                                    text-gray-400
                                    px-4
                                    py-3
                                "
                            >
                                No results found
                            </p>
                        )}


                    {/* Results */}
                    {!loading &&
                        results.map((place, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    handleSelect(place)
                                }
                                className="
                                    w-full
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                    text-left
                                    px-3
                                    sm:px-4
                                    py-2.5
                                    text-[12px]
                                    sm:text-sm
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

                                <span
                                    className="
                                        min-w-0
                                        truncate
                                    "
                                >
                                    {place.name}
                                    {place.state
                                        ? `, ${place.state}`
                                        : ""}
                                    {place.country
                                        ? `, ${place.country}`
                                        : ""}
                                </span>

                                <Plus
                                    size={14}
                                    className="
                                        text-sky-400
                                        shrink-0
                                    "
                                />

                            </button>
                        ))}

                </div>
            )}

        </div>
    );
}

export default AddFavouriteBar;