"use client";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Country, Trip } from "@/lib/types";
import { Order } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useEffect, useState } from "react";

const schema = z.object({
  id: z.string(),
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
    .max(33, { message: "Qunatity cannot exceed 33" })
    .positive({ message: "Qunatity must be a postive number" }),
  tripId: z.string(),
});

type FormFields = z.infer<typeof schema>;

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order>();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState<string>();
  const router = useRouter();

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
    const fetchOrder = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${id}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch order!");
      }

      const data = await res.json();
      setOrder(data);
    };

    fetchOrder();
  }, [id]);

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

  useEffect(() => {
    reset({ id: order?._id, ...order });
  }, [order, reset]);

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update order!");
      }

      toast.success("Order updated successfully!");
      setTimeout(() => {
        router.push("/orders");
      }, 1000);
    } catch (error) {
      toast.error("Error occured");
      setError((error as Error).message);
    }
  };

  if (!order || trips?.length < 1 || countries?.length < 1)
    return <LoadingSpinner />;

  return (
    <div className="max-container w-1/2">
      <h2 className="text-2xl mb-5">Order details:</h2>
      <Toaster richColors />
      {error && <p> {error}</p>}
      {/* {deleteError && <p>Error: {deleteError.message}</p>} */}
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
            defaultValue={String(order.originCountry._id)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Start country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c: Country) => (
                <SelectItem key={c._id} value={String(c._id)}>
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
            defaultValue={String(order.destinationCountry._id)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Final country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c: Country) => (
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
            {...(register("goodsType"),
            {
              defaultValue: String(order.goodsType),
              onValueChange: (v) => {
                setValue("goodsType", v);
              },
            })}
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
          <Label htmlFor="price">Trip:</Label>
          <Select
            {...(register("tripId"),
            {
              onValueChange: (v) => {
                setValue("tripId", v);
                trigger("tripId");
              },
            })}
            defaultValue={order?.tripId}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Trip:" />
            </SelectTrigger>
            <SelectContent>
              {trips.map((t: Trip) => (
                <SelectItem key={t._id} value={t._id}>
                  {t.orders.length > 0 ? t.orders[0].origin : "No orders"} -{" "}
                  {t.orders.length > 0
                    ? t.orders[t.orders.length - 1].origin
                    : "No orders"}{" "}
                  Active: {t.active ? "✅" : "❌"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tripId && (
            <p className="text-sm text-red-500">{errors.tripId.message}</p>
          )}
        </div>
        <div className="actions flex gap-5 justify-start items-end">
          <Button disabled={isSubmitting} className="mt-5 bg-green-500">
            {isSubmitting ? "Updating" : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrderDetails;
