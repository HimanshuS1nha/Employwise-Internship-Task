import { Pencil, Trash2 } from "lucide-react";
import React from "react";

import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";

import type { UserType } from "types";

const UserCard = ({
  user,
  setSelectedUser,
  setShowDeleteUserDialog,
  setShowEditUserDialog,
}: {
  user: UserType;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  setShowDeleteUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Card key={user.id} className="w-[90%] sm:w-[350px]">
      <CardHeader className="items-center gap-y-3">
        <img src={user.avatar} alt={user.first_name} className="rounded-full" />
        <CardTitle>
          {user.first_name} {user.last_name}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-center gap-x-4">
        <Button
          onClick={() => {
            setSelectedUser(user);
            setShowEditUserDialog(true);
          }}
        >
          <Pencil size={20} color="white" />
        </Button>
        <Button
          variant={"destructive"}
          onClick={() => {
            setSelectedUser(user);
            setShowDeleteUserDialog(true);
          }}
        >
          <Trash2 size={20} color="white" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
