import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

import AddFavouriteBar from "../components/Favourites/AddFavouriteBar.jsx";
import FavouriteCard from "../components/Favourites/FavouriteCard.jsx";

import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from "../services/favouritesStorage.js";
import {
  getWeatherAtPoint,
} from "../services/weatherMapApi.js";
import {
  getWeatherByCoords,
  getForecastByCoords,
} from "../services/weatherApi.js";
import { useWeatherCondition } from "../Context/WeatherContext.jsx";

function Favourites() {
  const navigate = useNavigate();
  const { setWeatherData, setForecastData } = useWeatherCondition();

  const [favourites, setFavourites] = useState([]);
  const [weatherMap, setWeatherMap] = useState({});
  const [loadingKeys, setLoadingKeys] = useState({});
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    setFavourites(getFavourites());
  }, []);

  useEffect(() => {
    favourites.forEach((city) => {
      const key = `${city.lat},${city.lon}`;
      if (weatherMap[key]) return;

      setLoadingKeys((prev) => ({ ...prev, [key]: true }));

      getWeatherAtPoint(city.lat, city.lon)
        .then((data) => {
          setWeatherMap((prev) => ({ ...prev, [key]: data }));
        })
        .catch((error) => {
          console.error("Failed to fetch weather for favourite:", error);
        })
        .finally(() => {
          setLoadingKeys((prev) => ({ ...prev, [key]: false }));
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favourites]);

  const handleAdd = (place) => {
    const city = {
      name: place.name,
      country: place.country,
      state: place.state,
      lat: place.lat,
      lon: place.lon,
    };
    const updated = addFavourite(city);
    setFavourites(updated);
  };

  const handleRemove = (lat, lon) => {
    const updated = removeFavourite(lat, lon);
    setFavourites(updated);
  };

  // Favourite card select korle — weather fetch kore Home-e navigate kora hoy,
  // Home-er nijer current-location auto-load-ke skip korte state-e flag pathano hoy.
  const handleSelect = async (city) => {
    if (selecting) return;
    setSelecting(true);

    try {
      const weather = await getWeatherByCoords(city.lat, city.lon);
      setWeatherData(weather);

      const forecast = await getForecastByCoords(city.lat, city.lon);
      setForecastData(forecast);

      navigate("/home", { state: { skipAutoLocation: true } });
    } catch (error) {
      console.error("Failed to load weather for selected favourite:", error);
    } finally {
      setSelecting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-6 pb-16 min-h-[70vh]">
      <div className="flex justify-center mb-8">
        <AddFavouriteBar onAdd={handleAdd} />
      </div>

      {favourites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24">
          <Star size={40} className="text-blue-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Favourites</h2>
          <p className="text-gray-500 max-w-sm">
            Save your favourite cities here for quick access. Search and add
            a city above to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favourites.map((city) => {
            const key = `${city.lat},${city.lon}`;
            return (
              <FavouriteCard
                key={key}
                city={city}
                weather={weatherMap[key]}
                loading={loadingKeys[key]}
                onRemove={handleRemove}
                onSelect={handleSelect}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Favourites;