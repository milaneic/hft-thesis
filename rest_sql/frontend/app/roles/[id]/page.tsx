"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Role } from "@/lib/types";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useEffect, useState } from "react";

const schema = z.object({
  id: z.string(),
  name: z.string().min(1, "Role name is required"),
});

type FormFields = z.infer<typeof schema>;

const CreateRole = () => {
  const router = useRouter();
  const [role, setRole] = useState<Role>();
  const { id } = useParams();

  // react-use-hook init
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/roles/${id}`
        );

        if (!res.ok) {
          throw new Error("An undefined error occurred");
        }

        const data = await res.json();
        setRole(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRole();
  }, [id]);

  useEffect(() => {
    reset({
      id: role?._id,
      ...role,
    });
  }, [role, reset]);

  // submit handler
  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update role");
      }
      toast.success("Role updated successfully!");
      setTimeout(() => {
        router.push("/roles");
      }, 1000);
    } catch (error) {
      toast.error("Failed to update role");
      console.error(error);
    }
  };

  if (!role) return <LoadingSpinner />;

  return (
    <div className="min-h-[calc(100vh-100px)] flex justify-center items-center">
      <Toaster richColors />
      <div className="w-1/3 p-5">
        <h2 className="text-3xl">Create role:</h2>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRole;
