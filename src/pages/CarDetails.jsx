import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function CarDetails() {
  const { id } = useParams();
  const [carDetails, setCarDetails] = useState({});
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const cachedDetails = sessionStorage.getItem(`cachedDetails_${id}`);

    if (cachedDetails) {
      const parsed = JSON.parse(cachedDetails);
      console.log("CACHED CAR DETAILS: ", parsed);
      setCarDetails(parsed);
      setLoading(false);
      return;
    }

    fetchCarDetails();
  }, []);

  async function fetchCarDetails() {
    try {
      const url = `https://ebucars-car-dealership-website.onrender.com/cars/${id}`;
      const data = await fetch(url);
      const results = await data.json();

      console.log("FETCHED RESULTS: ", results);
      setCarDetails(results);
      sessionStorage.setItem(`cachedDetails_${id}`, JSON.stringify(results));

      setLoading(false);
    } catch (err) {
      console.log("ERROR: ", err);
      setErrors(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div>
          <div className="flex items-center justify-center ">
            <p className="animate-spin text-4xl md:text-6xl ">🚙</p>
          </div>

          <p className="mt-7 text-xl font-bold">Please wait...</p>
        </div>
      </div>
    );
  }

  if (errors)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="bg-pink-50 text-pink-700 px-6 py-4 rounded-xl font-medium shadow-sm text-center max-w-md">
          Oops! Something went wrong while loading the car details. Don’t worry,
          please try again in a moment.
        </p>
      </div>
    );

  if (!carDetails)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="bg-blue-50 text-blue-700 px-6 py-4 rounded-xl font-medium shadow-sm text-center max-w-md">
          Hmm… we couldn't find the car you're looking for. Try checking another
          listing!
        </p>
      </div>
    );

  return (
    <div className=" min-h-screen  px-6 py-2 bg-[linear-gradient(rgba(79,62,124,0.95),rgba(31,29,48,0.95))]">
      <ul>
        <li
          key={carDetails.id}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start bg-white shadow-lg rounded-xl overflow-hidden"
        >
          {/* Left: Car Image */}
          <div className="w-full">
            <img
              src={carDetails?.images?.[0]}
              alt={carDetails.name}
              className="   w-full h-[92vh]   rounded-lg"
            />
          </div>

          {/* Right: Car Details */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {carDetails.name}
              </h1>
              <h2 className="text-lg text-gray-700 mb-2">
                {carDetails.description}
              </h2>
              <p className="text-xl font-semibold text-gray-800 mb-3">
                ${carDetails.price.toLocaleString()}
              </p>
              <p className="text-md text-gray-600">
                {carDetails.brand} • {carDetails.year} • {carDetails.condition}{" "}
                • {carDetails.transmission}
              </p>
              <p className="text-md text-gray-600 mt-1">
                Fuel: {carDetails.fuel} • Engine: {carDetails.engine} • Mileage:{" "}
                {carDetails.mileage} km
              </p>
              <p className="text-md text-gray-600 mt-1">
                Availability: {carDetails.availability} • Location:{" "}
                {carDetails.location} • Color: {carDetails.color}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mt-4 mb-2">Features:</h3>
              <ul className="grid grid-cols-2 gap-2">
                {carDetails.features?.map((feature, idx) => (
                  <li
                    key={idx}
                    className="bg-[linear-gradient(rgba(31,29,48,0.7),rgba(79,62,124,0.7))] text-white px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
