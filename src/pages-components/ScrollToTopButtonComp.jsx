import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTopButtonComp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // 1. Determine the threshold based on the page
      const threshold = window.innerWidth <= 600 ? 1500 : 500;
      // 2. Compare current scroll to that specific threshold
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    window.addEventListener("resize", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("resize", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-0 z-50 bg-yellow-400 hover:bg-yellow-400 text-black p-1 md:p-2 rounded-full shadow-lg transition-transform transform hover:scale-110 cursor-pointer"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
}
