"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Role } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const schema = z.object({
  firstName: z.string().min(1, "Please provide value for first name."),
  lastName: z.string().min(1, "Please provide value for last name."),
  email: z.string().email({ message: "Please provide valid email." }),
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
  dob: z.string().min(1, "Please choose date."),
  roleId: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

export const RegisterForm = () => {
  const [error, setError] = useState("");
  const [roles, setRoles] = useState<Role[]>();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles`);
        if (!res.ok) {
          throw new Error("Failed to fetch roles");
        }
        const data = await res.json();
        setRoles(data || []);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch roles");
      }
    };

    fetchRoles();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      roleId: roles ? roles[0]._id : "",
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (formData: FormFields) => {
    if (!session?.accessToken) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        router.push("/api/auth/signin");
      } else {
        const error = await res.json();
        setError(error.message);
        toast.error("Failed to register user!");
      }
    } else {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res) {
        router.push("/api/auth/signin");
      } else {
        toast.error("Failed to create new account!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Toaster />
      {error && <p className="text-lg text-red-500">{error}</p>}
      <div className="mt-5">
        <Label htmlFor="firstName" className="text-lg">
          First name:
        </Label>
        <Input
          type="text"
          {...register("firstName")}
          id="firstName"
          placeholder="First name"
        ></Input>
        {errors.firstName && (
          <p className="text-red-500">{errors.firstName.message}</p>
        )}
      </div>
      <div className="mt-5">
        <Label htmlFor="lastName" className="text-lg">
          Last name:
        </Label>
        <Input
          type="text"
          {...register("lastName")}
          id="lastName"
          placeholder="Last name"
        ></Input>
        {errors.lastName && (
          <p className="text-red-500">{errors.lastName.message}</p>
        )}
      </div>
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
          Password:
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
      <div className="mt-5">
        <Label htmlFor="dob" className="text-lg">
          Date of birth:
        </Label>
        <Input type="date" {...register("dob")} id="dob"></Input>
        {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
      </div>

      {session?.user.role === "admin" && (
        <div className="my-5">
          <Label htmlFor="roleId" className="text-xl font-normal mb-5">
            Role:
          </Label>
          <Select
            {...register("roleId")}
            onValueChange={(v) => {
              setValue("roleId", v);
              trigger("roleId");
            }}
            defaultValue={roles && roles[0]._id}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="User Role:" />
            </SelectTrigger>
            <SelectContent>
              {roles?.map((r) => (
                <SelectItem key={r._id} value={r._id}>
                  {String(r.name).charAt(0).toUpperCase() +
                    String(r.name).slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.roleId && (
            <p className="text-sm text-red-500">{errors.roleId.message}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        className=" w-full my-8 border-green-700 border-[1px] hover:bg-green-700 hover:text-white bg-white text-green-700"
      >
        Register
      </Button>
      <p className="text-center mt-5 text-normal">
        Have an account?{" "}
        <Link href="/api/auth/signin" className="text-green-700">
          Sign in
        </Link>
      </p>
    </form>
  );
};
