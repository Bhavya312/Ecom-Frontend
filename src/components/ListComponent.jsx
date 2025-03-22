import {
  Table,
  TableBody,
  TableCell,
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

const ListComponent = ({ data, route, message }) => {
  const dispatch = useDispatch();
  return (
    <Table>
      <TableHeader>
        {data.getHeaderGroups().map((headerGroup) => (
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
        {data.getRowModel().rows.map((row) => (
          <TableRow key={row.id} className="border">
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="p-2 border text-left">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
            <TableCell className="p-2 border text-center space-x-2">
              <Link to={`/admin/`+route+`/edit/`+row.original.id}>
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
    </Table>
  );
};

export default ListComponent;
