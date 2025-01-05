"use client";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { SessionProvider, useSession } from "next-auth/react";
import LoadingSpinner from "./LoadingSpinner";
import NavBar from "./NavBar";

// Main provider component
const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
    </SessionProvider>
  );
};

export default Provider;

const ApolloProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <>
        <NavBar />
        <LoadingSpinner />
      </>
    );
  }

  const client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
    cache: new InMemoryCache(),
    // headers: {
    //   Authorization: session?.accessToken
    //     ? `Bearer ${session.accessToken}`
    //     : "",
    // },
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
