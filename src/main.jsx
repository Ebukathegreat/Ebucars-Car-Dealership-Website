import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Cars from "./pages/Cars.jsx";
import CarDetails from "./pages/CarDetails.jsx";
import NewCars from "./pages/NewCars.jsx";
import UsedCars from "./pages/UsedCars.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "cars", element: <Cars /> },
      { path: "car_details/:id", element: <CarDetails /> },
      { path: "/new_cars", element: <NewCars /> },
      { path: "/used_cars", element: <UsedCars /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
