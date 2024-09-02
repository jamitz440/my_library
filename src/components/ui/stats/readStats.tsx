import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Card, CardContent, CardFooter } from "../card";
import { type ChartConfig, ChartContainer } from "../chart";

import { Skeleton } from "~/components/ui/skeleton";

function ReadStats({ read, all }: { read: number; all: number }) {
  const totalBooks = all;
  const readBooks = read;
  const percentageRead = Math.round((readBooks / totalBooks) * 100);
  const chartData = [{ name: "Read Books", value: percentageRead }];

  const chartConfig = {
    value: {
      label: "Read Books",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
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
  );
}

ReadStats.Loading = function ReadStatsLoading() {
  return (
    <Card className="flex h-full flex-col sm:hidden">
      <CardContent className="flex-1 p-2 pb-0">
        <Skeleton className="m-5 mx-auto h-[120px] w-[120px] rounded-full" />
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <Skeleton className="mb-2 mr-auto h-[20px] w-24 rounded-full" />
        <Skeleton className="mr-auto h-[10px] w-36 rounded-full" />
        <Skeleton className="mr-auto h-[10px] w-36 rounded-full" />
      </CardFooter>
    </Card>
  );
};

export default ReadStats;
