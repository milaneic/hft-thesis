"use client";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { MUTATION_CREATE_EVENT, QUERY_GET_EVENTS } from "@/lib/queries";
import { Event } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

interface EventsType {
  events: Event[];
}

const NewEvent = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const [createEventMutation, { error: mutationError }] = useMutation(
    MUTATION_CREATE_EVENT
  );

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await createEventMutation({
        variables: { ...formData },
        update: (cache, { data }) => {
          const existingEvents = cache.readQuery<EventsType>({
            query: QUERY_GET_EVENTS,
          });

          if (existingEvents) {
            cache.writeQuery({
              query: QUERY_GET_EVENTS,
              data: {
                events: [...existingEvents.events, data.createEvent],
              },
            });
          }
        },
      });

      if (res.data) {
        toast.success("Event created successfully!");
        setTimeout(() => {
          router.push("/events");
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to create event");
      console.log(error);
    }
  };

  return (
    <div className="max-container min-h-[calc(100vh-100px)] flex flex-col justify-center   w-1/3">
      <h2 className="text-2xl mb-5">Create new event:</h2>
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
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-5 ">
          {isSubmitting ? "Creating" : "Create"}
        </Button>
      </form>
    </div>
  );
};

export default NewEvent;
