"use client";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const schema = z.object({
  id: z.string(),
  plates: z.string().min(1),
  vehicleType: z.string(),
  countryId: z.string().min(1, "Please choose country for vehicle"),
  width: z.coerce.number().min(1.5).max(2.6),
  length: z.coerce.number().min(1.5).max(13.6),
  height: z.coerce.number().min(0.5).max(3.5),
});

type FormFields = z.infer<typeof schema>;

const VehicleDetails = () => {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle>();
  const { id } = useParams();

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
    const fetchVehicle = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicle/${id}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch vehicle!");
      }
      const data = await res.json();
      setVehicle(data);
    };

    const fetchCountries = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/countries`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch countries!");
      }
      const data = await res.json();
      setCountries(data);
    };

    fetchVehicle();
    fetchCountries();
  }, [id]);

  useEffect(() => {
    reset({
      id: vehicle?._id,
      ...vehicle,
    });
  }, [reset, vehicle]);

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicle`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update vehicle!");
      }
      toast.success("Vehicle updated successfully!");
      setTimeout(() => {
        router.push("/vehicles");
      }, 1000);
    } catch (error) {
      toast.error("Failed to update vehicle.");
      console.log(error);
    }
  };

  if (!vehicle || countries.length < 1) return <LoadingSpinner />;

  return (
    <div className="max-container w-1/2">
      <h2 className="text-2xl mb-5">Create new vehicle:</h2>
      <Toaster richColors />
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
            {...register("vehicleType")}
            onValueChange={(v) => {
              setValue("vehicleType", v);
              trigger("vehicleType");
            }}
            defaultValue={String(vehicle?.vehicleType)}
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
              {...register("countryId")}
              onValueChange={(v) => {
                setValue("countryId", v);
                trigger("countryId");
              }}
              defaultValue={String(vehicle?.country._id)}
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
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VehicleDetails;
