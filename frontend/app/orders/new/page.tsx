"use client";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { Country, Order, Trip } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import {
  MUTATION_CREATE_ORDER,
  QUERY_GET_COUNTRIES,
  QUERY_GET_ORDERS,
  QUERY_GET_TRIPS,
} from "@/lib/queries";
import { useRouter, useSearchParams } from "next/navigation";

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

interface CountriesData {
  countries: Country[];
}

interface OrdersType {
  orders: Order[];
}

interface TripsType {
  trips: Trip[];
}

const NewOrder = () => {
  const searchParams = useSearchParams();
  const tripIdParam = searchParams.get("tripId");
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

  const [createOrderMutation, { error: mutationError }] = useMutation(
    MUTATION_CREATE_ORDER
  );

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await createOrderMutation({
        variables: { ...formData },
        update: (cache, { data }) => {
          const existsingOrders = cache.readQuery<OrdersType>({
            query: QUERY_GET_ORDERS,
          });

          if (existsingOrders) {
            cache.writeQuery({
              query: QUERY_GET_ORDERS,
              data: {
                orders: [...existsingOrders.orders, data.createOrder],
              },
            });
          }

          const existingTrips = cache.readQuery<TripsType>({
            query: QUERY_GET_TRIPS,
          });

          if (existingTrips) {
            const updatedTrips = existingTrips.trips.map((trip) => {
              if (String(trip._id) === data.createOrder.tripId) {
                return {
                  ...trip,
                  orders: [...trip.orders, data.createOrder],
                };
              }
              return trip;
            });

            cache.writeQuery({
              query: QUERY_GET_TRIPS,
              data: {
                trips: updatedTrips,
              },
            });
          }
        },
      });

      if (res.data) {
        toast.success("Order created successfully!");
        setTimeout(() => {
          router.push("/orders");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const {
    error: errorCountries,
    data: { countries },
  } = useSuspenseQuery<CountriesData>(QUERY_GET_COUNTRIES);

  const {
    error: tripsError,
    data: { trips },
  } = useSuspenseQuery<TripsType>(QUERY_GET_TRIPS);

  if (errorCountries || tripsError) {
    return (
      <p className="text-2xl text-center">
        Error: {errorCountries?.message || tripsError?.message}
      </p>
    );
  }

  return (
    <div className="max-container w-1/2">
      <h2 className="text-2xl mb-5">Create new order:</h2>
      <Toaster richColors />
      {mutationError && (
        <p className="text-lg text-red-500">{mutationError.message}</p>
      )}
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
            onValueChange={(v) => {
              setValue("originCountryId", v);
              trigger("originCountryId");
            }}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Start country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c: Country) => (
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
            onValueChange={(v) => {
              setValue("destinationCountryId", v);
              trigger("destinationCountryId");
            }}
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
              {trips.map((t: Trip) => (
                <SelectItem key={t._id} value={String(t._id)}>
                  {`${t.vehicle.plates}   
                  ${
                    t.firstOrderOrigin !== "no orders"
                      ? t.firstOrderOrigin
                      : "No orders yet"
                  }
                  ${
                    t.lastOrderDestination !== "no orders"
                      ? t.lastOrderDestination
                      : ""
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
