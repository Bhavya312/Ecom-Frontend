import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { api, get, patch, post } from "../../../components/config/config";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../../../redux/api/categorySlice";
import Loader from "../../../components/Loader";
import { addCategorySchema } from "../../../schema/categorySchema";
import { ErrorMessage } from "@hookform/error-message";

const Edit = () => {
  let { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { loading } = useSelector((state) => state.loading);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
    control,
  } = useForm({
    // resolver: zodResolver(addCategorySchema),
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    reset({ image: "", parent_id: selectedCategory?.id ?? "null" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const category = await get(api.CATEGORIES + `/` + id);
        const categories = await get(api.CATEGORIES);

        const { image } = category.data.data;
        setImagePreview(image);
        reset(category.data.data);

        const selectedCategory = category
          ? categories.data.data.find(
              (cat) => cat.id === category.data.data.parent_id
            )
          : null;

        setSelectedCategory(selectedCategory);

        const currentCategory = category
          ? categories.data.data.find((cat) => cat.id === category.data.data.id)
          : null;

        const categoriesData = category
          ? categories.data.data.filter((cat) => cat.id !== currentCategory.id)
          : categories.data.data;

        dispatch(setCategories(categoriesData));
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.msg || err.error || "Something went wrong");
      }
    };
    fetchData();
  }, [dispatch, id]);

  const { categories } = useSelector((state) => state.categories);

  const handleCategoryChange = (value) => {
    const selectedCategory = categories.find((cat) => cat.id === Number(value));
    setSelectedCategory(selectedCategory);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);

      if (data.image && typeof data.image !== "string") {
        console.log("file");
        formData.append("image", data.image[0]);
      } else if (typeof imagePreview == "string") {
        console.log("string");
        formData.append("image", imagePreview);
      }

      formData.append("parent_id", selectedCategory?.id ?? "");

      await post(api.CATEGORIES + `/` + id, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // navigate("/admin/categories");
    } catch (error) {
      toast.error(error.data.msg);
    }
  };

  if (loading) return <Loader />;
  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-center">Edit Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter category name"
            />
            <ErrorMessage errors={errors} name="name" />
          </div>

          {/* Parent Category Dropdown */}
          <div>
            <Label htmlFor="parent_id">Parent Category</Label>
            <Controller
              name="parent_id"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCategoryChange(value);
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="null">Select an option</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Description Input */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter description"
            />
            <ErrorMessage errors={errors} name="description" />
          </div>

          {/* Image Upload */}
          <div className={imagePreview ? `hidden` : `block`}>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              {...register("image")}
              className="cursor-pointer"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          {/* Image Preview Section */}
          {imagePreview && (
            <div className="relative mt-4">
              <img
                src={imagePreview}
                alt="Selected"
                className="w-full h-48 object-cover rounded-lg border shadow-md"
              />
              {/* Remove Image Button */}
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Update
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Edit;
