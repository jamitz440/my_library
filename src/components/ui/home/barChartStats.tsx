import { useQuery } from "@tanstack/react-query";
import { BarChart, CartesianGrid, XAxis, Bar, LabelList } from "recharts";
import { type Bookk } from "~/app/search/page";
import { getBooksReadPerMonth } from "~/server/actions";
import { Card, CardContent, CardFooter } from "../card";
import { type ChartConfig, ChartContainer } from "../chart";
import { Skeleton } from "../skeleton";
import { type InferSelectModel } from "drizzle-orm";
import { type books } from "~/server/db/schema";

type Book = InferSelectModel<typeof books>;

type StatData = {
  month: string;
  books: number;
};
type BarChartStatsProps = {
  chartbData: StatData[];
};

export const BarChartStats = ({ chartbData }: BarChartStatsProps) => {
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

export const BarChartMonth = () => {
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
  function groupBooksByMonth(books: Book[]): GroupedBooks {
    return books.reduce((acc: GroupedBooks, book: Book) => {
      if (book.read && book.readAt) {
        const date = new Date(book.readAt);
        const year = date.getFullYear();
        const month = date.getMonth();
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

  const { data, error, isLoading } = useQuery<Book[], Error>({
    queryKey: ["months"],
    queryFn: async () => {
      const result = await getBooksReadPerMonth();
      return result as Book[];
    },
  });

  if (isLoading) {
    return <BarChartMonth.Loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (data) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 5); // Last 6 months

    const filteredBooks = data.filter((book: Book) => {
      if (book.read && book.readAt) {
        const readDate = new Date(book.readAt);
        return readDate >= startDate && readDate <= endDate;
      }
      return false;
    });

    const groupedBooks = groupBooksByMonth(filteredBooks);
    const chartbData = fillMissingMonths(groupedBooks, startDate, endDate);

    return <BarChartStats chartbData={chartbData} />;
  }

  return null;
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
