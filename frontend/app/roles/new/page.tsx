"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { MUTATION_ADD_ROLE, QUERY_GET_ROLES } from "@/lib/queries";
import { Role } from "@/lib/types";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(1, "Role is required"),
});

type FormFields = z.infer<typeof schema>;

const CreateRole = () => {
  const router = useRouter();

  // react-use-hook init
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  // create user mutation
  const [addRoleMutation, { error: roleCreateError }] =
    useMutation(MUTATION_ADD_ROLE);

  // submit handler
  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    const res = await addRoleMutation({
      variables: { ...formData },
      update: (cache, { data }) => {
        const existingRoles = cache.readQuery<{ roles: Role[] }>({
          query: QUERY_GET_ROLES,
        });

        if (existingRoles) {
          cache.writeQuery({
            query: QUERY_GET_ROLES,
            data: {
              roles: [...existingRoles.roles, data.createRole],
            },
          });
        }
      },
    });

    if (res) {
      toast.success("Role created successfully!");
      setTimeout(() => {
        router.push("/roles");
      }, 1000);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-100px)] flex justify-center items-center">
        <div className="w-1/3 p-5">
          <h2 className="text-3xl">Create role:</h2>
          <Toaster richColors />
          {roleCreateError && (
            <p className="text-lg text-red-500">{roleCreateError.message}</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-5">
              <Label htmlFor="name" className="text-xl font-normal mb-5">
                Name:
              </Label>
              <Input {...register("name")} id="name"></Input>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <Button className="text-lg bg-green-500" disabled={isSubmitting}>
              {isSubmitting ? "Submitting" : "Create role"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRole;
