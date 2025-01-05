"use client";
import { useQuery } from "@apollo/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import LoadingSpinner from "../components/LoadingSpinner";
import { QUERY_GET_EVENTS } from "@/lib/queries";

const EventsPage = () => {
  const { loading, error, data } = useQuery(QUERY_GET_EVENTS);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-container">
      <h1 className="text-4xl mb-5">Events</h1>
      <DataTable columns={columns} data={data.events} />
    </div>
  );
};

export default EventsPage;
