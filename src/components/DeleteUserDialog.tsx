import React from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

const DeleteUserDialog = ({
  isVisible,
  setIsVisible,
  deleteUser,
  isPending,
}: {
  isVisible: boolean;
  isPending: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  deleteUser: () => void;
}) => {
  return (
    <Dialog open={isVisible} onOpenChange={() => setIsVisible((prev) => !prev)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            user.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"secondary"} onClick={() => setIsVisible(false)}>
            Cancel
          </Button>
          <Button
            variant={"destructive"}
            disabled={isPending}
            onClick={deleteUser}
          >
            {isPending ? (
              <>
                <Loader2 color="white" className="animate-spin" />
                <p>Please wait</p>
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
