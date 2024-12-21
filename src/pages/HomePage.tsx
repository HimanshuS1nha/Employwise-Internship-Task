import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BrandLogo from "@/components/BrandLogo";
import UserCard from "@/components/UserCard";
import DeleteUserDialog from "@/components/DeleteUserDialog";
import PaginationControls from "@/components/PaginationControls";
import EditUserDialog from "@/components/EditUserDialog";

import type { UserType } from "../../types";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // For pagination
  const currentPage = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;

  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null); // To store the user which is to be deleted or edited
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      // Check if users list contains any user matching the searchQuery or not
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { data, isLoading, error } = useQuery({
    queryKey: [`get-users-${currentPage}`],
    queryFn: async () => {
      // Get all the data at once and store in a state
      const { data: data1 } = (await axios.get(
        `https://reqres.in/api/users?page=1`
      )) as { data: { data: UserType[]; total_pages: number } };
      const { data: data2 } = (await axios.get(
        `https://reqres.in/api/users?page=2`
      )) as { data: { data: UserType[]; total_pages: number } };

      return {
        totalPages: data1.total_pages,
        data: [...data1.data, ...data2.data],
      };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Some error occured. Please try again later!");
    }
  }

  const { mutate: handleDeleteUser, isPending: deleteUserPending } =
    useMutation({
      mutationKey: ["delete-user"],
      mutationFn: async () => {
        if (!selectedUser) {
          throw new Error("User not found");
        }

        const { data } = await axios.delete(
          `https://reqres.in/api/users/${selectedUser.id}`
        );
        return data;
      },
      onSuccess: () => {
        // Remove the user from the list
        setUsers((prev) => {
          const newUsers = prev.filter((user) => user.id !== selectedUser!.id);
          return newUsers;
        });
        toast.success("User deleted successfully");
        setSelectedUser(null);
        setShowDeleteUserDialog(false);
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
    if (data) {
      if (users.length === 0) {
        setUsers(data.data);
      }
    }
  }, [data]);
  return (
    <main className="w-full h-[100dvh] flex flex-col items-center gap-y-10 mt-16 md:mt-6 relative">
      <DeleteUserDialog
        isVisible={showDeleteUserDialog}
        deleteUser={handleDeleteUser}
        isPending={deleteUserPending}
        setIsVisible={setShowDeleteUserDialog}
      />
      <EditUserDialog
        isVisible={showEditUserDialog}
        setIsVisible={setShowEditUserDialog}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setUsers={setUsers}
      />

      <Button
        variant={"destructive"}
        className="fixed top-5 right-5"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }}
      >
        Logout
      </Button>

      <BrandLogo />

      <Input
        placeholder="Search users by name..."
        className="w-[90%] md:w-[75%]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="flex flex-wrap gap-5 items-center justify-center w-[90%] md:w-[75%]">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader className="size-10 animate-spin" color="blue" />
          </div>
        ) : (
          filteredUsers
            .slice(
              currentPage === 1 || filteredUsers.length < 6 ? 0 : 6,
              6 * currentPage
            ) // Show 6 results per page
            .map((user) => {
              return (
                <UserCard
                  key={user.id}
                  user={user}
                  setSelectedUser={setSelectedUser}
                  setShowDeleteUserDialog={setShowDeleteUserDialog}
                  setShowEditUserDialog={setShowEditUserDialog}
                />
              );
            })
        )}
      </div>

      {data && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={data.totalPages}
          users={filteredUsers}
        />
      )}
    </main>
  );
};

export default HomePage;
