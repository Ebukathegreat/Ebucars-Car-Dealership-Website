package main

// Import the packages we need
import (
	"encoding/json" // To convert Go structs to JSON and back
	"log"           // For logging messages to the console
	"net/http"      // To create a web server and handle requests
	"os"
)

// Define a struct called Car
// This matches the shape of our data in Supabase
type Car struct {
	ID           int      `json:"id"`           // Unique identifier for the car
	Name         string   `json:"name"`         // Name of the car
	Brand        string   `json:"brand"`        // Brand of the car
	Year         int      `json:"year"`         // Year of manufacture
	Price        int      `json:"price"`        // Price in USD
	Description  string   `json:"description"`  // Description of the car
	Images       []string `json:"images"`       // Slice of image URLs
	Mileage      int      `json:"mileage"`      // Car mileage
	Fuel         string   `json:"fuel"`         // Fuel type
	Transmission string   `json:"transmission"` // Transmission type
	Engine       string   `json:"engine"`       // Engine type
	Color        string   `json:"color"`        // Car color
	Condition    string   `json:"condition"`    // New or Used
	Availability string   `json:"availability"` // Available or Sold
	Location     string   `json:"location"`     // Location of the car
	Features     []string `json:"features"`     // List of features
}

func main() {
	// The Supabase REST API endpoint for our "cars" table
	supabaseURL :=os.Getenv("SUPABASE_URL")
	// Your Supabase anon key
	// This allows our Go server to access the Supabase API
	supabaseKey := os.Getenv(("SUPABASE_ANON_KEY"))

	// Set up a route "/cars" on our Go server
	// Whenever someone visits "http://localhost:8080/cars", this function runs
	http.HandleFunc("/cars", func(w http.ResponseWriter, r *http.Request) {
		// Tell the browser we are sending JSON data
		w.Header().Set("Content-Type", "application/json")

		// Create a new HTTP client to make a request to Supabase
		client := &http.Client{}

		// Prepare a GET request to Supabase to fetch all car rows
		req, err := http.NewRequest("GET", supabaseURL+"?select=*", nil)
		if err != nil {
			// If request creation fails, send an error back to the browser
			http.Error(w, "Failed to create request", http.StatusInternalServerError)
			return
		}

		// Set headers so Supabase knows this request is authorized
		req.Header.Set("apikey", supabaseKey)                    // API key header
		req.Header.Set("Authorization", "Bearer "+supabaseKey) // Bearer token
		req.Header.Set("Accept", "application/json")           // Ask for JSON response

		// Send the request to Supabase
		resp, err := client.Do(req)
		if err != nil {
			// If fetching fails, send an error back
			http.Error(w, "Failed to fetch from Supabase", http.StatusInternalServerError)
			return
		}
		// Close the response body when done to free resources
		defer resp.Body.Close()

		// Create a variable to hold the list of cars
		var cars []Car

		// Decode the JSON response from Supabase into our Go struct
		if err := json.NewDecoder(resp.Body).Decode(&cars); err != nil {
			// If decoding fails, send an error
			http.Error(w, "Failed to decode JSON", http.StatusInternalServerError)
			return
		}

		// Send the list of cars as JSON back to the browser
		json.NewEncoder(w).Encode(cars)
	})

	// Print a message in the console so we know the server is running
	log.Println("Server running on http://localhost:8080")

	// Start the server on port 8080
	// The server will keep running until you stop it
	http.ListenAndServe(":8080", nil)
}
