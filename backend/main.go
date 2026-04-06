package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

// ----------------------
// 1. Define the Car structure
// ----------------------
// This is our "Blueprint." It tells Go exactly what fields a Car has
// so it can translate the database data into something Go understands.
type Car struct {
	ID           int      `json:"id"`
	Name         string   `json:"name"`
	Brand        string   `json:"brand"`
	Year         int      `json:"year"`
	Price        int      `json:"price"`
	Description  string   `json:"description"`
	Images       []string `json:"images"`
	Mileage      int      `json:"mileage"`
	Fuel         string   `json:"fuel"`
	Transmission string   `json:"transmission"`
	Engine       string   `json:"engine"`
	Color        string   `json:"color"`
	Condition    string   `json:"condition"`
	Availability string   `json:"availability"`
	Location     string   `json:"location"`
	Features     []string `json:"features"`
}

func main() {
	// ----------------------
	// 2. Load environment variables
	// ----------------------
	// We look for the .env.local file to get our secret keys.
	err := godotenv.Load(".env.local")
	if err != nil {
		log.Println(".env file not found, using system environment variables")
	}

	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_ANON_KEY")

	// If the keys are missing, the app stops immediately (log.Fatal).
	if supabaseURL == "" || supabaseKey == "" {
		log.Fatal("Missing SUPABASE_URL or SUPABASE_ANON_KEY")
	}

	// ----------------------
	// 3. Handler for fetching all cars (Search, Filter, Paginate)
	// ----------------------
	http.HandleFunc("/cars", func(w http.ResponseWriter, r *http.Request) {
		// Step 3a & 3b: Setup headers for CORS and JSON format
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")

		// Step 3c: Look at the URL to see what the user wants
		search := r.URL.Query().Get("search")
		condition := r.URL.Query().Get("condition") // NEW: Filters for New/Used
		brandFilter := r.URL.Query().Get("brand")   // NEW: Filters for specific Brands
		maxPrice := r.URL.Query().Get("maxPrice")
		minPrice := r.URL.Query().Get("minPrice")
		pageStr := r.URL.Query().Get("page")
		limitStr := r.URL.Query().Get("limit")

		// Step 3c-i: Set default numbers for pagination
		limit := 10
		page := 1

		// Convert URL text strings into whole numbers (integers)
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}

		// Step 3c-ii: Calculate how many cars to skip to get to the right page
		offset := (page - 1) * limit

		client := &http.Client{}

		// Step 3e: Start building the "Ask" for Supabase
		targetUrl := supabaseURL + "?select=*"


		// Filter for Search (Name/Brand)
		if search != "" {
			// We use * for wildcards and url.QueryEscape the whole filter group
			// This handles the space in "Land Rover" correctly for Supabase
			filter := fmt.Sprintf("(name.ilike.*%s*,brand.ilike.*%s*)", search, search)
			targetUrl += "&or=" + url.QueryEscape(filter)
		}

		// Filter for Condition (New/Used)
		if condition != "" {
			targetUrl += fmt.Sprintf("&condition=eq.%s", condition)
		}

		// Filter for Brand (Toyota/Ford/etc.)
		if brandFilter != "" {
		// This turns "land rover" into "land+rover" or "land%20rover"
		// which Supabase understands perfectly.
		safeBrand := url.QueryEscape(brandFilter)
		targetUrl += fmt.Sprintf("&brand=ilike.*%s*", safeBrand)
		}

		//  If the user provided a price limit, add it to the Supabase URL
		if maxPrice != "" {
		targetUrl += fmt.Sprintf("&price=lt.%s", maxPrice)		
		}

		if minPrice != "" {
		targetUrl += fmt.Sprintf("&price=gte.%s", minPrice)		
		}



		// Step 3f-i: Add the Pagination "cuts" to the URL
		targetUrl += fmt.Sprintf("&limit=%d&offset=%d", limit, offset)

		// Step 3g: Create the actual request package
		req, err := http.NewRequest("GET", targetUrl, nil)
		if err != nil {
			http.Error(w, "Failed to create request", http.StatusInternalServerError)
			return
		}

		// Step 3h: Add security keys to the request
		req.Header.Set("apikey", supabaseKey)
		req.Header.Set("Authorization", "Bearer "+supabaseKey)
		req.Header.Set("Accept", "application/json")
		req.Header.Set("Prefer", "count=exact") // Ask Supabase for the total count

		// Step 3i: Send the request to Supabase
		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, "Failed to fetch from Supabase", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		// NEW STEP 3j-i: Grab the total count from the Supabase header
		totalCount := resp.Header.Get("Content-Range")


		
		// --- ADD THIS ERROR LOGGING BLOCK ---
		bodyBytes, _ := io.ReadAll(resp.Body)
		if resp.StatusCode != http.StatusOK {
			log.Printf("SUPABASE ERROR (Status %d): %s", resp.StatusCode, string(bodyBytes))
		} else {
			log.Printf("SUPABASE SUCCESS: %s", string(bodyBytes))
		}
		// This line is CRITICAL: it puts the data back into the body so you can decode it later
		resp.Body = io.NopCloser(bytes.NewBuffer(bodyBytes)) 
		// ------------------------------------



		// Step 3k: Read the JSON response and convert it into a slice of cars
		var cars []Car
		if err := json.NewDecoder(resp.Body).Decode(&cars); err != nil {
			http.Error(w, "Failed to decode JSON", http.StatusInternalServerError)
			return
		}

		// Step 3l: Error if no cars were found
		if len(cars) == 0 {
			http.Error(w, "Car not found", http.StatusNotFound)
			return
		}

		// Step 3m: Move exact name matches to the top of the list
		if search != "" {
			s := strings.ToLower(search)
			sort.Slice(cars, func(i, j int) bool {
				iMatch := strings.HasPrefix(strings.ToLower(cars[i].Name), s) || strings.HasPrefix(strings.ToLower(cars[i].Brand), s)
				jMatch := strings.HasPrefix(strings.ToLower(cars[j].Name), s) || strings.HasPrefix(strings.ToLower(cars[j].Brand), s)
				return iMatch && !jMatch
			})
		}

		// Step 3n: Wrap everything in a final "package" for React
		response := map[string]interface{}{
			"cars":        cars,
			"total":       totalCount,
			"currentPage": page,
		}

		// Step 3o: Send the final package back to the user
		json.NewEncoder(w).Encode(response)
	})

	// ----------------------
	// 4. Handler for fetching a single car by its ID
	// ----------------------
	http.HandleFunc("/cars/", func(w http.ResponseWriter, r *http.Request) {
		// Step 4a & 4b: Basic setup
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")

		// Step 4c: Extract the ID from the end of the URL (e.g., /cars/5)
		id := strings.TrimPrefix(r.URL.Path, "/cars/")
		if id == "" {
			http.Error(w, "Car ID is required", http.StatusBadRequest)
			return
		}

		// Step 4e: Create the request to Supabase asking for 1 specific ID
		client := &http.Client{}
		req, err := http.NewRequest("GET", supabaseURL+"?id=eq."+id, nil)
		if err != nil {
			http.Error(w, "Failed to create request", http.StatusInternalServerError)
			return
		}

		// Step 4g: Security headers
		req.Header.Set("apikey", supabaseKey)
		req.Header.Set("Authorization", "Bearer "+supabaseKey)
		req.Header.Set("Accept", "application/json")

		// Step 4h & 4i: Send and then prepare to close
		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, "Failed to fetch car", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		// Step 4j: Decode the result
		var cars []Car
		if err := json.NewDecoder(resp.Body).Decode(&cars); err != nil {
			http.Error(w, "Failed to decode car", http.StatusInternalServerError)
			return
		}

		// Step 4k: Handle "Not Found"
		if len(cars) == 0 {
			http.Error(w, "Car not found", http.StatusNotFound)
			return
		}

		// Step 4l: Send only the single car (the first item in the list)
		json.NewEncoder(w).Encode(cars[0])
	})

	// ----------------------
	// 5. Health Check (Keeps the server awake on hosting sites like Render)
	// ----------------------
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// ----------------------
	// 6. Start the server
	// ----------------------
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Use 8080 if no specific port is provided
	}

	log.Println("Server running on port", port)
	err = http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
} 