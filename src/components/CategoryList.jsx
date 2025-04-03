import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { api, get } from "./config/config";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../redux/api/categorySlice";

const CategoryList = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    const fetchData = async () => {
      try{
        if(!categories.length){
          const categoriesData = await get(api.CATEGORIES);
          dispatch(setCategories(categoriesData.data.data));
        }
      }catch(err){
        toast.error(err?.data?.msg || err.error || "Something went wrong");
      }
    };
    fetchData();
  });
  
  return (
    <section className="container mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Shop by Category</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories?.map((category) => (
          <Link key={category.id} to={`/categories/${category.id}`}>
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
      <div className={categories.length ? 'hidden' : 'block'}>
        <h3 className="font-bold text-center ">Categories Not Found</h3>
      </div>
    </section>
  );
};

export default CategoryList;
