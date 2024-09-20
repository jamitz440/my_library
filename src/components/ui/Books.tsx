"use client";
import { getLibrary, getWishlist } from "~/server/actions";
import { useQuery } from "@tanstack/react-query";
import { BookOverview } from "~/components/ui/BookOverview";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { faBadgeCheck } from "@awesome.me/kit-30477fcccd/icons/classic/solid";
import { useState } from "react";
import { Input } from "./input";

export default function Books({ page }: { page: "wishlist" | "library" }) {
  const [filter, setFilter] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: [page],
    queryFn: async () => {
      if (page == "library") {
        const result = await getLibrary();
        return result;
      } else if (page == "wishlist") {
        const result = await getWishlist();
        return result;
      }
    },
    staleTime: 1000,
    refetchOnMount: true,
  });
  if (isLoading) {
    return (
      <div className="mb-16 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[...Array<number>(5)].map((_, index) => (
          <BookOverview.Loading key={index} page={page} />
        ))}
      </div>
    );
  }
  if (error ?? !Array.isArray(data)) {
    console.log(error ?? data);
    return <div>{error?.message ?? "An error occurred."}</div>;
  }
  if (data) {
    return (
      <>
        <div className="mb-4 flex w-full items-center justify-center gap-4">
          <div>Search</div>
          <Input value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data
            .filter(
              (book) => book.title.toLowerCase().includes(filter.toLowerCase()), // Case-insensitive filter on title
            )
            .map((b) => (
              <BookOverview book={b} key={b.id}>
                {b.read ? (
                  <div className="absolute bottom-0 z-0 aspect-square h-24 w-24 bg-gradient-to-tr from-background from-25% to-transparent to-25% p-1 pr-[72px] pt-[72px]">
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
      </>
    );
  }
}
