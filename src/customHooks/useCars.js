import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * useCars Hook
 * Handles fetching, filtering, pagination, and sessionStorage caching.
 */
export function useCars({ searchTerm, page = 1, limit = 10, filters = {} }) {
  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    // -------------------------------------------------------------------------

    const API_BASE_URL =
      window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://ebucars-car-dealership-website.onrender.com";

    if (pathname === "/search_page") {
      if (searchTerm === "" || searchTerm === undefined) {
        setCars([]);
        setTotal(0);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setCars([]); // Clear old cars so the user doesn't see "ghost" data

    // -------------------------------------------------------------------------
    // 1. GENERATE UNIQUE CACHE KEY
    // We combine every single search parameter into one string.
    // This ensures 'Page 1 of Toyota' doesn't accidentally show 'Page 1 of Ford'.
    // -------------------------------------------------------------------------
    const cacheKey = `cars_cache_${searchTerm}_p:${page}_br:${filters?.brand}_con:${filters?.condition}_min:${filters?.minPrice}_max:${filters?.maxPrice}`;

    async function fetchData() {
      // -------------------------------------------------------------------------
      // 2. CHECK SESSION STORAGE (The "Speed Boost")
      // Before hitting the internet, check if we already have this exact result.
      // -------------------------------------------------------------------------
      const cachedData = sessionStorage.getItem(cacheKey);

      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        console.log("PARSED CACHED DATA: ", cacheKey, parsed);
        setCars(parsed.cars);
        setTotal(parsed.total);
        setLoading(false); // No spinner needed for cached data
        setError(null);
        return; // EXIT EARLY - We don't need to call the API
      }

      // -------------------------------------------------------------------------
      // 3. PREPARE FOR API CALL
      // If we got here, it means we don't have a cache. Show the spinner.

      try {
        // Build the base Go Backend URL
        let url = `${API_BASE_URL}/cars?search=${searchTerm}&page=${page}&limit=${limit}`;

        // Append filters only if they actually exist
        if (filters?.condition) {
          url += `&condition=${filters.condition}`;
        }

        if (filters?.brand) {
          // encodeURIComponent makes "Land Rover" safe for URLs as "Land%20Rover"
          url += `&brand=${encodeURIComponent(
            filters.brand.toLowerCase().trim()
          )}`;
        }

        if (filters?.maxPrice) url += `&maxPrice=${filters.maxPrice}`;
        if (filters?.minPrice) url += `&minPrice=${filters.minPrice}`;

        // Send the request to our Go Backend
        const res = await fetch(url);

        console.log("RAW RESULTS: ", res);

        // 404 means the Go backend successfully checked but found nothing
        if (res.status === 404) {
          setCars([]);
          setTotal(0);
          return;
        }

        if (!res.ok) throw new Error("Server error. Could not fetch cars");

        const data = await res.json();

        console.log("DATA JSON: ", data);

        // -------------------------------------------------------------------------
        // 4. SAVE TO CACHE
        // We store the 'cars' array AND the 'total' string so pagination works too.
        // -------------------------------------------------------------------------
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({
            cars: data.cars || [],
            total: data.total || 0,
          })
        );

        // Update React state with fresh data
        setCars(data.cars || []);
        setTotal(data.total || 0);
        setError(null);
      } catch (err) {
        console.log("Hook Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false); // Turn off spinner whether we succeeded or failed
      }
    }

    fetchData();

    // -------------------------------------------------------------------------
    // 5. DEPENDENCY ARRAY
    // The hook "wakes up" and re-runs if ANY of these values change.
    // -------------------------------------------------------------------------
  }, [
    searchTerm,
    page,
    limit,
    filters?.condition,
    filters?.brand,
    filters?.maxPrice,
    filters?.minPrice,
  ]);

  // Return the data so the component (AllCars.jsx) can use it
  return { cars, total, loading, error };
}
