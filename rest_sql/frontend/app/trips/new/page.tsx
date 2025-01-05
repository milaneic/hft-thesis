"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Driver, Vehicle } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const schema = z.object({
  startOdometar: z.coerce.number().min(1, "Start odometar values is required"),
  finishOdometar: z.coerce.number().min(1, "Finish odometar value is required"),
  vehicleId: z.string().min(1, "Vehicle must be chosen."),
  driverId: z.string().min(1, "Driver must be chosen"),
  active: z.coerce.boolean(),
});

type FormFields = z.infer<typeof schema>;

const NewTrip = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchVehicles = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicle`);

      if (!res.ok) {
        throw new Error("Failed to fetch vehicles!");
      }

      const data = await res.json();
      setVehicles(data);
    };

    const fetchDrivers = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers`);

      if (!res.ok) {
        throw new Error("Failed to fetch drivers!");
      }

      const data = await res.json();
      setDrivers(data);
    };

    fetchVehicles();
    fetchDrivers();
  }, []);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    trigger,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create trip!");
      }

      toast.success("Trip updated successfully!");
      setTimeout(() => {
        router.push("/trips");
      }, 1000);
    } catch (error) {
      toast.error("Failed to create trip!");
      setError((error as Error).message);
    }
  };

  if (vehicles?.length < 1 || drivers?.length < 1) return <LoadingSpinner />;
  return (
    <div className="max-container w-1/2 mb-10">
      <Toaster richColors />
      {error && <p className="text-red-500">{error}</p>}
      <h2 className="text-2xl mb-5">Trip details:</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5">
          <Label htmlFor="startOdometar">Start odometar:</Label>
          <Input
            {...register("startOdometar")}
            id="startOdometar"
            step={0.1}
            type="number"
          ></Input>
          {errors.startOdometar && (
            <p className="text-sm text-red-500">
              {errors.startOdometar.message}
            </p>
          )}
        </div>
        <div className="my-5">
          <Label htmlFor="finishOdometar">Finish odometar:</Label>
          <Input
            {...register("finishOdometar")}
            id="finishOdometar"
            step={0.1}
            type="number"
          ></Input>
          {errors.finishOdometar && (
            <p className="text-sm text-red-500">
              {errors.finishOdometar.message}
            </p>
          )}
        </div>

        <div className="my-5">
          <Label htmlFor="price">Vehicle:</Label>
          <Select
            {...(register("vehicleId"),
            {
              onValueChange: (v) => {
                setValue("vehicleId", v);
                trigger("vehicleId");
              },
            })}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Vehicle:" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((v: Vehicle) => (
                <SelectItem key={v._id} value={v._id}>
                  {String(v.country.country_code).toUpperCase()}: &emsp;
                  {v.plates}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vehicleId && (
            <p className="text-sm text-red-500">{errors.vehicleId.message}</p>
          )}
        </div>

        <div className="my-5">
          <Label htmlFor="price">Vehicle:</Label>
          <Select
            {...(register("driverId"),
            {
              onValueChange: (v) => {
                setValue("driverId", v);
                trigger("driverId");
              },
            })}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Driver:" />
            </SelectTrigger>
            <SelectContent>
              {drivers.map((d: Driver) => (
                <SelectItem key={d._id} value={d._id}>
                  {d.firstName}&emsp;{d.lastName}&emsp;{d.dob}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vehicleId && (
            <p className="text-sm text-red-500">{errors.vehicleId.message}</p>
          )}
        </div>

        <div className="my-5">
          <Label htmlFor="active">Active:</Label>
          <Input
            {...register("active")}
            id="active"
            type="checkbox"
            className="w-[20px]"
          ></Input>
          {errors.active && (
            <p className="text-sm text-red-500">{errors.active.message}</p>
          )}
        </div>

        <div className="mt-5 gap-5 flex justify-start items-end ">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500"
          >
            {isSubmitting ? "Create" : "Creating"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTrip;
