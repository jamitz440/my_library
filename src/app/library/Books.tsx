"use client";
import { getBooks } from "~/server/actions";
import { useQuery } from "@tanstack/react-query";
import { BookOverview } from "~/components/ui/BookOverview";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { faBadgeCheck } from "@awesome.me/kit-30477fcccd/icons/classic/solid";

export default function Books() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const result = await getBooks();
      return result;
    },
    staleTime: 1000,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.log(data);
    return <div>{error.message}</div>;
  }
  if (data) {
    return (
      <div className="mb-16 grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {data.map((b) => (
          <BookOverview book={b} key={b.id}>
            {b.read ? (
              <div className="absolute bottom-0 aspect-square h-24 w-24 bg-gradient-to-tr from-background from-25% to-transparent to-25% p-1 pr-[72px] pt-[72px]">
                <FontAwesomeIcon
                  className="h-full w-full text-primary"
                  icon={faBadgeCheck as FontAwesomeIconProps["icon"]}
                />
              </div>
            ) : (
              ""
            )}
          </BookOverview>
        ))}
      </div>
    );
  }
}
