"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QUERY_GET_TRIP } from "@/lib/queries";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { columnsLog } from "./columns-logs";
import { DataTableLog } from "./data-table-logs";
import { Trip } from "@/lib/types";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface TripData {
  trip: Trip;
}

const TripDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  const { loading, error, data } = useQuery<TripData>(QUERY_GET_TRIP, {
    variables: { id },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center">Error: {error.message}</p>;

  const trip = data!.trip;

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

      <div className="w-4/5 m-auto">
        <h2 className="text-3xl mb-5">All orders of this trip</h2>
        <DataTable
          columns={columns}
          data={trip.orders || []}
          tripId={trip._id.toString()}
        />
      </div>

      <div className="w-4/5 m-auto">
        <h2 className="text-3xl mb-5">All events of this trip</h2>
        <DataTableLog
          columns={columnsLog}
          data={trip.event_logs || []}
          tripId={trip._id.toString()}
        />
      </div>
    </>
  );
};

export default TripDetails;
