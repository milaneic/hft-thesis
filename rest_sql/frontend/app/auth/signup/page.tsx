"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/lib/types";
import { useEffect, useState } from "react";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email(),
  password: z.string().min(8),
  dob: z.string(),
  roleId: z.string(),
});

type FormFields = z.infer<typeof schema>;

const SignUp = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [errorRoles, setErrorRoles] = useState<string>();
  const [error, setError] = useState<string>();

  // react-use-hook init
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles`);
        if (!res.ok) {
          throw new Error("Failed to fetch roles!");
        }

        const data = await res.json();
        setRoles(data);
      } catch (error) {
        setErrorRoles((error as Error).message);
      }
    };

    fetchRoles();
  }, []);
  // submit handler
  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message);
      }
      router.push("/");
    } catch (error) {
      console.log(error);
      setError((error as Error).message);
    }
  };

  return (
    <>
      <div className=" min-h-[calc(100vh-100px)] flex justify-center items-center">
        <div className="w-1/3  p-5 transform">
          <h2 className="text-3xl">Sign up</h2>

          {error && <p className="text-lg text-red-500">{error}</p>}
          {errorRoles && <p className="text-lg text-red-500">{errorRoles}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-5">
              <Label htmlFor="firstName" className="text-xl font-normal mb-5">
                First name:
              </Label>
              <Input {...register("firstName")} id="firstName"></Input>
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="my-5">
              <Label htmlFor="lastName" className="text-xl font-normal mb-5">
                Last name:
              </Label>
              <Input {...register("lastName")} id="lastName"></Input>
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="my-5">
              <Label htmlFor="email" className="text-xl font-normal mb-5">
                Email:
              </Label>
              <Input {...register("email")} id="email"></Input>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="my-5">
              <Label htmlFor="password" className="text-xl font-normal mb-5">
                Password:
              </Label>
              <Input
                onChange={(e) => {
                  setValue("password", e.target.value);
                  trigger("password");
                }}
                id="password"
                type="password"
                placeholder="Please provide password if you want to change it"
              ></Input>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="my-5 flex flex-col">
              <Label htmlFor="dob" className="text-xl font-normal mb-5">
                Date of birth:
              </Label>
              <Input {...register("dob")} type="date" id="dob"></Input>
              {errors.dob && (
                <p className="text-sm text-red-500">{errors.dob.message}</p>
              )}
            </div>

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
                defaultValue={roles[1]?._id}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Role:" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
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

            <Button className="text-lg bg-green-500" disabled={isSubmitting}>
              {isSubmitting ? "Submitting" : "Sign up"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
