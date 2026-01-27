import { Link, Links } from "react-router-dom";
import { motion } from "framer-motion";
import { FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  const pageLinks = [
    ["/all_cars", "All Cars"],
    ["/new_cars", "New Cars"],
    ["used_cars", "Used Cars"],
    ["brands/land rover", "Land Rover Cars"],
    ["brands/toyota", "Toyota Cars"],
    ["brands/bmw", "BMW Cars"],
    ["brands/mercedes", "Mercedes Cars"],
  ];

  return (
    <motion.footer
      id="aboutId"
      initial={{ opacity: 0, y: 90 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-[linear-gradient(rgba(31,29,48,0.95),rgba(79,62,124,0.95))] text-white  "
    >
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold text-[gold]">Ebucars</h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-200">
            Ebucars is a premium car dealership platform designed to help
            everyone discover high-quality new and used vehicles with
            confidence, style, and ease.
          </p>

          {/* Socials */}
          <div className="flex gap-4 mt-6 text-xl">
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-[gold] transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-[gold] transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-[gold] transition"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="mailto:support@ebucars.com"
              aria-label="Email"
              className="hover:text-[gold] transition"
            >
              <MdEmail />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            {pageLinks.map(([lnk, title]) => (
              <li key={title}>
                <Link to={lnk} className="hover:text-[gold] transition">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div id="contactId">
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>Email: support@ebucars.com</li>
            <li>Location: Texas, U.S.A</li>
            <li>Availability: Mon - Sat, 9am - 6pm</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Ebucars. All rights reserved.
      </div>
    </motion.footer>
  );
}
