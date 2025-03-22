import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schema/authSchema";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from "../redux/features/auth/authSlice";
import { api, post } from "../components/config/config";

function Register() {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const {name, email, password} = data;
      const res = await post(api.REGISTER, { name, email, password });
      dispatch(setCredentials({ ...res.data }));
      toast.success("Registered Successfully");
      navigate(redirect);
    } catch (error) {
      toast.error(error.data.msg);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Register
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-1" htmlFor="name">
              User Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your full name"
              {...register("name")}
            />
            <ErrorMessage errors={errors} name="name" />
          </div>

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

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label
              className="block text-gray-600 text-sm mb-1"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
            />
            <ErrorMessage errors={errors} name="confirmPassword" />
          </div>

          {/* Register Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
