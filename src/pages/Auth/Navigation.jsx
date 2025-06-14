import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ShoppingCart, X, User } from "lucide-react"; // Icons for mobile menu
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { api, get } from "../../components/config/config";
import { updateCart } from "../../redux/api/cartSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  useEffect(() => {
    const fetchData = async () => {
      if (!cart || Object.keys(cart).length === 0) {
        try {
          const res1 = await get(api.CARTS + "/user", {
            params: { user_id: userInfo?.user.id },
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userInfo?.token}`,
            },
          });

          const cartData = res1.data?.data;
          if (cartData) {
            dispatch(updateCart(cartData));

            // Fetch full cart details by ID
            const res2 = await get(api.CARTS + "/" + cartData.id, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${userInfo?.token}`,
              },
            });

            dispatch(updateCart(res2.data?.data));
          }
        } catch (err) {
          console.error("Failed to fetch cart", err);
        }
      }
    };

    fetchData();
  }, [dispatch, userInfo]);
  const cartItemCount = cart?.products?.length || null;

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logout successfully");
    navigate("/login");
  };
  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          E-COM2
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          {/* Customer Menu */}
          {!userInfo || userInfo.user.slug === "customer" ? (
            <>
              <li>
                <Link to="/" className="text-white hover:text-gray-300">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/1"
                  className="text-white hover:text-gray-300"
                >
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
              {/* Admin Menu */}
              <li>
                <Link
                  to="/admin/dashboard"
                  className="text-white hover:text-gray-300"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/categories"
                  className="text-white hover:text-gray-300"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/products"
                  className="text-white hover:text-gray-300"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/users"
                  className="text-white hover:text-gray-300"
                >
                  Users
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="relative flex gap-4 items-center left-40">
          <Link to="/cart" className="relative inline-flex items-center">
            <ShoppingCart className="w-7 h-7 text-black" />
            {cartItemCount > 0 && (
              <span className="absolute -top-3 left-3 text-white  text-xl font-semibold rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>

          {userInfo && (
            <Link to="/profile">
              <User className="h-6 text-white hover:text-gray-300" />
            </Link>
          )}
        </div>

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
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-blue-700 text-white space-y-2 py-3 px-4">
          {!userInfo || userInfo.user.slug === "customer" ? (
            <>
              <li>
                <Link
                  to="/"
                  className="block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/admin/dashboard"
                  className="block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/categories"
                  className="block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/products"
                  className="block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/users"
                  className="block py-2"
                  onClick={() => setIsOpen(false)}
                >
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
