import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useForm } from "react-hook-form";
import Banner from "../components/Banner";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { updateProfile } from "../redux/api/profileSlice";
import { api, get, post } from "../components/config/config";

const Profile = () => {
  const { token, user } = JSON.parse(localStorage.getItem("userInfo"));
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "John Doe",
      email: "john@example.com",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const profile = await get(api.PROFILE + "/" + user.id, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
          reset(profile.data.data);
          dispatch(updateProfile(profile.data.data));
        }
      } catch (err) {
        toast.error(err?.data?.msg || err.error || "Something went wrong");
      }
    };
    fetchData();
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      // if (data.email) formData.append("email", data.email);

      await post(api.PROFILE + `/` + user.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      toast.error(error.data.msg);
    }
  };

  return (
    <>
      <Banner name="Profile" />
      <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              disabled
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* DO this tommorow do not delete */}
          {/* <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} placeholder="Optional" />
          </div> */}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Update
          </Button>
        </form>
      </div>
    </>
  );
};

export default Profile;
