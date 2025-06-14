import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const Products = ({ products }) => {
  if (products.data && !products.data.length) return <></>;
  return (
    <section className="container mx-auto py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.data &&
          products?.data.map((product) => (
            <Card
              key={product.id}
              className={`hover:shadow-lg transition-shadow duration-300 h-50 text-white`}
            >
              <CardHeader className="p-0 h-70">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
              </CardHeader>
              <Link key={product.id} to={`/product/${product.id}`}>
                <CardContent className="p-4 text-center bg-black">
                  <CardTitle>{product.name}</CardTitle>
                </CardContent>
              </Link>
            </Card>
          ))}
      </div>
      <div className={products?.data?.length ? "hidden" : "block"}>
        <h3 className="font-bold text-center ">Products Not Found</h3>
      </div>
    </section>
  );
};

export default Products;
