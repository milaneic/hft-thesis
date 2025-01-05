"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Order, Trip } from "@/lib/types";
import FirstOrderOrigin from "@/components/FirstOrderOrigin";
import LastOrderDestination from "@/components/LastOrderDestination";
import TripOrderTotalAmount from "@/components/TripOrderCount";

const lengthOfTrip = (trip: Trip): number => {
  return +(trip.finishOdometar - trip.startOdometar).toFixed(2);
};

const totalAmount = (orders: Order[]): number => {
  const total = orders.reduce((acc, order) => {
    return acc + Number(order.price);
  }, 0);
  return total;
};

export const columns: ColumnDef<Trip>[] = [
  {
    id: "tripNumber",
    header: "Trip #",
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1} </div>;
    },
  },
  {
    accessorKey: "vehicle.plates",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vehicle plates:
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "driver.lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Driver:
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "firstOrderOrigin",
    accessorKey: "orders",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start destination:
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const orders: Order[] | string =
        row.getValue<Order[]>("firstOrderOrigin");
      return <FirstOrderOrigin orders={orders} />;
    },
    filterFn: (row, columnId, filterValue) => {
      const orders: Order[] = row.getValue(columnId);
      // Assuming you are filtering based on the first order's origin country
      return orders.some((order) =>
        order.origin.toLowerCase().includes(filterValue.toLowerCase())
      );
    },
    filterable: true, // Ensure the column is marked as filterable
  },
  {
    id: "lastOrderDestination",
    accessorKey: "orders",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Final destination:
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const orders: Order[] = row.getValue("lastOrderDestination");
      return <LastOrderDestination orders={orders} />;
    },
  },
  {
    id: "orders_count",
    accessorKey: "orders",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total orders:
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const orders: Order[] = row.getValue("orders_count");
      return <div>{orders ? orders.length : "0"}</div>;
    },
  },
  {
    id: "orders_revenue",
    accessorKey: "orders",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Revenue per trip:
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const orders: Order[] = row.getValue("orders_revenue");
      return <TripOrderTotalAmount orders={orders} />;
    },
  },
  {
    accessorKey: "startOdometar",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Length:
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{lengthOfTrip(row.original)}</div>;
    },
  },
  {
    id: "eurosPerKm",
    accessorKey: "orders",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Euros per KM:
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const distance = lengthOfTrip(row.original);
      const total = totalAmount(row.original.orders);
      return <div>{(total / distance).toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Active:
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const active = row.getValue("active");
      if (active) return <span>✅</span>;
      else return <span>❌</span>;
    },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return (
        <div className="font-medium">
          {date.toLocaleDateString("en-UK", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const trip = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`trips/${trip._id}`}>View trip details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
