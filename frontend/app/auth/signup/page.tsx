"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@apollo/client";
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
import { Role, User } from "@/lib/types";
import {
  QUERY_GET_ROLES,
  QUERY_GET_USERS,
  MUTATION_CREATE_USER,
} from "@/lib/queries";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email(),
  password: z.string().min(8),
  dob: z.string().min(1, "Please choose date of birth"),
  roleId: z.string(),
});

type FormFields = z.infer<typeof schema>;

interface RolesType {
  roles: Role[];
}

interface UsersType {
  users: User[];
}

const SignUp = () => {
  const router = useRouter();

  const {
    error,
    data: { roles },
  } = useSuspenseQuery<RolesType>(QUERY_GET_ROLES);

  // react-use-hook init
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      roleId: roles[0]._id,
    },
  });

  // create user mutation
  const [addUserMutation, { error: userCreateError }] =
    useMutation(MUTATION_CREATE_USER);

  // submit handler
  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    const res = await addUserMutation({
      variables: {
        ...formData,
      },
      update: async (cache, { data }) => {
        const existsingUsers = await cache.readQuery<UsersType>({
          query: QUERY_GET_USERS,
        });

        if (existsingUsers) {
          cache.writeQuery({
            query: QUERY_GET_USERS,
            data: { users: [...existsingUsers?.users, data.createUser] },
          });
        }
      },
    });
    if (res) router.push("/");
  };

  return (
    <>
      <div className=" min-h-[calc(100vh-100px)] flex justify-center items-center">
        <div className="w-1/3  p-5 transform">
          <h2 className="text-3xl">Sign up</h2>

          {error && <p className="text-lg text-red-500">{error.message}</p>}
          {userCreateError && (
            <p className="text-lg text-red-500">{userCreateError.message}</p>
          )}
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
                {...register("password")}
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
                onValueChange={(v) => {
                  setValue("roleId", v);
                  trigger("roleId");
                }}
                defaultValue={roles[0]._id}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="User Role:" />
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
