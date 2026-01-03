import { useEffect, useState } from "react";
import Navbar from "../pages-components/Navbar";
import styles from "./home.module.css";
import { supabase } from "../library/supabaseClient";

export default function Home() {
  const [allCars, setAllCars] = useState([]);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    async function fetchAllCars() {
      try {
        const url = "https://ebucars-car-dealership-website.onrender.com/cars";
        const data = await fetch(url);
        const results = await data.json();

        console.log(results);
      } catch (err) {
        console.log("ERROR: ", err);
      }
    }

    fetchAllCars();
  }, []);

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

      <section>
        <h2 className="text-3xl font-bold ">New Cars</h2>
      </section>
    </div>
  );
}
