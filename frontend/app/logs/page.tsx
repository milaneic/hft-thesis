"use client";

import LoadingSpinner from "../components/LoadingSpinner";
import { useQuery } from "@apollo/client";
import { QUERY_GET_ACTIVE_TRIPS } from "@/lib/queries";
import { DataTableLog } from "./data-table-logs";
import { columnsLog } from "./columns-logs";

const LogsDetails = () => {
  // Fetching active trips
  const { loading, error, data } = useQuery(QUERY_GET_ACTIVE_TRIPS);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center">Error: {error.message}</p>;

  return (
    <>
      <div className="p-10">
        <h2 className="text-3xl mb-5">Trips with events</h2>
        <DataTableLog columns={columnsLog} data={data.active_trips || []} />
      </div>
    </>
  );
};

export default LogsDetails;
