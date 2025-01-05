"use client";

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string(),
});

type FormFields = z.infer<typeof schema>;

const NewDriver = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create driver!");
      }

      toast.success("Driver created successfully!");
      setTimeout(() => {
        router.push("/drivers");
      }, 1000);
    } catch (error) {
      toast.error("Failed to create driver");
      console.log(error);
    }
  };

  return (
    <div className="max-container min-h-[calc(100vh-100px)] flex flex-col justify-center   w-1/3">
      <h2 className="text-2xl mb-5">Create new driver:</h2>
      <Toaster richColors />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5">
          <Label htmlFor="firstName">First name:</Label>
          <Input {...register("firstName")} id="firstName"></Input>
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="my-5">
          <Label htmlFor="lastName">Last name:</Label>
          <Input {...register("lastName")} id="lastName"></Input>
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
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

        <Button type="submit" disabled={isSubmitting} className="mt-5 ">
          {isSubmitting ? "Creating" : "Create"}
        </Button>
      </form>
    </div>
  );
};

export default NewDriver;
