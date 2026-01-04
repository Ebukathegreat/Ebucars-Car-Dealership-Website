import { useEffect, useState } from "react";
import styles from "./home.module.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [allCars, setAllCars] = useState([]);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllCars() {
      try {
        const url = "https://ebucars-car-dealership-website.onrender.com/cars";
        const data = await fetch(url);
        const results = await data.json();

        console.log("THESE ARE: ", results);
        setAllCars(results);
        setLoading(false);
      } catch (err) {
        console.log("ERROR: ", err);
        setErrors(err);
      } finally {
        setLoading(false);
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
        <section>
          {/* Content */}

          <div className="md:flex items-center justify-center h-[70vh]">
            <div className="px-3 md:px-0 pt-18 md:mt-0">
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
                  Make Your Pick
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 p-4">
          <h2 className="text-2xl font-bold">Loading Cars...</h2>
          <span className="   text-2xl animate-spin">🚙</span>
        </div>
      ) : (
        <div>
          <section className="py-4 px-7">
            <h2 className="text-3xl font-extrabold font-mono ">New Cars</h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 my-4 ">
              {newCars
                .map((nwCr) => (
                  <li
                    key={nwCr.id}
                    className="hover:bg-gray-300 hover:scale-105 transition rounded-2xl overflow-hidden p-2.5"
                  >
                    <Link to={`/car_details/${nwCr.id}`}>
                      <img
                        src={nwCr.images[0]}
                        alt={nwCr.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-bold my-2">{nwCr.name}</h3>
                        <p>${nwCr.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  </li>
                ))
                .slice(0, 3)}
            </ul>

            <div className="text-center mt-8">
              <Link
                to="/new_cars"
                className="bg-[linear-gradient(rgba(31,29,48,0.7),rgba(79,62,124,0.7))] py-2 px-7 text-center rounded-3xl font-semibold cursor-pointer hover:bg-amber-300 text-[gold] text-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]"
              >
                View More New Cars
              </Link>
            </div>
          </section>

          <section className="py-4 px-7 mt-4">
            <h2 className="text-3xl font-extrabold font-mono ">Used Cars</h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-4">
              {usedCars
                .map((used) => (
                  <li
                    key={used.id}
                    className="hover:bg-gray-300 hover:scale-105 transition rounded-2xl overflow-hidden p-2.5"
                  >
                    <Link to={`/car_details/${used.id}`}>
                      <img
                        src={used.images[0]}
                        alt={used.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-bold my-2">{used.name}</h3>
                        <p>${used.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  </li>
                ))
                .slice(0, 3)}
            </ul>

            <div className="text-center mt-8 pb-9 ">
              <Link
                to="/used_cars"
                className="bg-[linear-gradient(rgba(31,29,48,0.7),rgba(79,62,124,0.7))] py-2 px-7 text-center rounded-3xl font-semibold cursor-pointer hover:bg-amber-300 text-[gold] text-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]"
              >
                View More Used Cars
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
