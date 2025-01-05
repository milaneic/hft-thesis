"use client";

import LoadingSpinner from "@/app/components/LoadingSpinner";
import TripEvents from "@/components/trips/details/TripEvents";
import TripOrders from "@/components/trips/details/TripOrders";
import { Button } from "@/components/ui/button";
import { Trip } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const TripDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trips/${id}`
        );
        if (!res.ok) {
          setError({ message: `Failed to fetch trip.` } as Error);
        }

        const trip = await res.json();

        if (!trip) {
          setError({ message: `Failed to fetch trip.` } as Error);
        }
        setTrip(trip);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center">{error.message}</p>;

  return (
    <>
      <div className="max-container w-1/2 p-5">
        <h1 className="text-3xl mb-8">Trip Details</h1>
        <table className="table-auto w-full">
          <thead className="bg-muted text-lg">
            <tr>
              <th>Plates</th>
              <th>Driver</th>
              <th>Start Odometar</th>
              <th>Finish Odometar</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="pt-5 text-lg">
            <tr className="h-[50px]">
              <td className="text-center">{trip?.vehicle.plates}</td>
              <td className="text-center">
                {`${trip?.driver.firstName} ${trip?.driver.lastName}`}
              </td>
              <td className="text-center">{trip?.startOdometar}</td>
              <td className="text-center">{trip?.finishOdometar}</td>
              <td className="text-center">
                <Button
                  variant="outline"
                  className="ml-auto bg-green-400 text-white"
                  onClick={() => router.push(`/trips/update/${trip?._id}`)}
                >
                  Update trip
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {trip?._id && (
        <>
          <div className="mx-auto my-3 w-3/4 ">
            <TripOrders id={trip?._id} />
          </div>
          <div className="mx-auto my-3 w-3/4 ">
            <TripEvents id={trip?._id} />
          </div>
        </>
      )}
    </>
  );
};

export default TripDetails;
