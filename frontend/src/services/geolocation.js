const STORAGE_KEY = "atmosai_last_location";
const SNAP_DISTANCE_KM = 2;

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function getStoredLocation() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function storeLocation(lat, lon, accuracy) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lat,
        lon,
        accuracy,
      })
    );
  } catch {
    // Ignore localStorage errors
  }
}

export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        const stored = getStoredLocation();

        if (stored) {
          const distance = getDistanceKm(
            stored.lat,
            stored.lon,
            lat,
            lon
          );

          if (
            distance <= SNAP_DISTANCE_KM &&
            accuracy >= stored.accuracy
          ) {
            console.log("Using cached location");

            resolve({
              lat: stored.lat,
              lon: stored.lon,
              accuracy: stored.accuracy,
            });

            return;
          }
        }

        storeLocation(lat, lon, accuracy);

        console.log("Using fresh GPS location");

        resolve({
          lat,
          lon,
          accuracy,
        });
      },

      (error) => {
        console.error("Geolocation Error:", error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(
              new Error(
                "Location permission denied by user."
              )
            );
            break;

          case error.POSITION_UNAVAILABLE:
            reject(
              new Error(
                "Location information unavailable."
              )
            );
            break;

          case error.TIMEOUT:
            reject(
              new Error(
                "Location request timed out."
              )
            );
            break;

          default:
            reject(
              new Error(
                "Unable to get current location."
              )
            );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
}