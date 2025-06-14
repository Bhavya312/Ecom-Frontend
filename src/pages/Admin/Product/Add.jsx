import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { api, get, post } from "../../../components/config/config";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { setProducts } from "../../../redux/api/productSlice";
import Loader from "../../../components/Loader";
import { addProductSchema } from "../../../schema/productSchema";
import { ErrorMessage } from "@hookform/error-message";
import { setCategories } from "../../../redux/api/categorySlice";

const Add = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const { loading } = useSelector((state) => state.loading);
  const { userInfo } = useSelector((state) => state.auth);
  const token = userInfo.token;
  
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(addProductSchema),
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const { categories } = useSelector((state) => state.categories);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!categories.data) {
          const categoriesData = await get(api.CATEGORIES, {
            params: { sort_order: "asc" },
          });
          dispatch(setCategories(categoriesData.data.data));
        }
      } catch (err) {
        toast.error(err?.data?.msg || err.error || "Something went wrong");
      }
    };
    fetchData();
  }, [categories, dispatch]);

  const removeImage = () => {
    setImagePreview(null);
    reset({
      image: null,
    });
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.image && data.image[0]) formData.append("image", data.image[0]);
      if (data.price) formData.append("price", data.price);
      if (data.quantity) formData.append("quantity", data.quantity);
      if (data.sku) formData.append("sku", data.sku);
      if (data.categories){
        data.categories.map((id, index) => {
          formData.append(`category_id[${index}]`, id);
        });
      }

      await post(api.PRODUCTS, formData, {
        headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` },
      });
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.msg || err.error || "Something went wrong");
    }
  };
  if (loading) return <Loader />;

  return (
    <Card className="max-w-lg mx-auto mt-10 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-center">Add Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">*Name</Label>
            <Input
              type="text"
              id="name"
              {...register("name")}
              placeholder="Enter Product name"
            />
            <ErrorMessage errors={errors} name="name" />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter description"
            />
            <ErrorMessage errors={errors} name="description" />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              {...register("price")}
              placeholder="Enter price"
            />
            <ErrorMessage errors={errors} name="price" />
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              {...register("quantity")}
              placeholder="Enter quantity"
            />
            <ErrorMessage errors={errors} name="quantity" />
          </div>

          <div>
            <Label htmlFor="sku">Sku</Label>
            <Input id="sku" {...register("sku")} placeholder="Enter sku" />
            <ErrorMessage errors={errors} name="sku" />
          </div>

          <div className="py-7">
            <Label htmlFor="categories">Categories</Label>
            <div className="overflow-y-scroll h-30 mt-5">
              <ul>
                {categories.data &&
                  categories.data.map((category) => (
                    <li key={category.id} className="flex justify-left">
                      <input
                        type="checkbox"
                        value={category.id}
                        id={category.id}
                        {...register("categories", { valueAsArray: true })}
                        className="mr-5 mb-2"
                      />
                      <Label htmlFor={`${category.id}`}>{category?.name}</Label>
                    </li>
                  ))}
              </ul>
              <ErrorMessage errors={errors} name="categories" />
            </div>
          </div>

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

          {imagePreview && (
            <div className="relative mt-4">
              <img
                src={imagePreview}
                alt="Selected"
                className="w-full h-48 object-cover rounded-lg border shadow-md"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Add;
