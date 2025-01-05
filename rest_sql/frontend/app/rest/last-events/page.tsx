"use client";

import LoadingSpinner from "../../components/LoadingSpinner";

import { DataTableLog } from "./data-table-logs";
import { columnsLog } from "./columns-logs";
import { useEffect, useState } from "react";

const LogsDetails = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/rest/last-events`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await res.json();

        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center">Error: {error.message}</p>;

  return (
    <>
      <div className="p-10">
        <h2 className="text-3xl mb-5">Trips with events</h2>
        <DataTableLog columns={columnsLog} data={data || []} />
      </div>
    </>
  );
};

export default LogsDetails;
