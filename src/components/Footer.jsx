import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-pink-50 text-gray-700 py-10 px-4 mt-10 shadow-inner">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-pink-600">Bakery</h3>
          <p className="text-sm mt-2">Freshly baked with love every day.</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/" className="hover:text-pink-600">
                Home
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-pink-600">
                Products
              </a>
            </li>
            <li>
              <a href="/cart" className="hover:text-pink-600">
                Cart
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-pink-600">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Support</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#" className="hover:text-pink-600">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-600">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-600">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Follow Us</h4>
          <div className="flex space-x-4 text-pink-600 mt-2">
            <a href="#">
              <FaFacebookF className="hover:text-blue-600" />
            </a>
            <a href="#">
              <FaInstagram className="hover:text-pink-500" />
            </a>
            <a href="#">
              <FaTwitter className="hover:text-blue-400" />
            </a>
            <a href="#">
              <FaYoutube className="hover:text-red-600" />
            </a>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} Bakery Bliss. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
