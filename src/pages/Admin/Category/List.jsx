import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { api, del, get } from "../../../components/config/config";
import { deleteCategory, setCategories } from "../../../redux/api/categorySlice";
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

const List = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { loading } = useSelector((state) => state.loading);
  const { isOpen } = useSelector((state) => state.confirmModel);

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Category Name" },
      { accessorKey: "description", header: "Description" },
    ],
    []
  );

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

  const data = useReactTable({
    data: categories || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelte = async (id) => {
    try {
      await del(api.CATEGORIES + `/${id}`);
      dispatch(deleteCategory(id));
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
        <Link to="/admin/categories/add">
        <Button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2">
          <Plus size={16} /> New Category
        </Button>
        </Link>
      </div>

      <ListComponent
        data={data}
        route="categories"
        message="Are you sure you want to delete this category"
      />
    </div>
    </>
  );
};

export default List;
