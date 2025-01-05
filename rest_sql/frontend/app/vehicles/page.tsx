"use client";
import { columns } from "./columts";
import { DataTable } from "./data-table";
import LoadingSpinner from "../components/LoadingSpinner";
import { useEffect, useState } from "react";
import { Vehicle } from "@/lib/types";

const VehiclesPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicle`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch vehicles, status: ${response.status}`
          );
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-container">
      <h1 className="text-4xl mb-5">Vehicles</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default VehiclesPage;
