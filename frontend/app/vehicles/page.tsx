"use client";
import { useQuery } from "@apollo/client";
import { columns } from "./columts";
import { DataTable } from "./data-table";
import LoadingSpinner from "../components/LoadingSpinner";
import { QUERY_GET_VEHICLES } from "@/lib/queries";

const VehiclesPage = () => {
  const { loading, error, data } = useQuery(QUERY_GET_VEHICLES);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-container">
      <h1 className="text-4xl mb-5">Vehicles</h1>
      <DataTable columns={columns} data={data.vehicles} />
    </div>
  );
};

export default VehiclesPage;
