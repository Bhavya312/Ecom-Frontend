import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Pencil, Trash } from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import ConfirmModel from "./ConfirmModel";
import { useDispatch } from "react-redux";
import { openModel } from "../redux/api/confirmModelSlice";
import { Link } from "react-router-dom";

const ListComponent = ({ table, route, message, setLimit, setPage, page, totalRecords }) => {
  const dispatch = useDispatch();
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="bg-gray-200">
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="p-2 border">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
            <TableHead className="p-2 border">Actions</TableHead>
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} className="border">
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="p-2 border text-left">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
            <TableCell className="p-2 border text-center space-x-2">
              <Link to={`/admin/` + route + `/edit/` + row.original.id}>
                <Button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  <Pencil size={16} />
                </Button>
              </Link>
              <Button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() =>
                  dispatch(openModel({ id: row.original.id, message }))
                }
              >
                <Trash size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>
            {/* <Button
              className="border rounded p-1"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
            <Button
              className="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </Button>
            <Button
              className="border rounded p-1"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </Button> */}
          </TableCell>
          <TableCell>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount().toLocaleString()}
              </strong>
            </span>
          </TableCell>
          <TableCell>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                min="1"
                max={table.getPageCount()}
                defaultValue={page}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value): 1;
                  setPage(page);
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16"
              />
            </span>
          </TableCell>
          <TableCell>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                setLimit(e.target.value),
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span>Total {totalRecords}</span>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ListComponent;
