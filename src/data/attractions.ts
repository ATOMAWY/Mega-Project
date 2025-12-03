const API_URL = import.meta.env.VITE_API;

// Fetch attractions from API with error handling
let attractions = [];

try {
  const response = await fetch(`${API_URL}/api/places`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Error fetching attractions data:", response.statusText);
    throw new Error(`Failed to fetch attractions: ${response.statusText}`);
  }

  const data = await response.json();
  attractions = Array.isArray(data) ? data : [];
} catch (error) {
  console.error("Error fetching attractions from API:", error);
  console.warn("Using empty array as fallback. Please check:");
  console.warn("1. Backend server is running at", API_URL);
  console.warn("2. CORS is properly configured on the backend");
  console.warn("3. API endpoint is correct:", `${API_URL}/api/places`);
  attractions = [];
}

export { attractions };
