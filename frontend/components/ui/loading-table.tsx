import React from "react";
import { Skeleton } from "./skeleton";
import { Table } from "lucide-react";
import { TableBody, TableHeader } from "./table";
import { Button } from "react-day-picker";

const LoadingTable = () => {
  return (
    <div>
      <div className="flex items-center py-4">
        <Skeleton className="h-4 w-[250px]" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <Skeleton className="w-full h-full" />
          </TableHeader>
          <TableBody>
            <Skeleton className="w-full h-1/2" />
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button>Previous</Button>
        <Button>Next</Button>
      </div>
    </div>
  );
};

export default LoadingTable;
