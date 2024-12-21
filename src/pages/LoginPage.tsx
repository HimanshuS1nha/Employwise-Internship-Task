import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/Loader";

import {
  loginValidator,
  type loginValidatorType,
} from "@/validators/login-validator";

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<loginValidatorType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginValidator),
  });

  const { mutate: handleLogin, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: loginValidatorType) => {
      const { data } = await axios.post("https://reqres.in/api/login", {
        ...values,
      });

      return data as { token: string };
    },
    onSuccess: (data) => {
      toast.success("Logged in successfully");
      localStorage.setItem("token", data.token);
      reset();
      navigate("/", { replace: true });
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later!");
      }
    },
  });
  return (
    <div className="flex justify-center items-center w-full h-[100dvh] bg-gray-100">
      <div className="w-[70%] h-full">
        <img
          src="/login-bg.png"
          alt="Business meet"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-[30%] h-full flex flex-col items-center justify-between py-4 bg-white shadow-md shadow-black">
        <h1 className="text-primary font-bold text-5xl">Internship Task</h1>

        <form
          className="flex flex-col gap-y-6 w-[90%] items-center"
          onSubmit={handleSubmit((data) => handleLogin(data))}
        >
          <p className="text-primary text-3xl font-semibold">
            Login to your account
          </p>
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
            <Label className="ml-1" htmlFor="password">
              Password
            </Label>
            <Input
              placeholder="Enter your password"
              id="password"
              type="password"
              required
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-rose-600 text-sm">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader />
                <p>Please wait</p>
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <p>
          By continuing, you agree to our{" "}
          <span className="text-primary">Terms and Conditions</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
