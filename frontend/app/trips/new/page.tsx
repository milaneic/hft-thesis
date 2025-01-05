"use client";

import React from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery, useMutation } from "@apollo/client";
import { Driver, Trip, Vehicle } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  MUTATION_CREATE_TRIP,
  QUERY_GET_DRIVERS,
  QUERY_GET_TRIPS,
  QUERY_GET_VEHICLES,
} from "@/lib/queries";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehiclesData {
  vehicles: Vehicle[];
}

interface DriversData {
  drivers: Driver[];
}

interface TripsData {
  trips: Trip[];
}

const schema = z.object({
  startOdometar: z.coerce.number().min(1, "Start odometar values is required"),
  finishOdometar: z.coerce.number().min(1, "Finish odometar value is required"),
  vehicleId: z.string().min(1, "Vehicle must be chosen."),
  driverId: z.string().min(1, "Driver must be chosen"),
  active: z.coerce.boolean(),
});

type FormFields = z.infer<typeof schema>;

const TripDetails = () => {
  const router = useRouter();

  const {
    error: vehiclesError,
    data: { vehicles },
  } = useSuspenseQuery<VehiclesData>(QUERY_GET_VEHICLES);

  const {
    error: driversError,
    data: { drivers },
  } = useSuspenseQuery<DriversData>(QUERY_GET_DRIVERS);

  const [createTripMutation] = useMutation(MUTATION_CREATE_TRIP);

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
      console.log(formData);
      const res = await createTripMutation({
        variables: {
          ...formData,
        },
        update: (cache, { data }) => {
          const existingTrips = cache.readQuery<TripsData>({
            query: QUERY_GET_TRIPS,
          });

          if (existingTrips) {
            cache.writeQuery({
              query: QUERY_GET_TRIPS,
              data: {
                trips: [...existingTrips.trips, data.createTrip],
              },
            });
          }
        },
      });
      if (res) {
        toast.success("Trip updated successfully!");
        setTimeout(() => {
          router.push("/trips");
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to create trip.");
      console.log(error);
    }
  };
  if (vehiclesError || driversError)
    return (
      <p className="text-center text-red-500">
        {vehiclesError?.message || driversError?.message}
      </p>
    );

  return (
    <div className="max-container w-1/2 mb-10">
      <Toaster richColors />
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
            onValueChange={(v) => {
              setValue("vehicleId", v);
              trigger("vehicleId");
            }}
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
            onValueChange={(v) => {
              setValue("driverId", v);
              trigger("driverId");
            }}
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

export default TripDetails;
