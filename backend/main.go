package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

// ----------------------
// 1. Define the Car structure
// ----------------------
// This tells Go how a car object looks like
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
	err := godotenv.Load(".env.local") // Load from .env.local file
	if err != nil {
		log.Println(".env file not found, using system environment variables")
	}

	supabaseURL := os.Getenv("SUPABASE_URL")      // Supabase table endpoint
	supabaseKey := os.Getenv("SUPABASE_ANON_KEY") // Supabase API key

	if supabaseURL == "" || supabaseKey == "" {
		log.Fatal("Missing SUPABASE_URL or SUPABASE_ANON_KEY")
	}

	// ----------------------
	// 3. Handler for fetching all cars or searching by name/brand
	// ----------------------
	http.HandleFunc("/cars", func(w http.ResponseWriter, r *http.Request) {
		// Step 3a: Allow any website to call this API (CORS)
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Step 3b: Tell the browser we are sending JSON
		w.Header().Set("Content-Type", "application/json")

		// Step 3c: Get the search term from the URL, e.g. /cars?search=Range+Rover
		search := r.URL.Query().Get("search")

		client := &http.Client{} // Step 3d: Create a client to send request to Supabase

		// Step 3e: Start building the URL to fetch all cars
		url := supabaseURL + "?select=*"

		// Step 3f: If a search term is provided, filter the results
		if search != "" {
			// Replace spaces with % for Supabase pattern matching
			searchParam := strings.ReplaceAll(search, " ", "%")

			// Filter cars where name OR brand contains the search term (case-insensitive)
			url += fmt.Sprintf("&or=(name.ilike.*%s*,brand.ilike.*%s*)", searchParam, searchParam)
		}

		// Step 3g: Create a GET request to Supabase
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			http.Error(w, "Failed to create request", http.StatusInternalServerError)
			return
		}

		// Step 3h: Add headers so Supabase knows we are allowed to fetch the data
		req.Header.Set("apikey", supabaseKey)
		req.Header.Set("Authorization", "Bearer "+supabaseKey)
		req.Header.Set("Accept", "application/json")

		// Step 3i: Send the request to Supabase
		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, "Failed to fetch from Supabase", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close() // Step 3j: Make sure to close the response when done

		// Step 3k: Read the JSON response and convert it into a slice of cars
		var cars []Car
		if err := json.NewDecoder(resp.Body).Decode(&cars); err != nil {
			http.Error(w, "Failed to decode JSON", http.StatusInternalServerError)
			return
		}

		// Step 3l: Send the cars back to the browser as JSON
		json.NewEncoder(w).Encode(cars)
	})

	// ----------------------
	// 4. Handler for fetching a single car by its ID
	// ----------------------
	http.HandleFunc("/cars/", func(w http.ResponseWriter, r *http.Request) {
		// Step 4a: Allow any website to call this API
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Step 4b: Tell the browser we are sending JSON
		w.Header().Set("Content-Type", "application/json")

		// Step 4c: Get the car ID from the URL
		// Example: /cars/3 → id = "3"
		id := strings.TrimPrefix(r.URL.Path, "/cars/")

		// Step 4d: If no ID is provided, return an error
		if id == "" {
			http.Error(w, "Car ID is required", http.StatusBadRequest)
			return
		}

		client := &http.Client{} // Step 4e: Create a client to send request to Supabase

		// Step 4f: Build the URL to fetch this specific car by ID
		req, err := http.NewRequest("GET", supabaseURL+"?id=eq."+id, nil)
		if err != nil {
			http.Error(w, "Failed to create request", http.StatusInternalServerError)
			return
		}

		// Step 4g: Add headers so Supabase knows we are allowed to fetch the data
		req.Header.Set("apikey", supabaseKey)
		req.Header.Set("Authorization", "Bearer "+supabaseKey)
		req.Header.Set("Accept", "application/json")

		// Step 4h: Send the request to Supabase
		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, "Failed to fetch car", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close() // Step 4i: Close the response when done

		// Step 4j: Read the JSON response and convert it into a slice of cars
		var cars []Car
		if err := json.NewDecoder(resp.Body).Decode(&cars); err != nil {
			http.Error(w, "Failed to decode car", http.StatusInternalServerError)
			return
		}

		// Step 4k: If no car was found, return a 404 error
		if len(cars) == 0 {
			http.Error(w, "Car not found", http.StatusNotFound)
			return
		}

		// Step 4l: Send the first car in the response as JSON
		json.NewEncoder(w).Encode(cars[0])
	})

	// ----------------------
	// 5. Start the server
	// ----------------------
	port := os.Getenv("PORT") // Step 5a: Get port from environment
	if port == "" {
		port = "8080" // Step 5b: Use 8080 if no port is set
	}

	log.Println("Server running on port", port) // Step 5c: Log server start
	err = http.ListenAndServe(":"+port, nil)   // Step 5d: Start listening for requests
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
