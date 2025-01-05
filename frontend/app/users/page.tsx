"use client";

import { useQuery } from "@apollo/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { User } from "@/lib/types";
import LoadingSpinner from "../components/LoadingSpinner";
import { QUERY_GET_USERS } from "@/lib/queries";

interface UsersType {
  users: User[];
}

const UsersPage = () => {
  const { loading, error, data } = useQuery<UsersType>(QUERY_GET_USERS);

  if (loading) return <LoadingSpinner />;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-container">
      <h1 className="text-4xl mb-5">Users</h1>
      <DataTable columns={columns} data={data?.users || []} />
    </div>
  );
};

export default UsersPage;
