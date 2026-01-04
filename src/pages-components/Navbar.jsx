import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  // auto close sidebar on resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [open, setOpen] = useState(false);

  const location = useLocation();
  const pathname = location.pathname;

  const linkStyle = ({ isActive }) => {
    if (isActive) {
      return "text-green-500 font-bold px-4 py-2 block";
    }

    return pathname === "/" || window.innerWidth <= 600
      ? "text-white hover:text-yellow-400 font-bold px-4 py-2 block transition-colors duration-300"
      : "text-black hover:text-yellow-400 font-bold px-4 py-2 block transition-colors duration-300";
  };

  return (
    <nav
      className={`${
        pathname === "/" ? " absolute top-0 left-0 w-full  " : "relative"
      } flex items-center px-3.5 md:px-8 h-16 `}
    >
      {/* LEFT: Logo */}
      <Link to="/" className="text-white font-bold text-xl">
        Ebucars
      </Link>

      {/* CENTER: Desktop Links */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2  items-center gap-8">
        <NavLink to="/new_cars" end className={linkStyle}>
          New Cars
        </NavLink>

        <NavLink to="/used_cars" end className={linkStyle}>
          Used Cars
        </NavLink>

        <NavLink to="/about" end className={linkStyle}>
          About
        </NavLink>

        <NavLink to="/contact" end className={linkStyle}>
          Contact
        </NavLink>
      </div>

      {/* RIGHT: Search */}
      <div className="hidden md:flex ml-auto">
        <input
          type="text"
          placeholder="Search..."
          className={`${
            pathname === "/"
              ? "bg-white"
              : "bg-gray-600 text-white text-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]"
          } p-2 rounded-md outline-none `}
        />
      </div>

      <div
        className={`md:hidden flex ml-auto cursor-pointer ${
          pathname === "/" ? "text-white" : "text-black"
        } `}
        onClick={() => setOpen(!open)}
      >
        <FontAwesomeIcon icon={faBars} className="text-2xl " />
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[linear-gradient(rgba(31,29,48,0.7),rgba(79,62,124,0.7))]
 text-white p-2 z-50 transform transition-transform duration-300 ease-in-out ${
   open ? "translate-x-0" : "translate-x-full"
 }`}
      >
        <div className="flex justify-end px-4 pt-4">
          <button
            className="text-2xl mb-6 text-white cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <ul className="flex flex-col gap-3 text-lg  w-30">
          <NavLink
            to="/new_cars"
            end
            onClick={() => setOpen(false)}
            className={linkStyle}
          >
            New Cars
          </NavLink>

          <NavLink
            to="/used_cars"
            end
            onClick={() => setOpen(false)}
            className={linkStyle}
          >
            Used Cars
          </NavLink>

          <NavLink
            to="/about"
            end
            onClick={() => setOpen(false)}
            className={linkStyle}
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            end
            onClick={() => setOpen(false)}
            className={linkStyle}
          >
            Contact
          </NavLink>
        </ul>
      </div>
    </nav>
  );
}
