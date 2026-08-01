const STORAGE_KEY = "atmosai_last_location";
const SNAP_DISTANCE_KM = 2; 

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getStoredLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeLocation(lat, lon, accuracy) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lat, lon, accuracy })
    );
  } catch {
    // localStorage unavailable — no-op
  }
}

export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const freshLat = position.coords.latitude;
        const freshLon = position.coords.longitude;
        const freshAccuracy = position.coords.accuracy;

        const stored = getStoredLocation();

        if (stored) {
          const distance = getDistanceKm(
            stored.lat,
            stored.lon,
            freshLat,
            freshLon
          );

          if (distance <= SNAP_DISTANCE_KM && freshAccuracy >= stored.accuracy) {
            resolve({
              lat: stored.lat,
              lon: stored.lon,
              accuracy: stored.accuracy,
            });
            return;
          }
        }

        storeLocation(freshLat, freshLon, freshAccuracy);

        resolve({
          lat: freshLat,
          lon: freshLon,
          accuracy: freshAccuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        // Ask the device to use GPS/WiFi-based positioning instead of
        // coarse IP/network-based lookup, wherever the hardware supports it.
        enableHighAccuracy: true,
        // Give it enough time to get a GPS fix instead of failing fast
        timeout: 15000,
        // Don't reuse a cached position — always get a fresh reading
        maximumAge: 0,
      }
    );
  });
}