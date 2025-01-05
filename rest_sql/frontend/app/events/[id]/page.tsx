"use client";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Event } from "@/lib/types";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const schema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${id}`
      );

      if (!res.ok) {
        throw new Error("Failed to update event");
      }
      const data = await res.json();
      setEvent(data);
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    reset({ id: event?._id, ...event });
  }, [event, reset]);

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update event");
      }
      toast.success("Event updated successfully!");
      setTimeout(() => {
        router.push("/events");
      }, 1000);
    } catch (error) {
      toast.error("Failed to update event");
      console.log(error);
    }
  };

  if (!event) return <LoadingSpinner />;

  return (
    <div className="max-container min-h-[calc(100vh-100px)] flex flex-col justify-center  w-1/3">
      <h2 className="text-2xl mb-5">Event details:</h2>
      <Toaster richColors />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5">
          <Label htmlFor="name">Name:</Label>
          <Input {...register("name")} id="name"></Input>
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="my-5">
          <Label htmlFor="description">Description:</Label>
          <Input {...register("description")} id="description"></Input>
          {errors.name && (
            <p className="text-sm text-red-500">
              {errors.description?.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 bg-green-500"
        >
          {isSubmitting ? "Updating" : "Update"}
        </Button>
      </form>
    </div>
  );
};

export default EventDetails;
