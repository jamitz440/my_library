import { useQuery } from "@tanstack/react-query";
import { getStats } from "~/server/actions";
import ReadStats from "./readStats";
import { RadialStats } from "./radialStats";
import { BarChartMonth } from "./barChartStats";

export const StatsSection = () => {
  interface Stats {
    totalBooks: number;
    readBooks: number;
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const result = await getStats();
      return JSON.parse(result as string) as Stats;
    },
  });
  if (isLoading) {
    return (
      <div className="mx-auto mb-4 grid w-full max-w-screen-xl grid-cols-2 items-center justify-center gap-4 p-4 md:grid-cols-3">
        <ReadStats.Loading />
        <BarChartMonth.Loading />
      </div>
    );
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  if (data) {
    return (
      <div className="mx-auto mb-4 grid w-full max-w-screen-xl grid-cols-2 items-center justify-center gap-4 p-4 md:grid-cols-3">
        <ReadStats read={data.readBooks} all={data.totalBooks} />
        <RadialStats />
        <BarChartMonth />
      </div>
    );
  }
};
