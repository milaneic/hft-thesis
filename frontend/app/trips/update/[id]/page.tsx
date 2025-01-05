"use client";

import React, { useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery, useMutation } from "@apollo/client";
import { Driver, Event, Trip, Vehicle } from "@/lib/types";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  MUTATION_ADD_EVENT_LOG,
  MUTATION_UPDATE_TRIP,
  QUERY_GET_DRIVERS,
  QUERY_GET_EVENTS,
  QUERY_GET_TRIP,
  QUERY_GET_VEHICLES,
} from "@/lib/queries";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { columnsLog } from "./columns-logs";
import { DataTableLog } from "./data-table-logs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

interface TripData {
  trip: Trip;
}

interface VehiclesData {
  vehicles: Vehicle[];
}

interface EventsData {
  events: Event[];
}

interface DriversData {
  drivers: Driver[];
}

const schema = z.object({
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
  const [event, setEvent] = useState("");
  const [description, setDescription] = useState("");
  const [attachErrors, setAttachErrors] = useState("");

  const {
    error,
    data: { trip },
  } = useSuspenseQuery<TripData>(QUERY_GET_TRIP, {
    variables: { id },
  });

  const {
    error: errorVehicles,
    data: { vehicles },
  } = useSuspenseQuery<VehiclesData>(QUERY_GET_VEHICLES, {
    variables: { id },
  });

  const {
    error: errorDrivers,
    data: { drivers },
  } = useSuspenseQuery<DriversData>(QUERY_GET_DRIVERS);

  const {
    error: errorEvents,
    data: { events },
  } = useSuspenseQuery<EventsData>(QUERY_GET_EVENTS);

  const [updateTripMutation, { error: updateError }] =
    useMutation(MUTATION_UPDATE_TRIP);

  const [attachEventLogMutation] = useMutation(MUTATION_ADD_EVENT_LOG);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    trigger,
  } = useForm<FormFields>({
    defaultValues: {
      ...trip,
      vehicleId: trip.vehicle._id,
      driverId: trip.driver._id,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await updateTripMutation({
        variables: {
          ...formData,
          id,
        },
      });
      if (res) {
        toast.success("Trip updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update trip.");
      console.log(error);
    }
  };

  const handleAttachEvent = async () => {
    if (event === "") {
      setAttachErrors(
        "Please provide event and description to attach log to this trip."
      );
    } else {
      const res = await attachEventLogMutation({
        variables: {
          tripId: id,
          eventId: event,
          description: description,
        },
        update: (cache, { data }) => {
          const existingTrip = cache.readQuery<TripData>({
            query: QUERY_GET_TRIP,
            variables: { id },
          });

          if (existingTrip) {
            cache.writeQuery({
              query: QUERY_GET_TRIP,
              data: {
                trip: {
                  ...existingTrip.trip,
                  event_logs: [...existingTrip.trip.event_logs, data.createLog],
                },
              },
            });
          }
        },
      });
      if (res.data) {
        toast.success("Event added successfully");
      }
    }
  };

  if (error) return <p className="text-center">Error: {error.message}</p>;
  if (errorVehicles)
    return <p className="text-center">Error: {errorVehicles.message}</p>;
  if (errorEvents)
    return <p className="text-center">Error: {errorEvents.message}</p>;
  if (errorDrivers)
    return <p className="text-center">Error: {errorDrivers.message}</p>;
  return (
    <>
      <div className="max-container w-1/2 mb-10">
        <Toaster richColors />
        {updateError && (
          <p className="text-lg text-red-500">{updateError.message}</p>
        )}

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
              onValueChange={(v) => {
                setValue("vehicleId", v);
                trigger("vehicleId");
              }}
              defaultValue={trip.vehicle._id}
            >
              <SelectTrigger className="w-[250px]">
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
            <Label htmlFor="driverId">Driver:</Label>
            <Select
              onValueChange={(v) => {
                setValue("driverId", v);
                trigger("driverId");
              }}
              defaultValue={trip.driver._id}
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

      <div className="w-4/5 m-auto">
        <h2 className="text-3xl mb-5">All orders of this trip</h2>
        <DataTable
          columns={columns}
          data={trip.orders}
          tripId={trip._id.toString()}
        />
      </div>
      {session?.user.role === "admin" && (
        <div className="mt-10 mb-10 w-4/5 m-auto flex justify-evenly">
          <div>
            <Select onValueChange={(v) => setEvent(v)}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Choose event:" />
              </SelectTrigger>
              <SelectContent>
                {events.map((e: Event) => (
                  <SelectItem key={e._id} value={e._id.toString()}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {attachErrors !== "" && (
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

      <div className="w-4/5 m-auto">
        <h2 className="text-3xl mb-5">All events of this trip</h2>
        <DataTableLog
          columns={columnsLog}
          data={trip.event_logs}
          tripId={trip._id.toString()}
        />
      </div>
    </>
  );
};

export default TripDetails;
