import { useEffect, useState } from "react";
import Navbar from "../pages-components/Navbar";
import styles from "./home.module.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [allCars, setAllCars] = useState([]);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    async function fetchAllCars() {
      try {
        const url = "https://ebucars-car-dealership-website.onrender.com/cars";
        const data = await fetch(url);
        const results = await data.json();

        console.log("THESE ARE: ", results);
        setAllCars(results);
      } catch (err) {
        console.log("ERROR: ", err);
        setErrors(err);
      }
    }

    fetchAllCars();
  }, []);

  const newCars = allCars.filter((nwCr) => nwCr.condition === "New");

  const usedCars = allCars.filter((used) => used.condition === "Used");

  console.log(usedCars);

  return (
    <div>
      <div className={styles.hero}>
        <Navbar />

        <section className="b-red-600 z-100">
          {/* Content */}

          <div className="md:flex items-center justify-center h-[70vh]">
            <div className="px-3 md:px-0 mt-4 md:mt-0">
              <h1 className="text-5xl md:text-6xl text-white font-extrabold leading-tight tracking-tight md:text-center text-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
                Find Your{" "}
                <span className="text-[gold] block md:inline">
                  Perfect Drive
                </span>
              </h1>

              {/* Subtext */}
              <p className=" mt-4 md:mt-2 text-base md:text-lg text-white font-semibold text-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
                Explore premium new and used vehicles built for performance,
                comfort, and reliability — hand-picked for drivers who expect
                more.
              </p>

              <div className="mt-7 md:mt-3 md:text-center">
                <button className="bg-[gold] text-white text-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]  font-semibold text-xl px-16 py-2 rounded-md hover:bg-amber-300 transition cursor-pointer ">
                  Browse Cars
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="py-4 px-7">
        <h2 className="text-3xl font-extrabold font-mono ">New Cars</h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-4">
          {newCars
            .map((nwCr) => (
              <li key={nwCr.id}>
                <Link to={`/car_details/${nwCr.id}`}>
                  <img
                    src={nwCr.images[0]}
                    alt={nwCr.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <h3 className="font-bold my-2">{nwCr.name}</h3>
                  <p>${nwCr.price}</p>
                </Link>
              </li>
            ))
            .slice(0, 3)}
        </ul>

        <div className="text-center">
          <button className="bg-[linear-gradient(rgba(31,29,48,0.7),rgba(79,62,124,0.7))] py-2 px-7 text-center rounded-3xl font-semibold cursor-pointer hover:bg-amber-300 text-[gold] text-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
            View More New Cars
          </button>
        </div>
      </section>

      <section className="py-4 px-7">
        <h2 className="text-3xl font-extrabold font-mono ">Used Cars</h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-4">
          {usedCars
            .map((used) => (
              <li key={used.id}>
                <img
                  src={used.images[0]}
                  alt={used.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="font-bold my-2">{used.name}</h3>
                <p>${used.price}</p>
              </li>
            ))
            .slice(0, 3)}
        </ul>

        <div className="text-center">
          <button className="bg-[linear-gradient(rgba(31,29,48,0.7),rgba(79,62,124,0.7))] py-2 px-7 text-center rounded-3xl font-semibold cursor-pointer hover:bg-amber-300 text-[gold] text-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
            View More Used Cars
          </button>
        </div>
      </section>
    </div>
  );
}
