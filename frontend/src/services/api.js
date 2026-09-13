const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function registerUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Registration failed");
  }
  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }
  return data.access_token;
}

export async function createShortUrl(token, originalUrl, expiresAt = null) {
  const payload = { original_url: originalUrl };
  if (expiresAt) {
    payload.expires_at = new Date(expiresAt).toISOString();
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/urls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to create short URL");
  }
  return data;
}

export async function fetchMyUrls(token) {
  const response = await fetch(`${API_BASE_URL}/api/v1/urls/my-urls`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch URL history");
  }
  return data;
}
