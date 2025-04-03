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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../../../redux/api/categorySlice";
import Loader from "../../../components/Loader";
import { addCategorySchema } from "../../../schema/categorySchema";
import { ErrorMessage } from "@hookform/error-message";

const Edit = () => {
  let { id } = useParams();
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
    reset({ image: "" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const product = await get(api.PRODUCTS + `/` + id);
        const { image } = product.data.data;
        setImagePreview(image);
        reset(product.data.data);
      } catch (err) {
        toast.error(err?.data?.msg || err.error || "Something went wrong");
      }
    };
    fetchData();
  }, [dispatch, reset, id]);

  const onSubmit = async (data) => {
    try {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.description) formData.append("description", data.description);

        if (data.image && typeof data.image !== "string") {
          formData.append("image", data.image[0]);
        } else if (typeof imagePreview == "string") {
          formData.append("image", imagePreview);
        }

        if(data.price) formData.append("price", data.price);
        if(data.quantity) formData.append("quantity", data.quantity);
        if(data.sku)  formData.append("sku", data.sku);

        await post(api.PRODUCTS + `/` + id, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate("/admin/products");
    } catch (error) {
      toast.error(error.data.msg);
    }
  };

  if (loading) return <Loader />;
  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-center">Edit Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          encType="multipart/form-data"
        >
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
            Update
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Edit;
