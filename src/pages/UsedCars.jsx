import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function UsedCars() {
  const [allCars, setAllCars] = useState([]);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search).get("searchTerm");

  // SIMPLE Fade In
  const fadeIn = {
    hidden: { opacity: 0, scale: 0 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const cachedUsedCars = sessionStorage.getItem("cachedUsedCars");

    if (cachedUsedCars) {
      const parsed = JSON.parse(cachedUsedCars);
      console.log("CACHED USED CARS: ", parsed);
      setAllCars(parsed);
      setLoading(false);
      return;
    }

    fetchAllCars();
  }, []);

  async function fetchAllCars() {
    try {
      const url = "https://ebucars-car-dealership-website.onrender.com/cars";
      const data = await fetch(url);
      const results = await data.json();

      console.log("FETCHED RESULTS: ", results);
      setAllCars(results);
      sessionStorage.setItem("cachedUsedCars", JSON.stringify(results));

      setLoading(false);
    } catch (err) {
      console.log("ERROR: ", err);
      setErrors(err);
    } finally {
      setLoading(false);
    }
  }

  const usedCars = allCars.filter((used) => used.condition === "Used");

  const safeParam = params?.toLowerCase().trim() || "";

  const usedCarsBySearchTerm = usedCars
    .filter(
      (car) =>
        car.name.toLowerCase().includes(safeParam) ||
        car.brand.toLowerCase().includes(safeParam)
    )
    .sort((a, b) => {
      const aStarts =
        a.name.toLowerCase().startsWith(safeParam) ||
        a.brand.toLowerCase().startsWith(safeParam);

      const bStarts =
        b.name.toLowerCase().startsWith(safeParam) ||
        b.brand.toLowerCase().startsWith(safeParam);

      return bStarts - aStarts; // true > false, so startsWith comes first
    });

  console.log("USED BY SEARCHTERM:", usedCarsBySearchTerm);

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
          Oops! Something went wrong while loading the Used Cars. Don't worry,
          please try again in a moment.
        </p>
      </div>
    );

  if (safeParam && usedCarsBySearchTerm.length === 0)
    return (
      <p className="text-center  mt-6 font-semibold">
        No used cars found for: “{params}”
      </p>
    );

  return (
    <div className="bg-red-600">
      <motion.section
        variants={fadeIn}
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
      >
        <h1 className="font-bold text-[27px] md:text-4xl text-center my-4">
          Clean Used Cars For You
        </h1>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-4 px-5 pb-6 ">
          {usedCarsBySearchTerm.map((used) => (
            <li
              key={used.id}
              className="bg-[linear-gradient(rgba(79,62,124,0.95),rgba(31,29,48,0.95))] hover:bg-gray-900  hover:scale-105 transition rounded-2xl overflow-hidden p-2.5"
            >
              <Link to={`/car_details/${used.id}`}>
                <img
                  src={used.images[0]}
                  alt={used.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-white my-2 text-lg">
                    {used.name}
                  </h3>
                  <p className="font-bold text-white text-lg">
                    ${used.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </motion.section>
    </div>
  );
}
