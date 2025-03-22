import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../redux/features/auth/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/authSchema";
import { ErrorMessage } from "@hookform/error-message";
import { post, api } from "../components/config/config";
import { setLoading } from "../redux/features/loadingSlice";
import { Button } from "../components/ui/button.jsx";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.loading);
  // const { error } = useSelector((state) => state.error);
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();

  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      if (userInfo.user.slug === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(redirect);
      }
    }
  }, [navigate, redirect, userInfo]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
  });

  const submitHandler = async (data) => {
    try {
      const res = await post(api.LOGIN, { ...data });
      dispatch(setCredentials({ ...res.data }));
      dispatch(setLoading(false));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.msg || err.error);
    }
  };
  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
            Login
          </h2>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              {...register("email")}
            />
            <ErrorMessage errors={errors} name="email" />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              className="block text-gray-600 text-sm mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              {...register("password")}
            />
            <ErrorMessage errors={errors} name="password" />
          </div>

          {/* Login Button */}
          <Button
            variant="default"
            type="submit"
            disabled={loading}
            className=" bg-blue-500 py-2 w-full hover:bg-white hover:text-blue-500 border boder-blue-500"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          {/* Register Link */}
          <p className="text-sm text-gray-600 mt-4 text-center">
            {`Don't have an account?`}{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </form>
  );
};

export default Login;
