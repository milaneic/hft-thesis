"use client";

import { useMutation, useSuspenseQuery } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country, Order } from "@/lib/types";
import {
  QUERY_GET_COUNTRY,
  QUERY_GET_ORDERS,
  QUERY_UPDATE_COUNTRY,
} from "@/lib/queries";
import { toast, Toaster } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  country_code: z.string().min(2, "Country code must be at least 2 characters"),
});

type FormFields = z.infer<typeof schema>;

interface CountryType {
  country: Country;
}

interface OrdersType {
  orders: Order[];
}

const CountryDetail = () => {
  const router = useRouter();
  const { id } = useParams();

  const {
    data: { country },
  } = useSuspenseQuery<CountryType>(QUERY_GET_COUNTRY, {
    variables: {
      id,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: country.name,
      country_code: country.country_code,
    },
    resolver: zodResolver(schema),
  });

  const [updateCountryFunction, { error: errorOnUpdate }] =
    useMutation(QUERY_UPDATE_COUNTRY);

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await updateCountryFunction({
        variables: {
          ...formData,
          id,
        },
        update: (cache, { data }) => {
          const existingOrders = cache.readQuery<OrdersType>({
            query: QUERY_GET_ORDERS,
          });

          if (existingOrders) {
            cache.writeQuery({
              query: QUERY_GET_ORDERS,
              data: {
                orders: existingOrders.orders.map((order) => ({
                  ...order,
                  originCountry:
                    order.originCountry._id === data.updateCountry._id
                      ? data.updateCountry
                      : order.originCountry,
                  destinationCountry:
                    order.destinationCountry._id === data.updateCountry._id
                      ? data.updateCountry
                      : order.destinationCountry,
                })),
              },
            });
          }
        },
      });

      if (res.data) {
        toast.success("Country updated successfully");
        setTimeout(() => {
          router.push("/countries");
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to update country!");
      console.log(error);
    }
  };

  return (
    <div className="max-container min-h-[calc(100vh-100px)] flex flex-col justify-center  w-1/3">
      <h1 className="text-3xl sm:text-2xl mb-5">Country details:</h1>
      <Toaster richColors />
      {errorOnUpdate && <p className="text-red-500">{errorOnUpdate.message}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5">
          <Label className="text-lg mb-10" htmlFor="name">
            Country name:
          </Label>
          <Input
            className="shadow-lg"
            id="name"
            type="name"
            placeholder="Country name"
            defaultValue={country.name}
            {...register("name", {
              required: "Name is requiered",
              minLength: {
                value: 3,
                message: `Name should be at least 3 characters.`,
              },
            })}
          ></Input>
          {errors.name && (
            <p className="text-lg text-red-500 my-5">{errors.name.message}</p>
          )}
        </div>
        <div className="mt-5">
          <Label className="text-lg mb-10" htmlFor="name">
            Country code:
          </Label>
          <Input
            className="shadow-lg"
            id="country_code"
            type="country_code"
            placeholder="Country name"
            defaultValue={country.country_code}
            {...register("country_code", {
              required: "Country code is required.",
              minLength: {
                value: 2,
                message: "Country code should be at least 2 characters.",
              },
            })}
          ></Input>
          {errors.country_code && (
            <p className="text-lg text-red-500">
              {errors.country_code.message}
            </p>
          )}
        </div>

        <Button
          disabled={isSubmitting}
          className="w-[100px] mt-5 p-5 bg-green-500 text-lg "
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </form>
    </div>
  );
};

export default CountryDetail;
