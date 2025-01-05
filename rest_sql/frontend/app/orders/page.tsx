"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import LoadingSpinner from "../components/LoadingSpinner";
import { useEffect, useState } from "react";
import { Order } from "@/lib/types";

const OrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch orders, status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-5">
      <h1 className="text-4xl mb-5">Orders:</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default OrdersPage;
