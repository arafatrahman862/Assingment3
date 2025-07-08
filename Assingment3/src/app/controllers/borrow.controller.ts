import { Request, Response, Router } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";

export const borrowRouter = Router();


borrowRouter.post("/", async (req: Request, res: Response) => {
  const { book, quantity, dueDate } = req.body;

  if (!book || !quantity || !dueDate) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  // Validate date format
  const dueDateObj = new Date(dueDate);
  if (isNaN(dueDateObj.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid dueDate format",
    });
  }

  try {
    const foundBook = await Book.findById(book);
    if (!foundBook) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (foundBook.copies < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough copies available",
      });
    }

    foundBook.copies -= quantity;
    foundBook.available = foundBook.copies > 0;
    await foundBook.save();

    const borrow = await Borrow.create({
      book,
      quantity,
      dueDate: dueDateObj,
    });

    return res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to borrow book",
      error: (error as Error).message,
    });
  }
});


borrowRouter.get("/summary", async (_req: Request, res: Response) => {
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
          title: "$bookDetails.title",
          isbn: "$bookDetails.isbn",
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
