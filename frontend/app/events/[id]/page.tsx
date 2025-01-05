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
import { QUERY_GET_EVENT, MUTATION_UPDATE_EVENT } from "@/lib/queries";
import { Event } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

interface EventType {
  event: Event;
}

const EventDetails = () => {
  const { id } = useParams();

  const {
    error,
    data: { event },
  } = useSuspenseQuery<EventType>(QUERY_GET_EVENT, {
    variables: { id },
  });

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { ...event },
  });

  const [updateEventMutation, { error: mutationError }] = useMutation(
    MUTATION_UPDATE_EVENT
  );

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await updateEventMutation({
        variables: { ...formData, id },
      });

      if (res.data) {
        toast.success("Event updated successfully!");
        setTimeout(() => {
          router.push("/events");
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to update event");
      console.log(error);
    }
  };

  if (error) return <p className="text-center">{error?.message}</p>;

  return (
    <div className="max-container min-h-[calc(100vh-100px)] flex flex-col justify-center  w-1/3">
      <h2 className="text-2xl mb-5">Event details:</h2>
      <Toaster richColors />
      {mutationError && (
        <p className="text-lg text-red-500">{mutationError.message}</p>
      )}
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
