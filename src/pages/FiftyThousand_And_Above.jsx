import { useEffect, useState } from "react";
import styles from "./fiftythousandandabove.module.css";
import { Link } from "react-router-dom";

export default function FiftyThousand_And_Above() {
  // --- STATE MANAGEMENT ---
  const [allCars, setAllCars] = useState([]); // All cars from API
  const [displayCars, setDisplayCars] = useState([]); // The specific cars we see on screen
  const [showLogos, setShowLogos] = useState(true); // Toggle for the brand logo grid
  const [activeTab, setActiveTab] = useState("brd"); // Tracks which button has the red line
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState("");

  const carBrands = [
    ["land rover", "/Land Rover Logo 2.jpg"],
    ["toyota", "/Toyota Logo.png"],
    ["bmw", "/BMW LOGO.jpg"],
    ["mercedes", "/Mercedes-Benz-Logo.png"],
  ];

  // 1. Add this new Effect
  useEffect(() => {
    if (!loading) {
      // Small delay ensures the DOM has actually updated with the cars
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [loading]); // Only runs when loading changes

  // 2. Load data from Cache or API
  useEffect(() => {
    const cachedResults = sessionStorage.getItem("cachedResults");
    if (cachedResults) {
      setAllCars(JSON.parse(cachedResults));
      setLoading(false);
    } else {
      fetchAllCars();
    }
  }, []);

  async function fetchAllCars() {
    try {
      const res = await fetch(
        "https://ebucars-car-dealership-website.onrender.com/cars"
      );
      const data = await res.json();
      setAllCars(data);
      sessionStorage.setItem("cachedResults", JSON.stringify(data));
    } catch (err) {
      setErrors("Failed to load cars");
    } finally {
      setLoading(false);
    }
  }

  // --- DERIVED DATA ---
  // We calculate this on every render so we always have the expensive cars ready

  const on_and_above50000 = allCars.filter((car) => Number(car.price) >= 50000);

  // User clicks "By Brands" button
  function handleShowBrandsTab() {
    setActiveTab("brd");
    setShowLogos(true); // Show the logos again
    setDisplayCars([]); // Clear any car lists currently showing
  }

  // User clicks "All" button
  function handleShowAll_OnAndAbove50000() {
    setActiveTab("all");
    setShowLogos(false); // Hide logos
    setDisplayCars(on_and_above50000); // Show every car on or above 50k
  }

  // User clicks a specific Logo
  function handleBrandClick(brandName) {
    const filtered = on_and_above50000.filter(
      (car) => car.brand.toLowerCase() === brandName.toLowerCase()
    );
    setDisplayCars(filtered); // Update display list with brand-specific cars
    setShowLogos(false); // Hide the logos to make room for cars
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div>
          <div className="flex items-center justify-center ">
            <p className="animate-spin text-4xl md:text-5xl ">🚙</p>
          </div>

          <p className="mt-5 md:mt-7 text-xl font-bold">Please wait...</p>
        </div>
      </div>
    );
  }

  if (errors)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="bg-pink-50 text-pink-700 px-6 py-4 rounded-xl font-medium shadow-sm text-center max-w-md">
          Oops! Something went wrong while loading the Cars. Don't worry, please
          try again in a moment.
        </p>
      </div>
    );

  return (
    <div className="mb-10">
      <section>
        <h1 className=" text-[25px] sm:text-3xl font-bold text-center mt-6">
          Cars valued at $50,000 and Above
        </h1>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 place-items-center mt-4">
          <div className="relative">
            <button
              onClick={handleShowBrandsTab}
              className={`font-bold text-2xl cursor-pointer p-3 ${
                styles.brandsBtn
              } ${activeTab === "brd" ? styles.active : ""}`}
            >
              By Brands
            </button>
          </div>

          <div className="relative">
            <button
              onClick={handleShowAll_OnAndAbove50000}
              className={`font-bold text-2xl cursor-pointer p-3 ${
                styles.allBtn
              } ${activeTab === "all" ? styles.active : ""}`}
            >
              All
            </button>
          </div>
        </div>
      </section>

      <section className="mt-10">
        {/* VIEW 1: Brand Logos (Shows only when showLogos is true) */}
        {showLogos && (
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-5 px-10">
            {carBrands.map(([brand, img]) => (
              <li
                key={brand}
                className="hover:scale-105 transition duration-300 "
              >
                <button
                  onClick={() => handleBrandClick(brand)}
                  className="w-full cursor-pointer"
                >
                  <img
                    src={img}
                    alt={brand}
                    className="w-full h-32 object-contain rounded-lg border hover:border-green-700 p-2"
                  />
                  <p className="capitalize font-semibold mt-2 text-center">
                    {brand}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* VIEW 2: Car List (Shows whenever displayCars has items) */}
        {!showLogos && displayCars.length > 0 && (
          <div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-5 pb-10">
              {displayCars.map((car) => (
                <li
                  key={car.id}
                  className=" bg-[linear-gradient(rgba(79,62,124,0.95),rgba(31,29,48,0.95))] hover:bg-gray-900  shadow-md hover:shadow-xl hover:scale-105 transition rounded-2xl overflow-hidden p-3 "
                >
                  <Link to={`/car_details/${car.id}`}>
                    <img
                      src={car.images[0]}
                      alt={car.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="mt-3">
                      <h3 className="font-bold text-lg text-white">
                        {car.name}
                      </h3>
                      <p className="text-white font-semibold text-lg ">
                        ${car.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-white">
                        {car.brand} • {car.year}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <button
              onClick={handleShowBrandsTab}
              className="text-blue-600 underline pl-5 mb-2 cursor-pointer"
            >
              Go back to brands
            </button>
          </div>
        )}

        {/* VIEW 3: Empty State (If a brand has no cars under 50k) */}
        {!showLogos && displayCars.length === 0 && (
          <div className="text-center py-20">
            <p className="text-black text-xl">
              No cars found in this category.
            </p>
            <button
              onClick={handleShowBrandsTab}
              className="text-blue-600 underline mt-2 cursor-pointer text-lg"
            >
              Go back to brands
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
