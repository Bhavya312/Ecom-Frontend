  import { api, get, post } from "../components/config/config";
  import { Button } from "../components/ui/button";
  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { Link, useParams } from "react-router-dom";
  import { toast } from "react-toastify";
  import Loader from "../components/Loader";
  import { Input } from "../components/ui/input";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useForm } from "react-hook-form";
  import { addToCartSchema } from "../schema/productSchema";
  import { ErrorMessage } from "@hookform/error-message";
  import { updateCart } from "../redux/api/cartSlice";

  const ProductDetail = () => {
    const { id } = useParams();
    const { loading } = useSelector((state) => state.loading);
    const dispatch = useDispatch();
    const [product, setProduct] = useState({});
    const { userInfo } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      resolver: zodResolver(addToCartSchema),
    });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const productData = await get(api.PRODUCTS + "/" + id, {
            params: { limit: 10, page: 1, category_id: id },
          });
          setProduct(productData.data.data);
          reset({ quantity: 1 });
        } catch (err) {
          toast.error(err?.data?.msg || err.error || "Something went wrong");
        }
      };
      fetchData();
    }, [dispatch, id, reset]);

const addToCart = async (data) => {
  const formData = {
    user_id: userInfo?.user?.id,
    product_id: product.id,
    quantity: data.quantity,
  };

  if (!cart || Object.keys(cart).length === 0) {
    const existingCart = await get(api.CARTS + "/user", {
      params: { user_id: userInfo?.user.id },
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo?.token}`,
      },
    });

    dispatch(updateCart(existingCart?.data?.data?.data));

    if (Object.keys(existingCart?.data).length === 0) {
      const createCart = await post(api.CARTS, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      dispatch(updateCart(createCart.data.data.data));
    }
  } else {
    if (!cart) {
      const createCart = await post(api.CARTS, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      dispatch(updateCart(createCart.data.data.data));
    } else {
      delete formData.user_id;
      formData.cart_id = cart?.id;
      formData.type = 1;

      const cartUpdate = await post(api.CARTS + "/update", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      dispatch(updateCart(cartUpdate.data.data));
    }
  }
};

    if (loading) return <Loader />;
    return (
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">{product.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-96 object-cover rounded-md"
            />
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Categories</p>
              {product.categories &&
                product.categories.map((category) => {
                  return (
                    <Link key={category.id} to={`/categories/${category.id}`}>
                      {category.name}{" "}
                    </Link>
                  );
                })}
            </div>

            <div>
              <p className="text-lg font-semibold">Price</p>
              <p className="text-2xl font-bold text-green-600">
                ₹ {product.price}
              </p>
            </div>

            <div>
              <p className="text-lg font-semibold">Description</p>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {userInfo && (
              <div className="flex gap-4 mt-4">
                <form
                  onSubmit={handleSubmit(addToCart)}
                  className="flex justify-between space-x-3"
                >
                  <div className="m-auto">
                    <Input
                      className="w-20"
                      {...register("quantity")}
                      type="number"
                      min={1}
                    />
                    <ErrorMessage errors={errors} name="quantity" />
                  </div>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add to Cart
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default ProductDetail;
