"use client";
import { useQuery } from "@apollo/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Driver } from "@/lib/types";
import LoadingSpinner from "../components/LoadingSpinner";
import { QUERY_GET_DRIVERS } from "@/lib/queries";

interface DriversType {
  drivers: Driver[];
}

const DriversPage = () => {
  const { loading, error, data } = useQuery<DriversType>(QUERY_GET_DRIVERS);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <p className="text-lg text-center text-red-500">Error: {error.message}</p>
    );

  return (
    <div className="max-container">
      <h1 className="text-4xl mb-5">Drivers</h1>
      <DataTable columns={columns} data={data?.drivers || []} />
    </div>
  );
};

export default DriversPage;
