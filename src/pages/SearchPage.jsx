import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function SearchPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search).get("searchTerm");
  const [searchedCar, setSearchedCar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState("");
  const [notFound, setNotFound] = useState(false);

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
    setLoading(true);
    setNotFound(false);
    setErrors("");
    setSearchedCar([]); // clear old results immediately

    const cachedSearchedCar = sessionStorage.getItem(
      `cachedSearchedCar_${params}`
    );

    if (cachedSearchedCar) {
      const parsed = JSON.parse(cachedSearchedCar);
      console.log("CACHED SEARCHED CAR: ", parsed);
      setSearchedCar(parsed);
      setLoading(false);
      return;
    }
    fetchSearchedCar();
  }, [params]);

  async function fetchSearchedCar() {
    setLoading(true);
    try {
      const url = `https://ebucars-car-dealership-website.onrender.com/cars?search=${params}`;
      const data = await fetch(url);

      console.log("DATA: ", data);

      if (!data.ok) {
        // Non-200 response (like 404)
        console.warn(`Server returned ${data.status}: ${data.statusText}`);
        setSearchedCar([]); // treat as no results
        setNotFound(true); // 👈 this is the key
        return;
      }

      // 200 OK → parse JSON
      const results = await data.json();
      console.log("FETCHED RESULTS: ", results);
      setSearchedCar(results);
      sessionStorage.setItem(
        `cachedSearchedCar_${params}`,
        JSON.stringify(results)
      );
    } catch (err) {
      console.error("ERROR: ", err);
      setErrors(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
      <div className="flex justify-center items-center h-screen">
        <p className="bg-pink-50 text-pink-700 px-6 py-4 rounded-xl font-medium shadow-sm text-center max-w-md">
          Oops! Something went wrong while loading your searched car. Don't
          worry, please try again in a moment.
        </p>
      </div>
    );

  return (
    <div>
      {!loading && notFound ? (
        <div className="text-center mt-10">
          <p className="text-2xl font-semibold">No cars found for “{params}”</p>
          <p className="text-gray-500 mt-2">
            Try a different brand, model, or keyword 🚗
          </p>
        </div>
      ) : (
        <div>
          <motion.section
            variants={fadeIn}
            initial="hidden"
            animate="show"
            viewport={{ once: true }}
          >
            {params && (
              <h1 className="font-bold text-[27px] md:text-4xl text-center my-4">
                Results for: "{params}"
              </h1>
            )}

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-4 px-5 ">
              {searchedCar.map((srchdCr) => (
                <li
                  key={srchdCr.id}
                  className="bg-[linear-gradient(rgba(79,62,124,0.95),rgba(31,29,48,0.95))] hover:bg-gray-900 hover:scale-105 transition rounded-2xl overflow-hidden p-2.5"
                >
                  <Link to={`/car_details/${srchdCr.id}`}>
                    <img
                      src={srchdCr.images[0]}
                      alt={srchdCr.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-bold text-white my-2 text-lg">
                        {srchdCr.name}
                      </h3>
                      <p className="font-bold text-white text-lg">
                        ${srchdCr.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>
      )}
    </div>
  );
}
