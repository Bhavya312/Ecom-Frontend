import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for mobile menu
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logout successfully");
    navigate("/login");
  };
  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold">
          E-COM2
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          {/* Show Customer Menu */}
          {!userInfo || userInfo.user.slug === "customer" ? (
            <>
              <li>
                <Link to="/" className="text-white hover:text-gray-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories/1" className="text-white hover:text-gray-300">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-white hover:text-gray-300">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-gray-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white hover:text-gray-300">
                  Contact
                </Link>
              </li>
            </>
          ) : (
            <>
              {/* Show Admin Menu */}
              <li>
                <Link to="/admin/dashboard" className="text-white hover:text-gray-300">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/categories" className="text-white hover:text-gray-300">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/admin/products" className="text-white hover:text-gray-300">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/admin/users" className="text-white hover:text-gray-300">
                  Users
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Login/Logout Buttons */}
        <div className="hidden md:flex space-x-4">
          {userInfo ? (
            <button
              onClick={logoutHandler}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-blue-700 text-white space-y-2 py-3 px-4">
          {!userInfo || userInfo.user.slug === "customer" ? (
            <>
              <li>
                <Link to="/" className="block py-2" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="block py-2" onClick={() => setIsOpen(false)}>
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="block py-2" onClick={() => setIsOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="block py-2" onClick={() => setIsOpen(false)}>
                  Contact
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/admin/dashboard" className="block py-2" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/categories" className="block py-2" onClick={() => setIsOpen(false)}>
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/admin/products" className="block py-2" onClick={() => setIsOpen(false)}>
                  Products
                </Link>
              </li>
              <li>
                <Link to="/admin/users" className="block py-2" onClick={() => setIsOpen(false)}>
                  Users
                </Link>
              </li>
            </>
          )}
          <li>
            {userInfo ? (
              <button
                onClick={() => {
                  logoutHandler();
                  setIsOpen(false);
                }}
                className="w-full text-left py-2 text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block py-2 text-green-400 hover:text-green-300"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navigation;
