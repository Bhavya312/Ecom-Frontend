import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { api, get } from "./config/config";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/api/productSlice";

const ProductList = () => {

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!products.data) {
          const response = await get(api.PRODUCTS, {
            params: { limit: 4, page: 1 },
          });
          dispatch(setProducts(response.data.data));
        }
      } catch (err) {
        toast.error(err?.data?.msg || err.error || "Something went wrong");
      }
    };
    fetchData();
  }, [products, dispatch]);

  return (
    <section className="container mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.data &&
          products?.data.map((category) => (
            <Link key={category.id} to={`/products/${category.id}`}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4 text-center">
                  <CardTitle>{category.name}</CardTitle>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
      <div className={products?.data?.length ? "hidden" : "block"}>
        <h3 className="font-bold text-center ">Product Not Found</h3>
      </div>
    </section>
  );
};

export default ProductList;
