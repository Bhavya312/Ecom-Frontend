import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { api, del, get } from "../../../components/config/config";
import { useDispatch, useSelector } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
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
  const [pagination, setPagination] = useState({
                                                  pageIndex: 1,
                                                  pageSize: 10,
                                                });
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

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
        const response = await get(api.PRODUCTS, {params:{'limit':limit, "page":page == 0 ? 1 : page}});
        setPageCount(response.data.data.totalPages);
        dispatch(setProducts(response.data.data));
      } catch (err) {
        toast.error(err?.data?.msg || err.error || "Something went wrong");
      }
    };
    fetchProducts();
  }, [dispatch, limit, page]);
  
  const table = useReactTable({
    data: products?.data || [],
    columns,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
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
        table={table}
        route="products"
        message="Are you sure you want to delete this Product"
        setLimit={setLimit}
        setPage={setPage}
        page={page}
        totalRecords={products?.totalRows}
      />
    </div>
    </>
  );
};

export default List;
