import { Order } from "@/lib/types";
import React from "react";

interface LastOrderDestinationProps {
  orders: Order[];
}

const LastOrderDestination: React.FC<LastOrderDestinationProps> = ({
  orders,
}) => {
  const res =
    orders.length > 0 ? orders[orders.length - 1].destination : "no orders";
  return <div>{res}</div>;
};

export default LastOrderDestination;
