"use client";

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useSuspenseQuery } from "@apollo/client";
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
import {
  MUTATION_UPDATE_USER,
  QUERY_GET_ROLE_NAMES,
  QUERY_GET_USER,
} from "@/lib/queries";
import { useSession } from "next-auth/react";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email(),
  password: z
    .union([z.string().min(8), z.undefined()])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  dob: z.string(),
  roleId: z.string(),
});

type FormFields = z.infer<typeof schema>;

interface UserData {
  user: User;
}

interface RolesData {
  roles: Role[];
}

const NewVehicle = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = useParams();

  const {
    error,
    data: { user },
  } = useSuspenseQuery<UserData>(QUERY_GET_USER, {
    variables: { id },
  });

  const {
    error: rolesError,
    data: { roles },
  } = useSuspenseQuery<RolesData>(QUERY_GET_ROLE_NAMES);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: { ...user, roleId: user.role._id },
    resolver: zodResolver(schema),
  });

  const [updateUserMutation, { error: mutationError }] = useMutation(
    MUTATION_UPDATE_USER,
    {
      refetchQueries: ["GetUser", "GetUsers"],
    }
  );

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await updateUserMutation({
        variables: { ...formData, id: user._id },
        refetchQueries: ["GetUser"],
      });
      if (res) {
        toast.success("User updated successfully!");
        setTimeout(() => {
          router.push("/users");
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to update user!");
      console.log(error);
    }
  };

  if (error || rolesError)
    return (
      <p className="text-2xl text-center">
        Error: {error?.message || rolesError?.message}
      </p>
    );

  return (
    <div className="max-container min-h-[calc(100vh-100px)] flex flex-col justify-center   w-1/3">
      <h2 className="text-2xl mb-5">User Details:</h2>
      <Toaster richColors />
      {mutationError && (
        <p className="text-lg text-red-500">{mutationError.message}</p>
      )}
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
            onChange={(e) => {
              setValue("password", e.target.value);
              trigger("password");
            }}
            id="password"
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
              onValueChange={(v) => {
                setValue("roleId", v);
                trigger("roleId");
              }}
              defaultValue={user.role._id}
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
          </div>
        )}

        <div className="flex justify-start items-end gap-5">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 bg-green-400 hover:bg-green-500"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewVehicle;
