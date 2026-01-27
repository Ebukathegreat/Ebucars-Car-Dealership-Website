import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

export default function Brands() {
  const { brand } = useParams();

  const [allCars, setAllCars] = useState([]);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search).get("searchTerm");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [brand]);

  useEffect(() => {
    const cachedCarBrands = sessionStorage.getItem("cachedCarBrands");

    if (cachedCarBrands) {
      const parsed = JSON.parse(cachedCarBrands);
      console.log("CACHED CAR BRANDS: ", parsed);
      setAllCars(parsed);
      setLoading(false);
      return;
    }

    fetchAllCars();
  }, [brand]);

  async function fetchAllCars() {
    try {
      const url = "https://ebucars-car-dealership-website.onrender.com/cars";
      const data = await fetch(url);
      const results = await data.json();

      console.log("FETCHED RESULTS: ", results);
      setAllCars(results);
      sessionStorage.setItem("cachedCarBrands", JSON.stringify(results));
      setLoading(false);
    } catch (err) {
      console.log("ERROR: ", err);
      setErrors(err);
    } finally {
      setLoading(false);
    }
  }

  const carBrand = allCars.filter(
    (car) => car.brand.toLowerCase() === brand.trim()
  );

  console.log("CAR BRANDS: ", carBrand);

  const safeParam = params?.toLowerCase().trim() || "";

  const carNameBySearchTerm = carBrand
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

  console.log("CAR BY SEARCHTERM:", carNameBySearchTerm);

  if (safeParam && carNameBySearchTerm.length === 0)
    return (
      <p className="text-center  mt-6 font-semibold">
        No cars found for: “{params}”
      </p>
    );

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
          Oops! Something went wrong while loading the Cars. Don't worry, please
          try again in a moment.
        </p>
      </div>
    );

  return (
    <div>
      <div>
        <h1 className="font-bold text-[27px] md:text-4xl text-center my-4">
          {brand.toLocaleUpperCase()} Cars For You
        </h1>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-4 px-5 pb-6">
          {carNameBySearchTerm.map((car) => (
            <li
              key={car.id}
              className="bg-[linear-gradient(rgba(79,62,124,0.95),rgba(31,29,48,0.95))] hover:bg-gray-900   hover:scale-105 transition rounded-2xl overflow-hidden p-2.5"
            >
              <Link to={`/car_details/${car.id}`}>
                <img
                  src={car.images[0]}
                  alt={car.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold mt-2 text-white text-lg">
                    {car.name}
                  </h3>
                  <p className="my-1 font-semibold text-white text-lg">
                    ${car.price.toLocaleString()}
                  </p>

                  <p className="text-sm text-white">
                    {car.brand} • {car.year}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
