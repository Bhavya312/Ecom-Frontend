import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "./ui/card";

const SubCategories = ({categories}) => {
  
  if(categories.data && !categories.data.length) return <></>;
  return (
    <section className="container mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Sub Categories</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories?.data &&
          categories?.data.map((category) => (
            <Link key={category.id} to={`/categories/${category.id}`}>
              <Card className="hover:shadow-lg transition-shadow duration-300 bg-blue-700 text-white">
                <CardContent className="p-4 text-center">
                  <CardTitle>{category.name}</CardTitle>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
      <div className={categories?.data?.length ? "hidden" : "block"}>
        <h3 className="font-bold text-center ">Categories Not Found</h3>
      </div>
    </section>
  );
};

export default SubCategories;
