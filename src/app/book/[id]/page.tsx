"use client";
import { MenuBar } from "~/components/ui/menuBar/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBook, getBook } from "~/server/actions";
import { type InferSelectModel } from "drizzle-orm";
import { type books } from "~/server/db/schema";
import { Card } from "~/components/ui/card";
import StarRating from "~/components/ui/StarRating";
import { Skeleton } from "~/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";

type Book = InferSelectModel<typeof books>;

export default function BookPage({ params }: { params: { id: number } }) {
  const queryClient = useQueryClient();
  const {
    data: book,
    error,
    isLoading,
  } = useQuery<Book, Error>({
    queryKey: ["book", params.id],
    queryFn: async () => {
      const result = await getBook(params.id);
      return result as Book;
    },
  });

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    owned: false,
    read: false,
    rating: 0,
    review: "",
  });

  const [alert, setAlert] = useState(false);
  const [editing, setEditing] = useState(false); // Edit mode state
  const { toast } = useToast();

  // Update formData when book data is fetched
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.authors?.[0] ?? "",
        owned: book.owned ?? false,
        read: book.read ?? false,
        rating: book.rating ?? 0,
        review: book.review ?? "",
      });
    }
  }, [book]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      review: e.target.value,
    });
  };

  const handleRatingChange = (rating: number) => {
    setFormData({
      ...formData,
      rating: rating,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/updateBook", {
        method: "POST",
        body: JSON.stringify({
          id: book?.id,
          formData,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to update the book");
      }
      toast({ title: "Successfully edited book" });
      setEditing(false);
      await queryClient.invalidateQueries({ queryKey: ["library"] });
      await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating book",
        variant: "destructive",
      });
    }
  };

  const warn = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(true);
  };

  const router = useRouter();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await deleteBook(book!.id);
      if (!res.success) {
        throw new Error("Failed to delete the book");
      }
      toast({ title: `${book?.title} successfully deleted` });
      router.back(); // Redirect to a specific page
    } catch (error) {
      console.error(error);
      toast({
        title: "Error deleting book",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar selected="" />
        <div className="flex flex-col items-center px-4 py-8 sm:px-8">
          <Skeleton className="h-80 w-1/2 rounded-lg" />
          <Skeleton className="mt-4 h-12 w-1/2" />
          <Skeleton className="mt-2 h-6 w-1/2" />
        </div>
        <MenuBar currentPage="" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar selected="" />
        <div className="flex flex-col items-center px-4 py-8 sm:px-8">
          <p className="text-red-500">Error loading book data</p>
        </div>
        <MenuBar currentPage="" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar selected="" />
      <div className="relative h-40 w-full overflow-hidden bg-gray-200">
        {/* Blurred zoomed-in background */}
        <div
          className="absolute inset-0 scale-125 bg-cover bg-center blur-md filter"
          style={{
            backgroundImage: `url(${book?.image ?? "/placeholder.png"})`,
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-32 flex flex-col items-center px-4 py-4 sm:px-8">
        {/* Book Cover */}
        <div className="relative z-10 mx-auto aspect-book h-56 overflow-hidden rounded-lg shadow-lg sm:h-64">
          <img
            src={book?.image ?? "/placeholder.png"}
            alt={book?.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Editable Book Details */}
        <Card className="relative z-10 mt-4 w-full max-w-3xl rounded-lg bg-white p-8 pt-6 shadow-lg">
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit"}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <label htmlFor="title">Title:</label>
              {editing ? (
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{formData.title}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author">Author:</label>
              {editing ? (
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{formData.author}</p>
              )}
            </div>

            {/* Status and Owned */}
            <div className="mt-4 flex justify-center gap-4">
              <div>
                {editing ? (
                  <Checkbox
                    id="read"
                    name="read"
                    checked={formData.read}
                    onClick={() =>
                      setFormData({ ...formData, read: !formData.read })
                    }
                  />
                ) : (
                  <p>Status: {formData.read ? "Read" : "Unread"}</p>
                )}
                {editing && (
                  <label htmlFor="read" className="ml-2">
                    Mark as read
                  </label>
                )}
              </div>

              <div>
                {editing ? (
                  <Checkbox
                    id="owned"
                    name="owned"
                    checked={formData.owned}
                    onClick={() =>
                      setFormData({ ...formData, owned: !formData.owned })
                    }
                  />
                ) : (
                  <p>Owned: {formData.owned ? "Yes" : "No"}</p>
                )}
                {editing && (
                  <label htmlFor="owned" className="ml-2">
                    Mark as owned
                  </label>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="mt-4">
              <label htmlFor="rating">Your rating:</label>
              <StarRating
                maxRating={5}
                defaultRating={formData.rating}
                size={24}
                onSetRating={handleRatingChange}
                dynamic={editing} // Only make it interactive in edit mode
              />
            </div>

            {/* Review */}
            <div className="mt-4">
              <label htmlFor="review">Your review:</label>
              {editing ? (
                <Textarea
                  id="review"
                  value={formData.review}
                  onChange={handleReviewChange}
                />
              ) : (
                <p>{formData.review || "No review provided"}</p>
              )}
            </div>
            <div className="mt-4">
              <label htmlFor="review">Synopsis:</label>

              <p
                dangerouslySetInnerHTML={{
                  __html: book!.synopsis
                    ? book!.synopsis.replace(/<br\/>/g, "<br>")
                    : "No synopsis provided",
                }}
              />
            </div>

            {/* Save Button */}
            {editing && (
              <div className="mt-4 flex justify-around">
                <Button variant="destructive" onClick={warn}>
                  Delete
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            )}
          </form>
        </Card>
      </div>

      {/* Alert Dialog for Unsaved Changes */}
      <AlertDialog open={alert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this book?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction type="button" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MenuBar currentPage="" />
    </div>
  );
}
