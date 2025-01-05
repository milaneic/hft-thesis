"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Role } from "@/lib/types";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { Suspense } from "react";
import { MUTATION_UPDATE_ROLE, QUERY_GET_ROLE } from "@/lib/queries";

const schema = z.object({
  name: z.string().min(1, "Role name is required"),
});

type FormFields = z.infer<typeof schema>;

interface RoleData {
  role: Role;
}

const CreateRole = () => {
  const router = useRouter();
  const { id } = useParams();
  const {
    error,
    data: { role },
  } = useSuspenseQuery<RoleData>(QUERY_GET_ROLE, {
    variables: { id: id },
  });

  // react-use-hook init
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: { ...role },

    resolver: zodResolver(schema),
  });

  // create role mutation
  const [updateUserMutation, { error: roleCreateError }] = useMutation(
    MUTATION_UPDATE_ROLE,
    {
      variables: { id: role._id },
      refetchQueries: ["GetRoles", "GetUsers"],
    }
  );

  // delete role mutation
  // const [deleteRoleMutation, { error: roleDeleteError }] = useMutation(
  //   MUTATION_DELETE_ROLE,
  //   {
  //     refetchQueries: ["GetRoles", "GetUsers"],
  //   }
  // );

  // submit handler
  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    const res = await updateUserMutation({
      variables: { ...formData },
    });

    if (res) {
      toast.success("Role updated successfully!");
      setTimeout(() => {
        router.push("/roles");
      }, 1000);
    } else toast.error("Failed to update role");
  };

  // const onDelete = async () => {
  //   try {
  //     const res = await deleteRoleMutation({
  //       variables: { id: role._id },
  //     });
  //     if (res) router.push("/roles");
  //   } catch (error) {
  //     toast.error("Failed to delete role.");
  //     console.log(error);
  //   }
  // };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="min-h-[calc(100vh-100px)] flex justify-center items-center">
        <div className="w-1/3 p-5">
          <h2 className="text-3xl">Create role:</h2>
          {error && <p className="text-lg text-red-500">{error.message}</p>}
          <Toaster richColors />
          {roleCreateError && (
            <p className="text-lg text-red-500">{roleCreateError.message}</p>
          )}
          {/* {roleDeleteError && (
            <p className="text-lg text-red-500">{roleDeleteError.message}</p>
          )} */}
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
            <div className="actions flex justify-between items-end">
              <Button
                className="mt-5 bg-green-400 hover:bg-green-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting" : "Update role"}
              </Button>
              {/* <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-[120xp] mt-5">
                    Delete Role
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this role?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog> */}
            </div>
          </form>
        </div>
      </div>
    </Suspense>
  );
};

export default CreateRole;
