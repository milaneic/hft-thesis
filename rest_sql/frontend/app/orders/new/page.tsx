"use client";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Country, Trip } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const schema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  originCountryId: z.string(),
  destinationCountryId: z.string(),
  price: z.coerce
    .number()
    .min(150, { message: "Price must be at least 150" })
    .max(6000, { message: "Price cannot exceed 6000" })
    .positive({ message: "Price must be a postive number" }),
  weight: z.coerce
    .number()
    .min(1, { message: "Weight must be at least 1" })
    .max(24000, { message: "Weight cannot exceed 24000" })
    .positive({ message: "Weight must be a postive number" }),
  goodsType: z.string(),
  quantity: z.coerce
    .number()
    .min(1, { message: "Price must be at least 1" })
    .max(33, { message: "Quantity cannot exceed 33" })
    .positive({ message: "Quantity must be a postive number" }),
  tripId: z.string().min(1, "Order needs to be assigned to trip"),
});

type FormFields = z.infer<typeof schema>;

const NewOrder = () => {
  const searchParams = useSearchParams();
  const tripIdParam = searchParams.get("tripId");
  const [trips, setTrips] = useState<Trip[]>();
  const [countries, setCountries] = useState<Country[]>();
  const [error, setError] = useState<string>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      tripId: tripIdParam || "",
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchTrips = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trips`);
      if (!res.ok) {
        throw new Error("Failed to fetch trips");
      }

      const data = await res.json();
      setTrips(data);
    };

    const fetchCountries = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/countries`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch countries");
      }

      const data = await res.json();
      setCountries(data);
    };
    fetchTrips();
    fetchCountries();
  }, []);

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create order!");
      }
      toast.success("Order created successfully!");
      setTimeout(() => {
        router.push("/orders");
      }, 1000);
    } catch (error) {
      toast.error("Failed to create order!");
      setError((error as Error).message);
    }
  };

  return (
    <div className="max-container w-1/2">
      <h2 className="text-2xl mb-5">Create new order:</h2>
      <Toaster richColors />
      {error && <p className="text-lg text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5">
          <Label htmlFor="origin">Start destination:</Label>
          <Input {...register("origin")} id="origin"></Input>
          {errors.origin && (
            <p className="text-sm text-red-500">{errors.origin.message}</p>
          )}
        </div>

        <Label htmlFor="destination">Final Destination:</Label>
        <Input {...register("destination")} id="destination"></Input>
        {errors.destination && (
          <p className="text-sm text-red-500">{errors.destination.message}</p>
        )}

        <div className="my-5">
          <Select
            {...register("originCountryId")}
            onValueChange={(v) => {
              setValue("originCountryId", v);
              trigger("originCountryId");
            }}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Start country" />
            </SelectTrigger>
            <SelectContent>
              {countries?.map((c: Country) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name} - {c.country_code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.originCountryId && (
            <p className="text-sm text-red-500">
              {errors.originCountryId.message}
            </p>
          )}
        </div>

        <div className="my-5">
          <Select
            {...register("destinationCountryId")}
            onValueChange={(v) => {
              setValue("destinationCountryId", v);
              trigger("destinationCountryId");
            }}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Final country" />
            </SelectTrigger>
            <SelectContent>
              {countries?.map((c: Country) => (
                <SelectItem key={c._id} value={String(c._id)}>
                  {c.name} - {c.country_code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.destinationCountryId && (
            <p className="text-sm text-red-500">
              {errors.destinationCountryId.message}
            </p>
          )}
        </div>

        <div className="my-5">
          <Label htmlFor="price">Price:</Label>
          <Input {...register("price")} type="number" step={0.1}></Input>
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="my-5">
          <Label htmlFor="price">Weight:</Label>
          <Input {...register("weight")} type="number" step={0.1}></Input>
          {errors.weight && (
            <p className="text-sm text-red-500">{errors.weight.message}</p>
          )}
        </div>

        <div className="my-5">
          <Select
            {...register("goodsType")}
            onValueChange={(v) => {
              setValue("goodsType", v);
              trigger("goodsType");
            }}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Goods type:" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PALLET">Pallet</SelectItem>
              <SelectItem value="BOX">Box</SelectItem>
              <SelectItem value="COLLI">Colli</SelectItem>
            </SelectContent>
          </Select>
          {errors.goodsType && (
            <p className="text-sm text-red-500">{errors.goodsType.message}</p>
          )}
        </div>

        <div className="my-5">
          <Label htmlFor="price">Quantity:</Label>
          <Input {...register("quantity")} type="number"></Input>
          {errors.quantity && (
            <p className="text-sm text-red-500">{errors.quantity.message}</p>
          )}
        </div>

        <div className="my-5">
          <Label htmlFor="tripId">Trip:</Label>
          <Select
            {...register("tripId")}
            onValueChange={(v) => {
              setValue("tripId", v);
              trigger("tripId");
            }}
            defaultValue={tripIdParam ? tripIdParam : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Trip:" />
            </SelectTrigger>
            <SelectContent>
              {trips?.map((t: Trip) => (
                <SelectItem key={t._id} value={String(t._id)}>
                  {`${t.vehicle.plates}   
                  ${t.orders.length > 0 ? t.orders[0].origin : "No orders yet"}
                  ${
                    t.orders.length > 0
                      ? t.orders[t.orders.length - 1].destination
                      : "No orders yet"
                  }`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tripId && (
            <p className="text-sm text-red-500">{errors.tripId.message}</p>
          )}
        </div>

        <Button disabled={isSubmitting} className="mt-5 bg-green-500">
          {isSubmitting ? "Creating" : "Create"}
        </Button>
      </form>
    </div>
  );
};

export default NewOrder;
