import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function UsedCars() {
  const [allCars, setAllCars] = useState([]);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);

  const ref = useRef(false);

  useEffect(() => {
    const cachedUsedCars = sessionStorage.getItem("cachedUsedCars");

    if (ref.current === cachedUsedCars) return;

    ref.current = cachedUsedCars;

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
          Oops! Something went wrong while loading the Used Cars. Don't worry,
          please try again in a moment.
        </p>
      </div>
    );

  return (
    <div>
      <h1 className="font-bold text-[27px] md:text-4xl text-center my-4">
        Clean Used Cars For You
      </h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-4 px-5 ">
        {usedCars.map((used) => (
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
        ))}
      </ul>
    </div>
  );
}
