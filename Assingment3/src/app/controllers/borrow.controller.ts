import { Request, Response, Router } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";


 export const borrowRouter = Router();

borrowRouter.post("/borrow-book", async (req: Request, res: Response) => {
  const body = req.body;

  try {
    const foundBook = await Book.findById(body.book);

    if (!foundBook || foundBook.copies < body.quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough copies available",
        error: "Insufficient stock",
      });
    }

    foundBook.copies -= body.quantity;
    foundBook.checkAvailability?.();
    await foundBook.save();

    const borrow = await Borrow.create(body);

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      borrow,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to borrow book",
      error,
    });
  }
});

borrowRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Borrow summary retrieved successfully",
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve borrow summary",
      error: (error as Error).message,
    });
  }
});

