"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country } from "@/lib/types";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";

const schema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  country_code: z.string().min(2, "Country code must be at least 2 characters"),
});

type FormFields = z.infer<typeof schema>;

const CountryDetail = () => {
  const router = useRouter();
  const [country, setCountry] = useState<Country>();
  const [error, setError] = useState<string>();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/countries/${id}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch country");
        }

        const data = await res.json();
        setCountry(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCountry();
  }, [id]);

  useEffect(() => {
    reset({ id: country?._id, ...country });
  }, [country, reset]);

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/countries`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update country!");
      }

      toast.success("Country updated successfully");
      setTimeout(() => {
        router.push("/countries");
      }, 1000);
    } catch (error) {
      toast.error("Failed to update country.");
      setError((error as Error).message);
    }
  };

  return (
    <div className="max-container min-h-[calc(100vh-100px)] flex flex-col justify-center  w-1/3">
      <h1 className="text-3xl sm:text-2xl mb-5">Country details:</h1>
      <Toaster richColors />
      {error && <p className="text-red-500"> {error}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5">
          {" "}
          <Label className="text-lg mb-10" htmlFor="name">
            Country name:
          </Label>
          <Input
            className="shadow-lg"
            id="name"
            type="name"
            placeholder="Country name"
            defaultValue={country?.name}
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
            defaultValue={country?.country_code}
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
