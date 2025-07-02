import { Link, NavLink } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { logout as handleLogout } from "../utils/auth";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

function Navbar() {
  const { cartCount } = useCart(); 

  // ✅ Add user state to track login status
  const [user, setUser] = useState(null);

  // ✅ Read user from localStorage once when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ When user logs out, clear localStorage & update state
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    handleLogout(); // keep any other logout logic you already have
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-pink-600">
          Bakery
        </Link>

        <div className="space-x-4 flex items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-pink-600 font-semibold" : "text-gray-700"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "text-pink-600 font-semibold" : "text-gray-700"
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/cart"
            className="relative text-gray-700 hover:text-pink-600"
          >
            <FiShoppingCart className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </NavLink>

          {user ? (
            <button
              onClick={logout}
              className="text-gray-700 hover:text-pink-600 font-medium"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "text-pink-600 font-semibold" : "text-gray-700"
              }
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
