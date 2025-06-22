import express from 'express';
import { Book } from '../models/book.model';
import { Request, Response } from "express";


export const bookRouter = express.Router()

bookRouter.post("/create-book", async (req: Request, res: Response) => {
  const body = req.body;

  const book = await Book.create(body);

  res.status(201).json({
    success: true,
    message: "Book created successfully",
    book,
  });
});


bookRouter.get("/", async (req: Request, res: Response) => {
  try {
    const genre = req.query.genre as string;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sort = (req.query.sort as string) === "desc" ? -1 : 1;
    const limit = parseInt(req.query.limit as string) || 10;

    let books;

   
    if (genre) {
      books = await Book.find({ genre })
        .sort({ [sortBy]: sort })
        .limit(limit);
    } else {
      books = await Book.find()
        .sort({ [sortBy]: sort })
        .limit(limit);
    }

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      books,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve books",
      error,
    });
  }
});



bookRouter.get("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const book = await Book.findById(bookId);

  res.status(200).json({
    success: true,
    message: "Book retrieved successfully",
    book,
  });
});


bookRouter.delete("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const book = await Book.findByIdAndDelete(bookId);

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    book,
  });
});


bookRouter.patch("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const updatedData = req.body;

  const book = await Book.findByIdAndUpdate(bookId, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    book,
  });
});