import { useParams } from "react-router-dom";

export default function CarDetails() {
  const { id } = useParams();
  return <div>CarDetails: {id}</div>;
}
