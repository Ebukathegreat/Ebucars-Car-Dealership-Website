import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useCars } from "../customHooks/useCars.js"; // Import your new hook

export default function AllCars() {
  const [searchParams, setSearchParams] = useSearchParams();

  // READ directly from the URL. This is "live" on every render.
  const searchTerm = searchParams.get("searchTerm") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  // NEW: This state only updates when the user STOPS typing
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const isFirstMount = useRef(true); // Refers to the component appearing for the first time

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

  const { cars, total, loading, error } = useCars({
    searchTerm: debouncedTerm,
    page: page,
    limit: 10,
    filters: {},
  });

  // Extract the total number from the string "0-9/15"
  // We split by the "/" and take the second part
  const totalCount = total ? parseInt(total.split("/")[1]) : 0;

  // Calculate the max pages (assuming your limit is 10)
  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  // ONLY turn framer motion off after the component has successfully rendered the LIST
  useEffect(() => {
    if (!loading && cars.length > 0) {
      // Wait a tiny bit so Framer Motion can catch the "show" state
      const timer = setTimeout(() => {
        isFirstMount.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, cars.length]);

  useEffect(() => {
    if (!loading) {
      // A tiny timeout ensures the DOM has finished painting the car list
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]); // Run this whenever loading status changes

  const fadeIn = {
    hidden: { opacity: 0, scale: 0 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

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
        No cars found for: “{debouncedTerm}”
      </p>
    );
  }

  return (
    <div>
      <motion.section
        variants={fadeIn}
        initial={isFirstMount.current ? "hidden" : false}
        animate={isFirstMount.current ? "show" : false}
      >
        <h1 className="font-bold text-[27px] md:text-4xl text-center my-4">
          All Available Cars
        </h1>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-4 px-5 pb-8">
          {cars?.map((car) => (
            <li
              key={car.id}
              className="bg-gray-800 hover:scale-105 transition rounded-2xl p-2.5"
            >
              <Link to={`/car_details/${car.id}`}>
                <img
                  src={car.images[0]}
                  alt={car.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="font-bold text-white mt-2">{car.name}</h3>
                <p className="text-white">${car.price.toLocaleString()}</p>
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
