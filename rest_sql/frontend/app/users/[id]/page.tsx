"use client";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { User } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/lib/types";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useSession } from "next-auth/react";

const schema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  dob: z.string(),
  roleId: z.string(),
});

type FormFields = z.infer<typeof schema>;

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [roles, setRoles] = useState<Role[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`
        );

        if (!res.ok) {
          throw new Error("An undefined error occurred");
        }

        const data = await res.json();
        const { password, ...user } = data; // eslint-disable-line @typescript-eslint/no-unused-vars
        setUser(user);
        reset({ id: user._id, ...user });
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles`);

        if (!res.ok) {
          throw new Error("An undefined error occurred");
        }

        const data = await res.json();
        setRoles(data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    fetchRoles();
  }, [id, reset]);

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update user");
      }

      toast.success("User updated successfully!");
      setTimeout(() => {
        router.push("/users");
      }, 1000);
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    }
  };

  if (!user || roles.length === 0) return <LoadingSpinner />;

  return (
    <div className="max-container min-h-[calc(100vh-100px)] flex flex-col justify-center   w-1/3">
      <h2 className="text-2xl mb-5">User Details:</h2>
      <Toaster richColors />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5">
          <Label htmlFor="firstName" className="text-xl font-normal mb-5">
            First name:
          </Label>
          <Input {...register("firstName")} id="firstName"></Input>
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div className="my-5">
          <Label htmlFor="lastName" className="text-xl font-normal mb-5">
            Last name:
          </Label>
          <Input {...register("lastName")} id="lastName"></Input>
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
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
            {...register("password")}
            id="password"
            type="password"
            placeholder="Please provide password if you want to change it"
          ></Input>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
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
        {session?.user.role === "admin" && (
          <div className="my-5 flex flex-col">
            <Label htmlFor="roleId" className="text-xl font-normal mb-5">
              Role:
            </Label>
            <Select
              {...register("roleId")}
              onValueChange={(v) => {
                setValue("roleId", v);
                trigger("roleId");
              }}
              defaultValue={user.roleId}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="User Role:" />
              </SelectTrigger>
              <SelectContent>
                {roles &&
                  roles.map((r: Role) => (
                    <SelectItem key={r._id} value={r._id}>
                      {String(r.name).charAt(0).toUpperCase() +
                        String(r.name).slice(1)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex justify-start items-end gap-5">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 bg-green-400 hover:bg-green-500"
          >
            {isSubmitting ? "Updating..." : "Update user"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserDetails;
