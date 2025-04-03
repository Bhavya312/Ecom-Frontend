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
import { api, post } from "../../../components/config/config";
import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { setProducts } from "../../../redux/api/productSlice";
import Loader from "../../../components/Loader";
import { addProductSchema } from "../../../schema/productSchema";
import { ErrorMessage } from "@hookform/error-message";

const Add = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const { loading } = useSelector((state) => state.loading);

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
      if(data.description) formData.append("description", data.description);
      if(data.image && data.image[0])  formData.append("image", data.image[0]);
      if(data.price) formData.append("price", data.price);
      if(data.quantity) formData.append("quantity", data.quantity);
      if(data.sku)  formData.append("sku", data.sku);
      await post(api.PRODUCTS, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.msg || err.error || "Something went wrong");
    }
  };
  if (loading) return <Loader />;

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-center">Add Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
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
            <Input
              id="sku"
              {...register("sku")}
              placeholder="Enter sku"
            />
            <ErrorMessage errors={errors} name="sku" />
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
