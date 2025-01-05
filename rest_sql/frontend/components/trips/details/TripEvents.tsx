import { Log } from "@/lib/types";
import { DataTableLog } from "./data-table-logs";
import { columnsLog } from "./columns-logs";
import React, { useEffect, useState } from "react";

interface TripEventsProps {
  id: string;
}

const TripEvents: React.FC<TripEventsProps> = ({ id }) => {
  const [events, setEvents] = useState<Log[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trips/${id}/events`
      );

      if (!res.ok) {
        setErrorMessage(`Failed to fecht trip orders`);
      }
      const data = await res.json();
      setEvents(data);
    };

    fetchOrders();
  }, [id]);

  if (errorMessage) return errorMessage;
  return (
    <div className="p-5">
      <h1 className="text-4xl mb-5">Events</h1>
      <DataTableLog tripId={id} columns={columnsLog} data={events} />
    </div>
  );
};

export default TripEvents;
