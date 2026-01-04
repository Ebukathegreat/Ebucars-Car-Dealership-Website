import { Outlet } from "react-router-dom";
import Navbar from "./pages-components/Navbar";

export default function App() {
  return (
    <div>
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
