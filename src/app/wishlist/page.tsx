import { MenuBar } from "~/components/ui/menuBar/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getWishlist } from "~/server/actions";
import Books from "~/components/ui/Books";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

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
      <SignedIn>
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Books page="wishlist" />
          </HydrationBoundary>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex min-h-[calc(100vh-140px)] flex-1 flex-col items-center justify-center bg-background px-4">
          <Card className="max-w-lg border-0 text-center shadow-none">
            <CardContent>
              <h1 className="mb-6 text-4xl font-bold">
                Please sign in to use the wishlist
              </h1>
              <p className="mb-8 text-muted-foreground">
                Wislist your favourite books you want to add to your library.
              </p>

              <SignInButton>
                <Button className="w-full bg-primary text-white">
                  Sign In
                </Button>
              </SignInButton>
            </CardContent>
            <CardFooter className="flex items-center justify-center text-muted-foreground">
              <p>Join today and start building your dream library.</p>
            </CardFooter>
          </Card>
        </div>
      </SignedOut>
      <MenuBar currentPage="Add" />
    </div>
  );
}
