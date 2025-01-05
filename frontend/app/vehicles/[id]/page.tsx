"use client";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Country, Vehicle } from "@/lib/types";
import {
  MUTATION_UPDATE_VEHICLE,
  QUERY_GET_COUNTRIES,
  QUERY_GET_VEHICLE,
} from "@/lib/queries";

const schema = z.object({
  plates: z.string().min(1),
  vehicleType: z.string(),
  countryId: z.string().min(1, "Please choose country for vehicle"),
  width: z.coerce.number().min(1.5).max(2.6),
  length: z.coerce.number().min(1.5).max(13.6),
  height: z.coerce.number().min(0.5).max(3.5),
});

type FormFields = z.infer<typeof schema>;

interface CountriesData {
  countries: Country[];
}

interface VehicleData {
  vehicle: Vehicle;
}

const VehicleDetails = () => {
  const router = useRouter();
  const { id } = useParams();

  const {
    error,
    data: { vehicle },
  } = useSuspenseQuery<VehicleData>(QUERY_GET_VEHICLE, {
    variables: { id },
  });

  const {
    error: countriesError,
    data: { countries },
  } = useSuspenseQuery<CountriesData>(QUERY_GET_COUNTRIES);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      ...vehicle,
      countryId: vehicle?.country._id,
    },
    resolver: zodResolver(schema),
  });

  const [updateVehicleMutation, { error: updateMutationError }] = useMutation(
    MUTATION_UPDATE_VEHICLE
  );

  // const [deleteVehicleMutation, { error: deleteMutationError }] = useMutation(
  //   MUTATION_DELETE_VEHICLE
  // );

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await updateVehicleMutation({
        variables: { ...formData, id },
      });

      if (res) {
        toast.success("Vehicle updated successfully!");
        setTimeout(() => {
          router.push("/vehicles");
        }, 1000);
      } else {
        toast.error("Failed to update vehicle.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const onDelete = async () => {
  //   const res = await deleteVehicleMutation({
  //     variables: { id },
  //     update: (cache) => {
  //       const existingVehicles = cache.readQuery({
  //         query: QUERY_GET_VEHICLES,
  //       });

  //       if (existingVehicles) {
  //         cache.writeQuery({
  //           query: QUERY_GET_VEHICLES,
  //           data: {
  //             vehicles: existingVehicles.vehicles.filter((v) => v._id !== id),
  //           },
  //         });
  //       }
  //     },
  //   });

  //   if (res) {
  //     router.push("/vehicles");
  //   }
  // };

  if (countriesError || error)
    return (
      <p className="text-2xl text-center">
        Error: {countriesError?.message || error?.message}
      </p>
    );

  return (
    <div className="max-container w-1/2">
      <h2 className="text-2xl mb-5">Create new vehicle:</h2>
      <Toaster richColors />
      {updateMutationError && (
        <p className="text-lg text-red-500">{updateMutationError.message}</p>
      )}
      {/* {deleteMutationError && (
        <p className="text-lg text-red-500">{deleteMutationError.message}</p>
      )} */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5">
          <Label htmlFor="plates">Plates</Label>
          <Input {...register("plates")} id="plates"></Input>
          {errors.plates && (
            <p className="text-sm text-red-500">{errors.plates.message}</p>
          )}
        </div>

        <div className="my-5">
          <Select
            onValueChange={(v) => {
              setValue("vehicleType", v);
              trigger("vehicleType");
            }}
            defaultValue={String(vehicle.vehicleType)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Vehicle Type:" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRUCK">Truck</SelectItem>
              <SelectItem value="VAN">Van</SelectItem>
              <SelectItem value="PICKUP">Pickup</SelectItem>
            </SelectContent>
          </Select>
          {errors.vehicleType && (
            <p className="text-sm text-red-500">{errors.vehicleType.message}</p>
          )}

          <div className="my-5">
            <Select
              onValueChange={(v) => {
                setValue("countryId", v);
                trigger("countryId");
              }}
              defaultValue={String(vehicle.country._id)}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Choose country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c: Country) => (
                  <SelectItem key={c._id} value={String(c._id)}>
                    {c.name} - {c.country_code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.countryId && (
              <p className="text-sm text-red-500">{errors.countryId.message}</p>
            )}
          </div>

          <div className="my-5">
            <Label htmlFor="width">Width:</Label>
            <Input
              {...register("width")}
              id="width"
              type="number"
              step={0.01}
            ></Input>
            {errors.width && (
              <p className="text-sm text-red-500">{errors.width.message}</p>
            )}
          </div>

          <div className="my-5">
            <Label htmlFor="length">Length:</Label>
            <Input
              {...register("length")}
              id="length"
              type="number"
              step={0.01}
            ></Input>
            {errors.length && (
              <p className="text-sm text-red-500">{errors.length.message}</p>
            )}
          </div>
        </div>

        <div className="my-5">
          <Label htmlFor="height">Height:</Label>
          <Input
            {...register("height")}
            id="height"
            type="number"
            step={0.01}
          ></Input>
          {errors.height && (
            <p className="text-sm text-red-500">{errors.height.message}</p>
          )}
        </div>
        <div className="flex justify-start items-end gap-5 ">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-5  border-green-700 border-[1px] hover:bg-green-700 hover:text-white bg-white text-green-700"
          >
            {isSubmitting ? "UPdating..." : "Update"}
          </Button>
          {/* <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-[120xp] mt-5">
                Delete User
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this user?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog> */}
        </div>
      </form>
    </div>
  );
};

export default VehicleDetails;
