"use client";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useSuspenseQuery } from "@apollo/client";
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
import { Suspense } from "react";
import {
  MUTATION_UPDATE_ORDER,
  QUERY_GET_COUNTRIES,
  QUERY_GET_ORDER,
  QUERY_GET_TRIPS,
} from "@/lib/queries";

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
    .max(33, { message: "Qunatity cannot exceed 33" })
    .positive({ message: "Qunatity must be a postive number" }),
  tripId: z.string(),
});

type FormFields = z.infer<typeof schema>;

interface OrderData {
  order: Order;
}

interface CountriesData {
  countries: Country[];
}

interface TripsData {
  trips: Trip[];
}

const OrderDetails = () => {
  const router = useRouter();
  const { id } = useParams();

  const {
    error,
    data: { order },
  } = useSuspenseQuery<OrderData>(QUERY_GET_ORDER, {
    variables: { id },
  });
  console.log(order);
  const {
    error: countriesError,
    data: { countries },
  } = useSuspenseQuery<CountriesData>(QUERY_GET_COUNTRIES);

  const {
    error: tripsError,
    data: { trips },
  } = useSuspenseQuery<TripsData>(QUERY_GET_TRIPS);

  let selectedTrip;
  for (const trip of trips) {
    for (const order of trip?.orders) {
      if (String(order._id) === id) {
        selectedTrip = trip;
      }
    }
    if (selectedTrip) break;
  }

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      ...order,
      originCountryId: String(order.originCountry._id),
      destinationCountryId: String(order.destinationCountry._id),
      tripId: selectedTrip ? String(selectedTrip._id) : "",
    },
    resolver: zodResolver(schema),
  });

  const [updateOrderMutation, { error: mutationError }] = useMutation(
    MUTATION_UPDATE_ORDER
  );

  // const [deleteOrderMutation, { error: deleteError }] = useMutation(
  //   MUTATION_DELETE_ORDER
  // );

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await updateOrderMutation({
        variables: { ...formData, id: order._id },
      });
      if (res.data) {
        toast.success("Order updated successfully!");
        setTimeout(() => {
          router.push("/orders");
        }, 1000);
      }
    } catch (error) {
      toast.error("Error occured");
      console.log(error);
    }
  };

  // const onDelete = async () => {
  //   try {
  //     const res = await deleteOrderMutation({
  //       variables: { id: order._id.toString() },
  //       update: (cache) => {
  //         const existingOrders = cache.readQuery<OrdersType>({
  //           query: QUERY_GET_ORDERS,
  //         });

  //         if (existingOrders) {
  //           cache.writeQuery({
  //             query: QUERY_GET_ORDERS,
  //             data: {
  //               orders: existingOrders.orders.filter(
  //                 (o: Order) => o._id.toString() !== order._id.toString()
  //               ),
  //             },
  //           });
  //         }
  //       },
  //     });

  //     if (res) router.push("/orders");
  //   } catch (error) {
  //     toast.error("Failed to delete order.");
  //     console.log(error);
  //   }
  // };

  if (error || countriesError || tripsError)
    return (
      <p className="text-2xl text-center">
        Error:{" "}
        {error?.message || countriesError?.message || tripsError?.message}
      </p>
    );

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="max-container w-1/2">
        <h2 className="text-2xl mb-5">Order details:</h2>
        <Toaster richColors />
        {mutationError && <p>Error: {mutationError.message}</p>}
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
              defaultValue={String(order.goodsType)}
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
            <Label htmlFor="price">Trip:</Label>
            <Select
              defaultValue={String(selectedTrip?._id)}
              onValueChange={(v) => {
                setValue("tripId", v);
                trigger("tripId");
              }}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Trip:" />
              </SelectTrigger>
              <SelectContent>
                {trips.map((t: Trip) => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.firstOrderOrigin} - {t.lastOrderDestination} Active:{" "}
                    {t.active ? "✅" : "❌"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tripId && (
              <p className="text-sm text-red-500">{errors.tripId.message}</p>
            )}
          </div>
          <div className="actions flex gap-5 justify-start items-end">
            <Button disabled={isSubmitting} className="mt-5 ">
              {isSubmitting ? "Updating" : "Update"}
            </Button>
            {/* <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-[120xp] mt-5">
                  Delete Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this order?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog> */}
          </div>
        </form>
      </div>
    </Suspense>
  );
};

export default OrderDetails;
