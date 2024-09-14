"use client";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { getStats, getBooksReadPerMonth } from "~/server/actions";
import { useQuery } from "@tanstack/react-query";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { MenuBar } from "~/components/ui/menuBar/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { type books } from "~/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import ReadStats from "~/components/ui/stats/readStats";
import { Skeleton } from "~/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import {
  faBookOpenCover,
  faHeart,
  faStar,
} from "@awesome.me/kit-30477fcccd/icons/classic/solid";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

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
      <SignedIn>
        <StatsSection />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <MenuBar currentPage="Home" />
    </div>
  );
}

const LandingPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-140px)] flex-1 flex-col items-center justify-center bg-background px-4">
      <Card className="max-w-lg border-0 text-center shadow-none">
        <CardContent>
          <h1 className="mb-6 text-4xl font-bold">
            Welcome to Your Personal Library
          </h1>
          <p className="mb-8 text-muted-foreground">
            Organize, rate, and wishlist your favorite books. Take control of
            your reading experience.
          </p>
          <div className="mb-6 flex justify-around">
            <Feature
              icon={faBookOpenCover as FontAwesomeIconProps["icon"]}
              label="Track your books"
            />
            <Feature
              icon={faStar as FontAwesomeIconProps["icon"]}
              label="Rate your reads"
            />
            <Feature
              icon={faHeart as FontAwesomeIconProps["icon"]}
              label="Save your wishlist"
            />
          </div>
          <SignInButton>
            <Button className="w-full bg-primary text-white">
              Get Started
            </Button>
          </SignInButton>
        </CardContent>
        <CardFooter className="flex items-center justify-center text-muted-foreground">
          <p>Join today and start building your dream library.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

// Helper component for displaying feature icons with text
const Feature = ({
  icon,
  label,
}: {
  icon: FontAwesomeIconProps["icon"];
  label: string;
}) => (
  <div className="flex flex-col items-center">
    <div className="mb-2 text-primary">
      <FontAwesomeIcon icon={icon} />{" "}
    </div>
    <p className="text-sm font-medium">{label}</p>
  </div>
);

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

const RadialStats = () => {
  const chartData = [{ month: "january", desktop: 1260, mobile: 570 }];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const totalVisitors = chartData[0]!.desktop + chartData[0]!.mobile;

  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 items-center pb-0 pt-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Books
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="desktop"
              stackId="a"
              cornerRadius={5}
              fill="hsl(var(--secondary))"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="mobile"
              fill="hsl(var(--primary))"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
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
