import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminDashboard from "../pages/Admin/Dashboard";
import { AdminCategory, AdminAddCategory, AdminEditCategory } from "../pages/Admin/Category";
import Home from "../pages/Home";
import ProductList from "../pages/ProductList";
import ProductDetail from "../pages/ProductDetail";
import Category from "../pages/Category";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import UserDashboard from "../pages/UserDashboard";
import { AdminAddProduct, AdminProducts, AdminEditProduct } from "../pages/Admin/Product";

const AdminProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo?.user?.role === 'Admin' ? <Outlet /> : <Navigate to="/" replace />;
};

const ProtectedRoute = () => {
  const { userinfo } = useSelector((state) => state.auth);
  return userinfo ? <Outlet /> : <Navigate to="/login" replace />;
};

const CommonRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/category/:id" element={<Category />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        {/* <Route path="/orders" element={<OrderHistory />} />
        <Route path="/wishlist" element={<Wishlist />} /> */}
      </Route>
      
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<AdminCategory />} />
        <Route path="/admin/categories/add" element={<AdminAddCategory />} />
        <Route path="/admin/categories/edit/:id" element={<AdminEditCategory />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/add" element={<AdminAddProduct />} />
        <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />
        {/* <Route path="/admin/orders" element={<OrderManagement />} />
        <Route path="/admin/users" element={<UserManagement />} /> */}
      </Route>
    </Routes>
  )
}

export default CommonRoutes
