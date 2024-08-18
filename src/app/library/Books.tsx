"use client";
import { getBooks } from "~/server/actions";
import { useQuery } from "@tanstack/react-query";
import { BookOverview } from "~/components/ui/BookOverview";

export default function Books() {
  const { data, error, isFetched, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
    staleTime: 1000,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div> {error.message}</div>;
  }
  if (data) {
    console.log(data.data);
    return (
      <div className="mb-16 grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {data.data?.map((b) => <BookOverview book={b} key={b.id} />)}
      </div>
    );
  }
}
