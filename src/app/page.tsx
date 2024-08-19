"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const BarcodeScanner = dynamic(
  () => import("react-barcode-scanner").then((mod) => mod.BarcodeScanner),
  { ssr: false },
);
const DynamicPolyfill = dynamic(
  () =>
    import("react-barcode-scanner/polyfill").then((module) => {
      // This function will be called when the module is loaded
      // We don't need to return anything since it's not a component
      return () => null;
    }),
  { ssr: false },
);

import { useUser } from "@clerk/nextjs";
import { Input } from "~/components/ui/input";
import { getStats } from "~/server/actions";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type ChartConfig, ChartContainer } from "~/components/ui/chart";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { useBookStore } from "~/state/bookStore";
import { MenuBar } from "~/components/ui/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import { BookOverview } from "~/components/ui/BookOverview";
import { Checkbox } from "~/components/ui/checkbox";

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

interface Data {
  book: Book;
}

interface Res {
  data: Book[];
}

interface BarcodeData {
  rawValue: string;
}

export default function Home() {
  const [book, setBook] = useState<Book | null>();
  const [image, setImage] = useState("");
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(false);
  const { toast } = useToast();
  const libraryStore = useBookStore();
  const [search, setSearch] = useState<string>("");
  const [authorSearch, setAuthorSearch] = useState<string>("");
  const [results, setResults] = useState<Book[]>();
  const [checked, setChecked] = useState<boolean>(false)

  const { isLoaded, isSignedIn, user } = useUser();
  const queryClient = useQueryClient();

  const getBook = async (book: string) => {
    try {
      const res = await fetch("api/getBook", { method: "POST", body: book });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = (await res.json()) as Data;

      setBook(data.book);
      setImage(data.book.image);
      setOpen(false);
      setDialog(true);
    } catch (error) {
      console.error("Failed to fetch book data:", error);
      setBook(null);
    }
  };

  const handleAdd = async () => {
    const res = await fetch("api/addToLibrary", {
      method: "POST",
      body: JSON.stringify({ book: book, user_id: user?.id, read: checked }),
    });
    toast({
      title: `Added to Library`,
      description: `${book?.title} - ${book?.authors[0]}`,
    });
    await queryClient.invalidateQueries({ queryKey: ["books"] });
    await queryClient.invalidateQueries({ queryKey: ["stats"] });
    setDialog(false);
  };

  const handleReset = () => {
    setBook(null);
    setDialog(false);
    setOpen(true);
  };

  const handleSearch = async () => {
    if (search === "") {
      return;
    }
    const res = await fetch("api/searchBooks", {
      method: "POST",
      body: JSON.stringify({ title: search, author: authorSearch }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = (await res.json()) as Res;

    setResults(data.data);
  };

  return (
    <div className="App">
      <NavBar />
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-center p-4">
        <StatsSection />

        <div className="flex w-full items-center justify-center gap-4">
          <div className="flex flex-col gap-4 lg:w-1/2">
            <Input
              className="w-full"
              value={search}
              placeholder="Title"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <Input
              className="w-full"
              placeholder="Author"
              value={authorSearch}
              onChange={(e) => {
                setAuthorSearch(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Button onClick={handleSearch}>Search</Button>
            <Button variant={"secondary"} onClick={() => setOpen(true)}>
              Scan
            </Button>
          </div>
        </div>

        <Dialog open={dialog}>
          <DialogContent
            onPointerDownOutside={() => {
              setDialog(false);
              setOpen(true);
            }}
          >
            <DialogClose onClick={() => setDialog(false)} />
            <DialogHeader>
              <DialogTitle>
                {search
                  ? "Add this book to your library?"
                  : "Is this the correct book?"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex w-full gap-4">
              <div className="relative aspect-book h-52 w-auto overflow-hidden rounded-md">
                {book && (
                  <Image layout="fill" src={book.image} alt={book.title} />
                )}
              </div>
              <div className="flex flex-col">
                <div className="text-lg font-bold">{book?.title}</div>
                <div className="text-lg">{book?.authors}</div>
                <div className="text mt-4">
                  Published: {book?.date_published}
                </div>
                <div className="textlg">Pages: {book?.pages}</div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="terms" checked={checked} onClick={() => setChecked(!checked)} />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mark as read
                  </label>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-around gap-4">
              <Button
                variant={"secondary"}
                onClick={handleReset}
                className="w-full"
              >
                {`No, that's not right!`}
              </Button>
              <Button className="w-full" onClick={handleAdd}>
                {`Add to MyLibrary! `}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {open && (
          <>
            <DynamicPolyfill />
            <BarcodeScanner
              onCapture={(i: BarcodeData) => getBook(i.rawValue)}
              options={{ formats: ["ean_13"] }}
            />
          </>
        )}

        <div className="flex flex-grow flex-wrap">
          {results ? (
            <div className="mb-16 grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {results
                .reduce((uniqueBooks: Book[], b: Book) => {
                  const existingBook = uniqueBooks.find(
                    (ub: Book) =>
                      ub.title === b.title &&
                      Array.isArray(b.authors) &&
                      Array.isArray(ub.authors) &&
                      b.authors.join("") === ub.authors.join(""),
                  );
                  if (!existingBook) {
                    uniqueBooks.push(b);
                  } else {
                    if (BigInt(b.isbn13) > BigInt(existingBook.isbn13)) {
                      uniqueBooks.splice(
                        uniqueBooks.indexOf(existingBook),
                        1,
                        b,
                      );
                    }
                  }
                  return uniqueBooks;
                }, [])
                .map((b: Book) => (
                  <div
                    className=""
                    key={b.isbn13}
                    onClick={() => getBook(b.isbn13)}
                  >
                    <BookOverview book={b}>
                      <div
                        key={`${b.isbn13}-Selector`}
                        className="absolute top-0 flex h-full w-full select-none items-center justify-center bg-zinc-500/80 p-2 text-lg font-bold text-white opacity-0 transition-opacity duration-150 hover:cursor-pointer group-hover:opacity-100"
                      >
                        Add to library
                      </div>
                    </BookOverview>
                  </div>
                ))}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <MenuBar currentPage="Home" />
    </div>
  );
}

const StatsSection = () => {
  interface Stats {
    totalBooks: number;
    readBooks: number;
  }

  const { data, error, isFetched, isLoading } = useQuery({
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
  const chartData = [
    { name: "Read Books", value: percentageRead, fill: "var(--color-read)" },
  ];

  const chartConfig = {
    value: {
      label: "Read Books",
    },
  } satisfies ChartConfig;

  return (
    <div className="mx-auto mb-4 grid w-full max-w-screen-xl grid-cols-1 items-center justify-center gap-4">
      <Card className="flex flex-col">
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
    </div>
  );
};
