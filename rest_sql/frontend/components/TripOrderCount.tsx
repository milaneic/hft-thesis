import { Order } from "@/lib/types";
import React from "react";

interface TotalOrderCountryProp {
  orders: Order[];
}

const TripOrderTotalAmount: React.FC<TotalOrderCountryProp> = ({ orders }) => {
  if (orders && orders.length > 0) {
    const totalAmount = orders.reduce((acc, order) => {
      return acc + Number(order.price);
    }, 0);

    return <div>{totalAmount.toFixed(2)}</div>;
  }
  return <div>0</div>;
};

export default TripOrderTotalAmount;
