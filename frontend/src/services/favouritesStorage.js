const STORAGE_KEY = "favourite_cities";

export function getFavourites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to read favourites:", error);
    return [];
  }
}

export function addFavourite(city) {
  const current = getFavourites();

  const exists = current.some(
    (c) => c.lat === city.lat && c.lon === city.lon
  );
  if (exists) return current;

  const updated = [...current, city];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeFavourite(lat, lon) {
  const current = getFavourites();
  const updated = current.filter((c) => !(c.lat === lat && c.lon === lon));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function isFavourite(lat, lon) {
  const current = getFavourites();
  return current.some((c) => c.lat === lat && c.lon === lon);
}