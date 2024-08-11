"use client";
import React, { useState } from "react";
import { BarcodeScanner } from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";

export default function Home() {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [open, setOpen] = useState(false);

  let headers = {
    "Content-Type": "application/json",
    Authorization: "54846_317405f0b131a44b60976bc4513a0284",
  };

  const getBook = async (book: string) => {
    const res = await fetch(`https://api2.isbndb.com/book/${book}`, {
      headers: headers,
    });
    const data = await res.json();
    setText(await data.book.title);
    setImage(await data.book.image);
    setOpen(false);
    console.log(await data);
  };

  return (
    <div className="App">
      <button onClick={() => setOpen(!open)}>Scan Book </button>
      {open && (
        <BarcodeScanner
          onCapture={(i) => getBook(i.rawValue)}
          options={{ formats: ["ean_13"] }}
        />
      )}
      <div>Results : {text}</div>
      {image && <img src={image} />}
    </div>
  );
}
