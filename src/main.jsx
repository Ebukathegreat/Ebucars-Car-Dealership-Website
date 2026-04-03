import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CarDetails from "./pages/CarDetails.jsx";
import NewCars from "./pages/NewCars.jsx";
import UsedCars from "./pages/UsedCars.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import Brands from "./pages/Brands.jsx";
import AllCars from "./pages/AllCars.jsx";
import Below_50000 from "./pages/Below_50,000.jsx";
import FiftyThousand_And_Above from "./pages/FiftyThousand_And_Above.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "car_details/:id", element: <CarDetails /> },
      { path: "/new_cars", element: <NewCars /> },
      { path: "/used_cars", element: <UsedCars /> },
      { path: "/search_page", element: <SearchPage /> },
      { path: "/brands/:brand", element: <Brands /> },
      { path: "/all_cars", element: <AllCars /> },
      { path: "/below_50000", element: <Below_50000 /> },
      {
        path: "/fiftythousand_and_above",
        element: <FiftyThousand_And_Above />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
