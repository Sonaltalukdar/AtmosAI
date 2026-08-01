const API_BASE = "https://atmosai-80iq.onrender.com/api/auth";

export async function fetchProfile() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function updateProfile(data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update profile");
  return result;
}