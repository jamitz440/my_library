"use client";
import { getBooks } from "~/server/actions";
import { useQuery } from "@tanstack/react-query";
import { BookOverview } from "~/components/ui/BookOverview";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBadgeCheck
} from "@awesome.me/kit-30477fcccd/icons/classic/solid";

export default function Books() {
  const { data, error, isFetched, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const result = await getBooks();
      return result
    },
    staleTime: 1000,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  if (data) {
    
    return (
      <div className="mb-16 grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {data.data?.map((b) => <BookOverview book={b} key={b.id}>{b.read ? <div className="absolute bottom-0 h-24 w-auto p-1 pt-14 pr-14 aspect-square bg-gradient-to-tr from-white from-40% to-transparent to-50% group-hover:opacity-0 transition-opacity duration-150"><FontAwesomeIcon className="h-full w-full text-green-600" icon={faBadgeCheck as FontAwesomeIconProps["icon"]} /></div> : ''}</BookOverview>)}
      </div>
    );
  }
}
