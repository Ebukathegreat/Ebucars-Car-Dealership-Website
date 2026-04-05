import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import { useCars } from "../customHooks/useCars";

export default function Brands() {
  const [searchParams, setSearchParams] = useSearchParams();

  // READ directly from the URL. This is "live" on every render.
  const searchTerm = searchParams.get("searchTerm") || "";
  const { brand } = useParams();
  console.log("BRAND: ", brand);

  const page = parseInt(searchParams.get("page")) || 1;

  // NEW: This state only updates when the user STOPS typing
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500);
  }, [pathname]);

  // This effect acts like a timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300); // Wait 300ms (0.3 seconds)

    return () => clearTimeout(timer); // Clean up if user types another letter
  }, [searchTerm]);

  // UTILIZE THE HOOK HERE
  // This one line replaces all your fetch logic, loading states, and error states
  // NOW: We pass the debouncedTerm to the hook, NOT the raw searchTerm

  // 1. Use useMemo for filter object
  const filters = useMemo(() => ({ brand: brand }), [brand]);

  const { cars, total, loading, error } = useCars({
    searchTerm: debouncedTerm,
    page: page,
    limit: 10,
    filters: filters,
  });

  // Extract the total number from the string "0-9/15"
  // We split by the "/" and take the second part
  const totalCount = total ? parseInt(total.split("/")[1]) : 0;

  // Calculate the max pages (assuming your limit is 10)
  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]); // Scroll up when changing pages

  const fadeIn = {
    hidden: { opacity: 0, scale: 0 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  // --- RENDERING LOGIC ---
  // 1. Create a "Ref" to track if this is the first successful load
  const hasLoadedOnce = useRef(false);

  // 2. Once cars arrive for the first time, flip the switch to 'true'
  if (!loading && cars.length > 0 && !hasLoadedOnce.current) {
    hasLoadedOnce.current = true;
  }

  // 3. If it's the very first load and we have nothing, show the big spinner
  if (loading && cars.length === 0)
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

  // 4. If the server is actually DOWN (500 error, not a 404), show the red error
  if (error && !loading) return <div className="text-red-500">{error}</div>;

  // 5. If the search finished and returned 0 cars, show the "No cars found" message
  if (!loading && debouncedTerm && cars.length === 0) {
    return (
      <p className="text-center  my-12 font-semibold">
        {" "}
        No cars found for: “{debouncedTerm}”
      </p>
    );
  }

  return (
    <div>
      <motion.section
        // THE TRICK:
        // If hasLoadedOnce is false, we run the animation.
        // If it's true, we set initial/animate to null so it's instant!
        variants={fadeIn}
        initial={hasLoadedOnce.current ? false : "hidden"}
        animate={hasLoadedOnce.current ? false : "show"}
      >
        <h1 className="font-bold text-[27px] md:text-4xl text-center my-4">
          {brand.toLocaleUpperCase()} Cars For You
        </h1>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-4 px-5 pb-6 ">
          {cars?.map((car) => (
            <li
              key={car.id}
              className="bg-[linear-gradient(rgba(79,62,124,0.95),rgba(31,29,48,0.95))] hover:bg-gray-900  hover:scale-105 transition rounded-2xl overflow-hidden p-2.5"
            >
              <Link to={`/car_details/${car.id}`}>
                <img
                  src={car.images[0]}
                  alt={car.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-white my-2 text-lg">
                    {car.name}
                  </h3>
                  <p className="font-bold text-white text-lg">
                    ${car.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* PAGINATION CONTROLS */}
        <div className="flex justify-center gap-4 pb-10">
          <button
            onClick={() => {
              // Update the URL: keeps the search, changes the page
              setSearchParams({ searchTerm, page: page - 1 });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-400 rounded cursor-pointer hover:bg-green-400 disabled:hover:bg-gray-400 disabled:opacity-50 disabled:cursor-no-drop"
          >
            Previous
          </button>
          <span className="font-bold self-center">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => {
              // Update the URL: keeps the search, changes the page
              setSearchParams({ searchTerm, page: page + 1 });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-gray-400 rounded cursor-pointer hover:bg-green-400 disabled:hover:bg-gray-400 disabled:opacity-50 disabled:cursor-no-drop"
          >
            Next
          </button>
        </div>
      </motion.section>
    </div>
  );
}
