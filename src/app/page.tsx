"use client";
import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  PolarAngleAxis,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { getStats } from "~/server/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Area, AreaChart } from "recharts";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { MenuBar } from "~/components/ui/MenuBar";
import { NavBar } from "~/components/ui/NavBar";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

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
    return <StatChart read={100} all={150} />;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  if (data) {
    return <StatChart read={data.readBooks} all={data.totalBooks} />;
  }
};

const StatChart = ({ read, all }: { read: number; all: number }) => {
  const totalBooks = all; // Replace with your actual total books count
  const readBooks = read; // Replace with your actual read books count
  const percentageRead = Math.round((readBooks / totalBooks) * 100);
  const chartData = [{ name: "Read Books", value: percentageRead }];

  const chartConfig = {
    value: {
      label: "Read Books",
      color: "hsl(var(--primry))",
    },
  } satisfies ChartConfig;

  return (
    <div className="mx-auto mb-4 grid w-full max-w-screen-xl grid-cols-2 items-center justify-center gap-4 p-4">
      <Card className="flex h-full flex-col sm:hidden">
        <CardContent className="flex-1 p-2 pb-0">
          <ChartContainer
            config={chartConfig}
            className="aspect-square max-h-[250px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={-(360 * (percentageRead / 100)) + 90}
              innerRadius={59}
              outerRadius={85}
              className="fill-primary"
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[65, 52]}
              />
              <RadialBar dataKey="value" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold md:text-4xl"
                          >
                            {percentageRead}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Read
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            {readBooks} out of {totalBooks} books read
          </div>
          <div className="leading-none text-muted-foreground">
            Keep up the great reading progress!
          </div>
        </CardFooter>
      </Card>
      <Card className="hidden h-full flex-col sm:flex">
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={-(360 * (percentageRead / 100)) + 90}
              innerRadius={80}
              outerRadius={110}
              className="fill-primary"
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <RadialBar dataKey="value" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-4xl font-bold"
                          >
                            {percentageRead}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Read
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            {readBooks} out of {totalBooks} books read
          </div>
          <div className="leading-none text-muted-foreground">
            Keep up the great reading progress!
          </div>
        </CardFooter>
      </Card>
      <BarChartStats />
    </div>
  );
};

const BarChartStats = () => {
  const chartbData = [
    { month: "January", books: 186 },
    { month: "February", books: 305 },
    { month: "March", books: 237 },
    { month: "April", books: 73 },
    { month: "May", books: 209 },
    { month: "June", books: 214 },
  ];
  const chartbConfig = {
    books: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  return (
    <Card className="col-span-2">
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
