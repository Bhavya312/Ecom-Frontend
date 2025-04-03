import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { api, del, get } from "../../../components/config/config";
import { useDispatch, useSelector } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import Loader from "../../../components/Loader";
import ListComponent from "../../../components/ListComponent";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";
import ConfirmModel from "../../../components/ConfirmModel";
import { Link } from "react-router-dom";
import { deleteProduct, setProducts } from "../../../redux/api/productSlice";

const List = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { loading } = useSelector((state) => state.loading);
  const { isOpen } = useSelector((state) => state.confirmModel);

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Product Name" },
      { accessorKey: "description", header: "Description" },
      { accessorKey: "price", header: "price" },
      { accessorKey: "quantity", header: "quantity" },
      { accessorKey: "sku", header: "sku" },
    ],
    []
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get(api.PRODUCTS);
        dispatch(setProducts(response.data.data));
      } catch (err) {
        toast.error(err?.data?.msg || err.error || "Something went wrong");
      }
    };
    fetchProducts();
  }, [dispatch]);

  const data = useReactTable({
    data: products || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelte = async (id) => {
    try {
      await del(api.PRODUCTS + `/${id}`);
      dispatch(deleteProduct(id));
    } catch (err) {
      toast.error(err?.data?.msg || err.error || "Something went wrong");
    }
  };
  if (loading) return <Loader />;

  return (
    <>
    {isOpen && <ConfirmModel onConfirm={handleDelte} />}
    <div className="p-6 bg-white rounded-lg shadow-md text-center">
      <div className="flex justify-end mb-4">
        <Link to="/admin/products/add">
        <Button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2">
          <Plus size={16} /> New Product
        </Button>
        </Link>
      </div>

      <ListComponent
        data={data}
        route="products"
        message="Are you sure you want to delete this Product"
      />
    </div>
    </>
  );
};

export default List;
