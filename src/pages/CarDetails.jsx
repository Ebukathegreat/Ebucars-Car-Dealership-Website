import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function CarDetails() {
  const { id } = useParams();

  useEffect(() => {
    async function fetchCarDetails() {
      try {
        const url = `https://ebucars-car-dealership-website.onrender.com/cars/${id}`;
        const data = await fetch(url);
        const results = await data.json();

        console.log("THESE ARE: ", results);
        setAllCars(results);
      } catch (err) {
        console.log("ERROR: ", err);
        setErrors(err);
      }
    }

    fetchCarDetails();
  }, []);
  return <div>CarDetails: {id}</div>;
}
