import { Order } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface TripsOrdersProps {
  id: string;
}

const TripOrders: React.FC<TripsOrdersProps> = ({ id }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trips/${id}/orders`
      );

      if (!res.ok) {
        setErrorMessage(`Failed to fetch trip orders`);
        setOrders([]);
      }
      const data = await res.json();
      setOrders(data);
    };

    fetchOrders();
  }, [id]);

  if (errorMessage) return errorMessage;
  return (
    <div className="p-5">
      <h1 className="text-4xl mb-5">Orders</h1>
      <DataTable tripId={id} columns={columns} data={orders} />
    </div>
  );
};

export default TripOrders;
