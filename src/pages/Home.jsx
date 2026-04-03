import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const [allCars, setAllCars] = useState([]);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);

  const ref = useRef(false);

  // SIMPLE slide-in from the right
  const slideFromRight = {
    hidden: { opacity: 0, x: 110 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  useEffect(() => {
    const cachedResults = sessionStorage.getItem("cachedResults");

    if (ref.current === cachedResults) return;
    ref.current = cachedResults;

    if (cachedResults) {
      setAllCars(JSON.parse(cachedResults));
      setLoading(false);
      return;
    }

    fetchAllCars();
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

  const newCars = allCars.filter((car) => car.condition === "New");
  const usedCars = allCars.filter((car) => car.condition === "Used");

  return (
    <div className=" w-[100vw] overflow-x-hidden">
      {/* HERO */}
      <div className={styles.hero}>
        <section className="flex items-center justify-center h-[70vh] px-3 ">
          <div className="text-white md:text-center  sm:mt-8 ">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight  text-center">
              BRANCH Find Your{" "}
              <span className="text-[gold] block sm:inline">Perfect Drive</span>
            </h1>

            <p className="mt-4 text-base md:text-lg font-semibold  text-center">
              Explore premium new and used vehicles built for performance,
              comfort, and reliability.
            </p>

            <div className="mt-6  ">
              <Link
                to="/all_cars"
                className="bg-[gold] text-white text-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] font-semibold text-xl px-16 py-2 rounded-md hover:bg-amber-300 transition block m-auto max-w-fit"
              >
                View All Cars
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ERROR */}
      {errors && (
        <div className="flex justify-center my-8">
          <p className="bg-pink-50 text-pink-700 px-6 py-4 rounded-xl font-medium">
            {errors}
          </p>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="flex items-center gap-2 p-6">
          <h2 className="text-2xl font-bold">Loading Cars...</h2>
          <span className="text-2xl animate-spin">🚙</span>
        </div>
      ) : (
        <>
          {/* NEW CARS */}
          <motion.section
            variants={slideFromRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="py-6 px-7"
          >
            <h2 className="text-3xl font-extrabold font-mono">New Cars</h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-6">
              {newCars.slice(0, 3).map((car) => (
                <li
                  key={car.id}
                  className="rounded-2xl p-2.5 hover:scale-110 transition"
                >
                  <Link to={`/car_details/${car.id}`}>
                    <div className="w-full h-48 overflow-hidden rounded-lg">
                      <img
                        src={car.images[0]}
                        alt={car.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="font-bold my-2">{car.name}</h3>
                    <p className="font-semibold">
                      ${car.price.toLocaleString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <Link
                to="/new_cars"
                className="bg-gradient-to-r from-indigo-900 to-purple-700 py-2 px-8 rounded-3xl font-semibold text-[gold]"
              >
                View More New Cars
              </Link>
            </div>
          </motion.section>

          {/* USED CARS */}
          <motion.section
            variants={slideFromRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="py-6 px-7"
          >
            <h2 className="text-3xl font-extrabold font-mono">Used Cars</h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-6">
              {usedCars.slice(0, 3).map((car) => (
                <li
                  key={car.id}
                  className="rounded-2xl p-2.5 hover:scale-110 transition"
                >
                  <Link to={`/car_details/${car.id}`}>
                    <div className="w-full h-48 overflow-hidden rounded-lg">
                      <img
                        src={car.images[0]}
                        alt={car.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="font-bold my-2">{car.name}</h3>
                    <p className="font-semibold">
                      ${car.price.toLocaleString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <Link
                to="/used_cars"
                className="bg-gradient-to-r from-indigo-900 to-purple-700 py-2 px-8 rounded-3xl font-semibold text-[gold]"
              >
                View More Used Cars
              </Link>
            </div>
          </motion.section>

          {/* BRANDS  */}
          <motion.section
            variants={slideFromRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="py-10 px-7"
          >
            <h2 className="font-bold text-3xl mb-6">Brands</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                ["land rover", "/Land Rover Logo 2.jpg"],
                ["toyota", "/Toyota Logo.png"],
                ["bmw", "/BMW LOGO.jpg"],
                ["mercedes", "/Mercedes-Benz-Logo.png"],
              ].map(([brand, img]) => (
                <li
                  key={brand}
                  className="hover:scale-110 transition border sm:border-0 rounded-2xl  hover:border-green-700"
                >
                  <Link to={`/brands/${brand}`}>
                    <img
                      src={img}
                      alt={brand}
                      className="w-full h-40 object-contain rounded-lg"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* PRICES  */}
          <motion.section
            variants={slideFromRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="py-10 px-7 "
          >
            <h2 className="font-bold text-3xl mb-12 ">Prices</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8  justify-between items-center  ">
              <Link
                to="/below_50000"
                className=" text-xl sm:text-2xl font-semibold bg-[linear-gradient(rgba(31,29,48,0.95),rgba(79,62,124,0.95))] text-white hover:text-amber-300 text-center py-7"
              >
                Below $50,000
              </Link>
              <Link
                to="/fiftythousand_and_above"
                className=" text-xl sm:text-2xl font-semibold bg-[linear-gradient(rgba(31,29,48,0.95),rgba(79,62,124,0.95))] text-white hover:text-amber-300 text-center py-7"
              >
                $50,000 and Above
              </Link>
            </div>
          </motion.section>
        </>
      )}
    </div>
  );
}
