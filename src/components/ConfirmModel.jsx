import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { closeModel } from "../redux/api/confirmModelSlice";

const ConfirmModel = ({ onConfirm }) => {
  const dispatch = useDispatch();
  const { isOpen, itemId, message } = useSelector(
    (state) => state.confirmModel
  );
  const handleConfirm = () => {
    onConfirm(itemId);
    dispatch(closeModel());
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeModel())}>
      <DialogContent className="p-6">
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogDescription className="text-black font-bold">{message}</DialogDescription>
        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => dispatch(closeModel())}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModel;
