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
import { Driver } from "@/lib/types";
import { MUTATION_UPDATE_DRIVER, QUERY_GET_DRIVER } from "@/lib/queries";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string(),
});

type FormFields = z.infer<typeof schema>;

interface DriverData {
  driver: Driver;
}

const NewVehicle = () => {
  const { id } = useParams();
  const router = useRouter();
  const {
    error,
    data: { driver },
  } = useSuspenseQuery<DriverData>(QUERY_GET_DRIVER, {
    variables: { id },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: { ...driver },
    resolver: zodResolver(schema),
  });

  const [updateDriverMutation, { error: mutationError }] = useMutation(
    MUTATION_UPDATE_DRIVER
  );

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await updateDriverMutation({
        variables: { ...formData, id: driver._id.toString() },
      });
      if (res) {
        toast.success("Driver updated successfully!");
        setTimeout(() => {
          router.push("/drivers");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (error)
    return <p className="text-2xl text-center">Error: {error?.message}</p>;

  return (
    <div className="max-container min-h-[calc(100vh-100px)] flex flex-col justify-center   w-1/3">
      <h2 className="text-2xl mb-5">Driver Details:</h2>
      <Toaster richColors />
      {mutationError && (
        <p className="text-lg text-red-500">{mutationError.message}</p>
      )}
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

        <div className="actions flex gap-5 justify-start items-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 bg-green-500"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewVehicle;
