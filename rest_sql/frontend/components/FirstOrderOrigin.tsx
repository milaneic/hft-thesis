import { Order } from "@/lib/types";
import React from "react";

interface FirstOrderOriginProps {
  orders: Order[];
}

const FirstOrderOrigin: React.FC<FirstOrderOriginProps> = ({ orders }) => {
  const res = orders.length > 0 ? orders[0].origin : "no orders";
  return <div>{res}</div>;
};

export default FirstOrderOrigin;
