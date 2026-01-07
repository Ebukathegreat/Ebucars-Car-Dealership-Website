import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SearchPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search).get("searchTerm");
  const [searchedCar, setSearchedCar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState("");
  const [notFound, setNotFound] = useState(false);

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
          <h1 className="font-bold text-[27px] md:text-4xl text-center my-4">
            Results for: "{params}"
          </h1>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-4 px-5 ">
            {searchedCar.map((srchdCr) => (
              <li
                key={srchdCr.id}
                className="hover:bg-gray-300 hover:scale-105 transition rounded-2xl overflow-hidden p-2.5"
              >
                <Link to={`/car_details/${srchdCr.id}`}>
                  <img
                    src={srchdCr.images[0]}
                    alt={srchdCr.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold my-2">{srchdCr.name}</h3>
                    <p>${srchdCr.price.toLocaleString()}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
