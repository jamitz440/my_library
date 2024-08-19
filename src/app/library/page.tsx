import { MenuBar } from "~/components/ui/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getBooks } from "~/server/actions";
import Books from "./Books";

export default async function Library() {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({ 
      queryKey: ["books"], 
      queryFn: getBooks, 
      staleTime: 1000 
    });
  } catch (error) {
    console.error("Error during prefetch:", error); 
  }

  return (
    <div>
      <NavBar selected="Library"/>
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Books />
        </HydrationBoundary>
      </div>
      <MenuBar currentPage="Library" />
    </div>
  );
}
