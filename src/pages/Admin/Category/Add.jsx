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
import { api, get, post } from "../../../components/config/config";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../../../redux/api/categorySlice";
import Loader from "../../../components/Loader";
import { addCategorySchema } from "../../../schema/categorySchema";
import { ErrorMessage } from "@hookform/error-message";

const Add = () => {
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
    control,
  } = useForm({
    resolver: zodResolver(addCategorySchema),
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
    reset({
      image: null,
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await get(api.CATEGORIES);
        dispatch(setCategories(response.data.data));
      } catch (err) {
        toast.error(err?.data?.msg || err.error || "Something went wrong");
      }
    };
    fetchCategories();
  }, [dispatch]);
  const { categories } = useSelector((state) => state.categories);

  const handleCategoryChange = useCallback((value) => {
    const selectedCategory = categories.find((cat) => cat.id === Number(value));
    setSelectedCategory(selectedCategory);
  }, [categories]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.image[0]) formData.append("image", data.image[0]);
      if (selectedCategory.id) formData.append("parent_id", selectedCategory.id);
      await post(api.CATEGORIES, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/categories");
    } catch (error) {
      toast.error(error.data.msg);
    }
  };
  if (loading) return <Loader />;

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-center">Add Category</CardTitle>
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
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Parent Category" >
                    {selectedCategory ? selectedCategory.name : "Select Parent Category"}
                      </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
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
          <div>
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
            Create
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Add;
