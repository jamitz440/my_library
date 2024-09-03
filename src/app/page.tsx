"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { type ChartConfig, ChartContainer } from "~/components/ui/chart";
import { getStats, getBooksReadPerMonth } from "~/server/actions";
import { useQuery } from "@tanstack/react-query";

import { MenuBar } from "~/components/ui/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { type books } from "~/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import ReadStats from "~/components/ui/stats/readStats";
import { Skeleton } from "~/components/ui/skeleton";

type Bookk = InferSelectModel<typeof books>;

interface DimensionsStructured {
  length: {
    unit: string;
    value: number;
  };
  width: {
    unit: string;
    value: number;
  };
  weight: {
    unit: string;
    value: number;
  };
  height: {
    unit: string;
    value: number;
  };
}

export interface Book {
  publisher: string;
  synopsis: string;
  language: string;
  image: string;
  title_long: string;
  dimensions: string; // This can be a more complex structure if needed
  dimensions_structured: DimensionsStructured;
  pages: number;
  date_published: string;
  subjects: string[];
  authors: string[];
  title: string;
  isbn13: string;
  msrp: string;
  binding: string;
  isbn: string;
  isbn10: string;
}

export default function Home() {
  return (
    <div className="bg-background">
      <NavBar selected="Home" />

      <StatsSection />

      <MenuBar currentPage="Home" />
    </div>
  );
}

const StatsSection = () => {
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
      <div className="mx-auto mb-4 grid w-full max-w-screen-xl grid-cols-2 items-center justify-center gap-4 p-4">
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
      <div className="mx-auto mb-4 grid w-full max-w-screen-xl grid-cols-2 items-center justify-center gap-4 p-4">
        <ReadStats read={data.readBooks} all={data.totalBooks} />
        <BarChartMonth />
      </div>
    );
  }
};

type StatData = {
  month: string;
  books: number;
};
type BarChartStatsProps = {
  chartbData: StatData[];
};

const BarChartStats = ({ chartbData }: BarChartStatsProps) => {
  const chartbConfig = {
    books: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  return (
    <Card className="col-span-2 sm:col-span-1">
      <CardContent>
        <ChartContainer config={chartbConfig}>
          <BarChart
            accessibilityLayer
            data={chartbData}
            margin={{
              top: 30,
            }}
            className="pt-2"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <Bar dataKey="books" fill="hsl(var(--primary))" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total books read for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};
type GroupedBooks = Record<string, { month: string; count: number }>;

const BarChartMonth = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Function to generate an array of all months in the range
  function generateAllMonths(startDate: Date, endDate: Date): string[] {
    const months: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setDate(1);
    end.setDate(1);
    end.setMonth(end.getMonth() + 1);

    while (start < end) {
      months.push(`${monthNames[start.getMonth()]} ${start.getFullYear()}`);
      start.setMonth(start.getMonth() + 1);
    }

    return months;
  }

  // Function to group books by month
  function groupBooksByMonth(books: Bookk[]): GroupedBooks {
    return books.reduce((acc: GroupedBooks, book: Bookk) => {
      if (book.read && book.readAt) {
        const date = new Date(book.readAt);
        const year = date.getFullYear();
        const month = date.getMonth(); // JavaScript months are 0-based
        const key = `${monthNames[month]} ${year}`;

        if (!acc[key]) {
          acc[key] = { month: key, count: 0 };
        }

        acc[key].count++;
      }

      return acc;
    }, {});
  }

  // Function to ensure all months are included
  function fillMissingMonths(
    groupedBooks: GroupedBooks,
    startDate: Date,
    endDate: Date,
  ): StatData[] {
    const allMonths = generateAllMonths(startDate, endDate);
    return allMonths.map((month) => ({
      month,
      books: groupedBooks[month]?.count ?? 0,
    }));
  }

  const { data, error, isLoading } = useQuery<Bookk[], Error>({
    queryKey: ["months"],
    queryFn: async () => {
      const result = await getBooksReadPerMonth();
      return result as Bookk[];
    },
  });

  if (isLoading) {
    return <BarChartMonth.Loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (data) {
    // Adjust the start and end dates
    const startDate = new Date(
      Math.min(...data.map((book: Bookk) => new Date(book.readAt!).getTime())),
    );
    const endDate = new Date();

    // Shift dates back by one month
    startDate.setMonth(startDate.getMonth() - 1);
    endDate.setMonth(endDate.getMonth() - 1);

    const groupedBooks = groupBooksByMonth(data);
    const chartbData = fillMissingMonths(groupedBooks, startDate, endDate);

    return <BarChartStats chartbData={chartbData} />;
  }

  return null; // Fallback for when there's no data (although unlikely)
};

BarChartMonth.Loading = function BarChartMonth() {
  const chartConfig = {
    books: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="col-span-2 sm:col-span-1">
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            margin={{
              top: 30,
            }}
            className="pt-2"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <Bar dataKey="books" fill="hsl(var(--primary))" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <Skeleton className="mr-auto h-4 w-5/6 rounded-full" />
      </CardFooter>
    </Card>
  );
};
