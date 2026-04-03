import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isExcludedPage =
    pathname === "/below_50000" ||
    pathname === "/fiftythousand_and_above" ||
    pathname.startsWith("/car_details");

  useEffect(() => {
    setSearchTerm("");
  }, [pathname]);

  // auto close sidebar on resize + track window width
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth); // update width state

      //close menu on resize
      if (window.innerWidth >= 768) setOpen(false);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const linkStyle = ({ isActive }) => {
    if (isActive) {
      return "text-green-500 font-bold px-4 py-2 block";
    }

    return pathname === "/" ||
      pathname === `/car_details/${id}` ||
      windowWidth <= 600
      ? "text-white hover:text-yellow-400 font-bold px-4 py-2 block transition-colors duration-300"
      : "text-black hover:text-yellow-400 font-bold px-4 py-2 block transition-colors duration-300";
  };

  function scrollToSectionById(e, id) {
    e.preventDefault();
    const sectionId = document.getElementById(id);

    if (sectionId) {
      sectionId.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <nav
      className={`${
        pathname === "/" ? " absolute top-0 left-0 w-full " : "relative"
      } ${
        pathname === `/car_details/${id}`
          ? "bg-[linear-gradient(rgba(31,29,48,0.95),rgba(79,62,124,0.95))] "
          : ""
      }
      } flex items-center px-3.5 md:px-8 h-16 `}
    >
      {/* LEFT: Logo */}
      <Link
        to="/"
        className={` ${
          pathname !== "/" ? "text-slate-900" : "text-[gold]"
        }   text-shadow-[1px_1px_2px_rgba(0,0,0,0.5)] font-extrabold text-2xl`}
      >
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

        <a
          href="#aboutId"
          className={`font-bold px-4 py-2 block transition-colors duration-300
    ${
      pathname === "/" || pathname === `/car_details/${id}`
        ? "text-white"
        : "text-black"
    }
    hover:text-yellow-400
  `}
          onClick={(e) => scrollToSectionById(e, "aboutId")}
        >
          About
        </a>

        <a
          href="#contactId"
          className={`font-bold px-4 py-2 block transition-colors duration-300
    ${
      pathname === "/" || pathname === `/car_details/${id}`
        ? "text-white"
        : "text-black"
    }
    hover:text-yellow-400
  `}
          onClick={(e) => scrollToSectionById(e, "contactId")}
        >
          Contact
        </a>
      </div>

      {/* RIGHT: Search */}
      <div className={`ml-auto ${isExcludedPage ? "hidden" : "block"}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            // If user is on pages that aren't the home and search page, disable the submit button to prevent a redirect to the search page because the onChange effect is already in place on those other pages. No need for onChange and onSubmit at the same time.
            if (pathname !== "/" && pathname !== "/search_page") {
              return;
            }

            navigate(`/search_page?searchTerm=${searchTerm}`);
          }}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);

              //Don't work on home and search pages
              if (pathname === "/" || pathname === "/search_page") return;

              if (e.target.value.trim() === "") {
                // 🔥 remove query completely
                navigate(pathname);
              } else {
                // add / update query
                navigate(`?searchTerm=${e.target.value}`);
              }
            }}
            className={`${
              pathname === "/"
                ? "bg-white"
                : "bg-gray-600 text-white text-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] "
            } p-1.5 sm:p-2 w-[180px] rounded-md outline-none `}
          />
        </form>
      </div>

      <div
        className={`md:hidden flex ml-auto cursor-pointer ${
          pathname === "/" || pathname === `/car_details/${id}`
            ? "text-white"
            : "text-black"
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

        <ul className="flex flex-col gap-3 text-lg  w-full">
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

          <a
            href="#aboutId"
            className={`font-bold px-4 py-2 block transition-colors duration-300 hover:text-yellow-400`}
            onClick={(e) => {
              setOpen(false), scrollToSectionById(e, "aboutId");
            }}
          >
            About
          </a>

          <a
            href="#contactId"
            className={`font-bold px-4 py-2 block transition-colors duration-300 hover:text-yellow-400`}
            onClick={(e) => {
              setOpen(false), scrollToSectionById(e, "contactId");
            }}
          >
            Contact
          </a>
        </ul>
      </div>
    </nav>
  );
}
