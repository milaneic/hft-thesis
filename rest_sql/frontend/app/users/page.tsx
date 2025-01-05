"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { User } from "@/lib/types";
import LoadingSpinner from "../components/LoadingSpinner";
import { useEffect, useState } from "react";

const UsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch events, status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-container">
      <h1 className="text-4xl mb-5">Users</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default UsersPage;
