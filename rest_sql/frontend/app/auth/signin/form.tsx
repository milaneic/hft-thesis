"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

type FormFields = z.infer<typeof schema>;

const LoginForm = () => {
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/trips";
  const error = searchParams.get("error") ? "Invalid credentials" : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    signIn("credentials", {
      username: formData.email,
      password: formData.password,
      callbackUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <p className="text-lg text-red-500">{error}</p>}

      <div className="mt-5">
        <Label htmlFor="email" className="text-lg">
          Email:
        </Label>
        <Input
          type="email"
          {...register("email")}
          id="email"
          placeholder="Email"
        ></Input>
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div className="mt-5">
        <Label htmlFor="password" className="text-lg">
          Last name:
        </Label>
        <Input
          type="password"
          {...register("password")}
          id="password"
          placeholder="Password"
        ></Input>
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className=" w-full my-8 border-green-700 border-[1px] hover:bg-green-700 hover:text-white bg-white text-green-700"
      >
        Sign in
      </Button>
      <p className="text-center mt-5 text-normal">
        Need to an account?{" "}
        <Link href="/auth/register" className="text-green-700">
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
