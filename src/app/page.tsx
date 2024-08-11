"use client";
import React, { useState } from "react";
import { BarcodeScanner } from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";
import { env } from "~/env";

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

interface Book {
  publisher: string;
  synopsis: string;
  language: string;
  image: string;
  title_long: string;
  dimensions: string; // This can be a more complex structure if needed
  dimensions_structured: DimensionsStructured;
  pages: number;
  date_published: number;
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

interface BarcodeData {
  rawValue: string;
}

export default function Home() {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [open, setOpen] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    Authorization: env.ISBN_AUTH,
  };

  const getBook = async (book: string) => {
    try {
      const res = await fetch(`https://api2.isbndb.com/book/${book}`, {
        headers: headers,
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = (await res.json()) as Data;

      setText(data.book.title); // No need for await here
      setImage(data.book.image); // No need for await here
      setOpen(false);
      console.log(data); // No need for await here
    } catch (error) {
      console.error("Failed to fetch book data:", error);
    }
  };

  return (
    <div className="App">
      <button onClick={() => setOpen(!open)}>Scan Book</button>
      {open && (
        <BarcodeScanner
          onCapture={(i: BarcodeData) => getBook(i.rawValue)}
          options={{ formats: ["ean_13"] }}
        />
      )}
      <div>Results: {text}</div>
      {image && <img src={image} alt="Book Cover" />}
    </div>
  );
}
