"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Driver, Event, Trip, Vehicle } from "@/lib/types";
import { useParams } from "next/navigation";
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
import { useSession } from "next-auth/react";
import TripOrders from "@/components/trips/details/TripOrders";
import TripEvents from "@/components/trips/details/TripEvents";

const schema = z.object({
  id: z.string(),
  startOdometar: z.coerce.number(),
  finishOdometar: z.coerce.number(),
  vehicleId: z.string().min(1, "Vehicle is required"),
  driverId: z.string().min(1, "Driver is required"),
  active: z.coerce.boolean(),
});

type FormFields = z.infer<typeof schema>;

const TripDetails = () => {
  const { data: session } = useSession();
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [events, setEvents] = useState<Event[]>();
  const [event, setEvent] = useState("");
  const [description, setDescription] = useState("");
  const [attachErrors, setAttachErrors] = useState<string>();
  const [error, setError] = useState<string>();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    trigger,
    reset,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, eventsRes, vehiclesRes, driversRes] = await Promise.all(
          [
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trips/${id}`),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events`),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicle`),
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers`),
          ]
        );

        if (!tripRes.ok || !eventsRes.ok || !vehiclesRes.ok || !driversRes.ok) {
          throw new Error("Failed to fetch one or more resources!");
        }

        const [tripData, eventsData, vehiclesData, driversData] =
          await Promise.all([
            tripRes.json(),
            eventsRes.json(),
            vehiclesRes.json(),
            driversRes.json(),
          ]);

        setTrip(tripData);
        setEvents(eventsData);
        setVehicles(vehiclesData);
        setDrivers(driversData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (trip) reset({ id: trip?._id, ...trip });
  }, [trip, reset]);

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trips`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errroData = await res.json();
        throw new Error(errroData.message || "Failed to update trip!");
      }

      toast.success("Trip updated successfully!");
    } catch (error) {
      toast.error("Failed to update trip.");
      setError((error as Error).message);
    }
  };

  const handleAttachEvent = async () => {
    if (event === "") {
      setAttachErrors(
        "Please provide event and description to attach log to this trip."
      );
    } else {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/logs/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tripId: id,
              eventId: event,
              description: description,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to attach event to trip");
        }

        toast.success("Event added successfully");
      } catch (error) {
        console.error(error);
        setAttachErrors((error as Error).message);
      }
    }
  };

  return (
    <>
      <div className="max-container w-1/2 mb-10">
        <Toaster richColors />
        {error && <p className="text-lg text-red-500">{error}</p>}

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
            <Label htmlFor="vehicleId">Vehicle:</Label>
            <Select
              {...(register("vehicleId"),
              {
                onValueChange: (v) => {
                  setValue("vehicleId", v);
                  trigger("vehicleId");
                },
              })}
              defaultValue={trip?.vehicle._id}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Vehicle:" />
              </SelectTrigger>
              <SelectContent>
                {vehicles?.map((v: Vehicle) => (
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
            <Label htmlFor="driverId">Driver:</Label>
            <Select
              {...(register("driverId"),
              {
                onValueChange: (v) => {
                  setValue("driverId", v);
                  trigger("driverId");
                },
              })}
              defaultValue={trip?.driver._id}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Driver:" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((d: Driver) => (
                  <SelectItem key={d._id} value={d._id}>
                    {d.firstName}&emsp;
                    {d.lastName}&emsp;{d.dob}
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
              {isSubmitting ? "Updating" : "Update"}
            </Button>
          </div>
        </form>
      </div>

      {trip && (
        <div className="mx-auto my-3 w-3/4 ">
          <TripOrders id={trip?._id} />
        </div>
      )}
      {session?.user.role === "admin" && (
        <div className="mt-10 mb-10 w-4/5 m-auto flex justify-evenly">
          <div>
            <Select onValueChange={(v) => setEvent(v)}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Choose event:" />
              </SelectTrigger>
              <SelectContent>
                {events?.map((e: Event) => (
                  <SelectItem key={e._id} value={e._id.toString()}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {attachErrors && (
              <p className="text-lg text-red-500">
                Please chose event to attach
              </p>
            )}
          </div>
          <Input
            type="text"
            placeholder="Description"
            className="w-1/2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Input>

          <Button onClick={handleAttachEvent} className="bg-green-500">
            Attach event
          </Button>
        </div>
      )}

      {trip && (
        <div className="mx-auto my-3 w-3/4 ">
          <TripEvents id={trip?._id} />
        </div>
      )}
    </>
  );
};

export default TripDetails;
