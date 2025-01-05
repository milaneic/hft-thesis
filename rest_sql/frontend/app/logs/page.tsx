"use client";

import LoadingSpinner from "../components/LoadingSpinner";
import { DataTableLog } from "./data-table-logs";
import { columnsLog } from "./columns-logs";
import { useEffect, useState } from "react";
import { Trip } from "@/lib/types";

const LogsPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Trip[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trips/active`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch trips");
        }

        const tripData: Trip[] = await res.json();
        setData(tripData);
      } catch (err) {
        setError("An error occurred while fetching trips.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-10">
      <h2 className="text-3xl mb-5">Trips with events</h2>
      {data ? (
        <DataTableLog columns={columnsLog} data={data} />
      ) : (
        <p className="text-center">No trips available</p>
      )}
    </div>
  );
};

export default LogsPage;
