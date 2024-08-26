import { MenuBar } from "~/components/ui/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getLibrary } from "~/server/actions";
import Books from "./Books";

export default async function Library() {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ["library"],
      queryFn: getLibrary,
      staleTime: 1000,
    });
  } catch (error) {
    console.error("Error during prefetch:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar selected="Library" />
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Books page="library" />
        </HydrationBoundary>
      </div>
      <MenuBar currentPage="Library" />
    </div>
  );
}
