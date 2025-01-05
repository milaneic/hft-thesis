"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import LoadingSpinner from "../components/LoadingSpinner";
import { useEffect, useState } from "react";

const DriversPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch drivers, status: ${response.status}`
          );
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <p className="text-lg text-center text-red-500">Error: {error.message}</p>
    );

  return (
    <div className="max-container">
      <h1 className="text-4xl mb-5">Drivers</h1>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
};

export default DriversPage;
