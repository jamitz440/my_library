import { getSharedWishlist, getUsersName } from "~/server/actions";
import { type InferSelectModel } from "drizzle-orm";
import { type users, type books } from "~/server/db/schema";
import { WishlistBookOverview } from "~/components/ui/wishlistBookOverview";
import { faBooks } from "@awesome.me/kit-30477fcccd/icons/classic/solid";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

type Book = InferSelectModel<typeof books>;
type User = InferSelectModel<typeof users>;
type Res = {
  name: string;
  // Add other properties if they exist in the Res type
};

// Type guard function to check if a value is of type Res
function isRes(value: unknown): value is Res {
  return typeof value === "object" && value !== null && "name" in value;
}

export default async function WishlistShare({
  params,
}: {
  params: { id: string };
}) {
  const books = (await getSharedWishlist(params.id)) as Book[];
  let userName = "Unknown";
  if (books.length > 0 && books[0]?.user_id) {
    const result = await getUsersName(books[0].user_id);
    if (isRes(result)) {
      userName = result.name;
    } else if (typeof result === "string") {
      userName = result;
    }
  }

  return (
    <div className="bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <FontAwesomeIcon
            icon={faBooks as FontAwesomeIconProps["icon"]}
            className="h-8 text-primary"
          />
          <span className="ml-4 mr-auto self-center whitespace-nowrap text-2xl font-semibold text-secondary-foreground">
            {`${userName}'s Wishlist`}
          </span>
        </div>
      </nav>
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="mb-16 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {books.map((book: Book) => (
            <WishlistBookOverview book={book} key={book.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
