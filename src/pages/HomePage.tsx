import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "@/components/Loader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import BrandLogo from "@/components/BrandLogo";

import type { UserType } from "../../types";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;

  const { data, isLoading, error } = useQuery({
    queryKey: [`get-users-${currentPage}`],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://reqres.in/api/users?page=${currentPage}`
      );
      return data as {
        data: UserType[];
        total_pages: number;
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
  return (
    <main className="w-full h-[100dvh] flex flex-col items-center gap-y-10 mt-6 relative">
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

      <Input placeholder="Search users by name..." className="w-[75%]" />

      <div className="flex flex-wrap gap-5 items-center justify-center w-[75%]">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader className="size-10 animate-spin" color="blue" />
          </div>
        ) : (
          data?.data?.map((item) => {
            return (
              <Card key={item.id} className="w-[350px]">
                <CardHeader className="items-center gap-y-3">
                  <img
                    src={item.avatar}
                    alt={item.first_name}
                    className="rounded-full"
                  />
                  <CardTitle>
                    {item.first_name} {item.last_name}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-center gap-x-4">
                  <Button>
                    <Pencil size={20} color="white" />
                  </Button>
                  <Button variant={"destructive"}>
                    <Trash2 size={20} color="white" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      <div className="flex gap-x-4 items-center pb-6">
        <Button
          variant={"ghost"}
          disabled={currentPage <= 1}
          onClick={() => navigate("/?page=1")}
        >
          <ChevronLeft size={26} color="black" />
        </Button>

        <p>
          <span className="font-semibold">{currentPage}</span>/
          {data?.total_pages}
        </p>

        <Button
          variant={"ghost"}
          disabled={data && currentPage >= data.total_pages}
          onClick={() => navigate("/?page=2")}
        >
          <ChevronRight size={26} color="black" />
        </Button>
      </div>
    </main>
  );
};

export default HomePage;
