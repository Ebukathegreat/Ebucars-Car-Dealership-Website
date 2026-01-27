import { Outlet } from "react-router-dom";
import Navbar from "./pages-components/Navbar";
import Footer from "./pages-components/Footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
