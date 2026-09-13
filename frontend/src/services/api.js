const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:8000" : "");

async function handleResponse(response, defaultErrorMsg) {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (!response.ok) {
      throw new Error(`Server returned error (${response.status}): ${response.statusText || "Backend waking up / unavailable"}`);
    }
    throw new Error("Invalid response format received from server");
  }

  if (!response.ok) {
    throw new Error(data.detail || defaultErrorMsg);
  }
  return data;
}

export async function registerUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return await handleResponse(response, "Registration failed");
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response, "Login failed");
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

  return await handleResponse(response, "Failed to create short URL");
}

export async function fetchMyUrls(token) {
  const response = await fetch(`${API_BASE_URL}/api/v1/urls/my-urls`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await handleResponse(response, "Failed to fetch URL history");
}
