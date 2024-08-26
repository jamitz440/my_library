import { MenuBar } from "~/components/ui/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getWishlist } from "~/server/actions";
import Books from "~/components/ui/Books";

export default async function Wishlist() {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ["wishlist"],
      queryFn: getWishlist,
      staleTime: 1000,
    });
  } catch (error) {
    console.error("Error during prefetch:", error);
  }

  return (
    <div className="bg-background">
      <NavBar selected="Wishlist" />
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Books page="wishlist" />
        </HydrationBoundary>
      </div>
      <MenuBar currentPage="Add" />
    </div>
  );
}
