import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/Loader";

import {
  editUserValidator,
  type editUserValidatorType,
} from "@/validators/edit-user-validator";
import type { UserType } from "types";

const EditUserDialog = ({
  isVisible,
  setIsVisible,
  selectedUser,
  setUsers,
  setSelectedUser,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
  selectedUser: UserType | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<editUserValidatorType>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
    resolver: zodResolver(editUserValidator),
  });

  const { mutate: handleEditUser, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: editUserValidatorType) => {
      const { data } = await axios.put(
        `https://reqres.in/api/users/${selectedUser?.id}`,
        {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
        }
      );

      return data;
    },
    onSuccess: () => {
      toast.success("User details edited successfully");
      // Edit the details of the user in the list
      setUsers((prev) => {
        const newUsers = prev.map((user) => {
          if (user.id === selectedUser?.id) {
            return {
              id: user.id,
              first_name: getValues("firstName"),
              last_name: getValues("lastName"),
              email: getValues("email"),
              avatar: user.avatar,
            };
          } else {
            return user;
          }
        });
        return newUsers;
      });
      reset();
      setSelectedUser(null);
      setIsVisible(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later!");
      }
    },
  });

  useEffect(() => {
    if (selectedUser) {
      setValue("email", selectedUser.email);
      setValue("firstName", selectedUser.first_name);
      setValue("lastName", selectedUser.last_name);
    }
  }, [selectedUser]);
  return (
    <Dialog open={isVisible} onOpenChange={() => setIsVisible((prev) => !prev)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Click edit when done.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-y-6 items-center"
          onSubmit={handleSubmit((data) => handleEditUser(data))}
        >
          <div className="flex flex-col gap-y-3 w-full">
            <Label className="ml-1" htmlFor="email">
              Email
            </Label>
            <Input
              placeholder="Enter your email"
              id="email"
              type="email"
              required
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-rose-600 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-3 w-full">
            <Label className="ml-1" htmlFor="firstName">
              First Name
            </Label>
            <Input
              placeholder="Enter your first name"
              id="firstName"
              type="text"
              required
              {...register("firstName", { required: true })}
            />
            {errors.firstName && (
              <p className="text-rose-600 text-sm">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-y-3 w-full">
            <Label className="ml-1" htmlFor="lastName">
              Last Name
            </Label>
            <Input
              placeholder="Enter your last name"
              id="lastName"
              type="text"
              required
              {...register("lastName", { required: true })}
            />
            {errors.lastName && (
              <p className="text-rose-600 text-sm">{errors.lastName.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader />
                <p>Please wait</p>
              </>
            ) : (
              "Edit"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
