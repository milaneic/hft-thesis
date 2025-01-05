"use client";
import { useQuery } from "@apollo/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import LoadingSpinner from "../components/LoadingSpinner";
import { QUERY_GET_ORDERS } from "@/lib/queries";

const OrdersPage = () => {
  const { loading, error, data } = useQuery(QUERY_GET_ORDERS);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-5">
      <h1 className="text-4xl mb-5">Orders:</h1>
      <DataTable columns={columns} data={data.orders} />
    </div>
  );
};

export default OrdersPage;
