"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRouter = void 0;
const express_1 = require("express");
const borrow_model_1 = require("../models/borrow.model");
exports.borrowRouter = (0, express_1.Router)();
// borrowRouter.post("/", async (req: Request<{}, {}, any>, res: Response) => {
//   const { book, quantity, dueDate } = req.body;
//   if (!book || !quantity || !dueDate) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing required fields",
//     });
//   }
//   const dueDateObj = new Date(dueDate);
//   if (isNaN(dueDateObj.getTime())) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid dueDate format",
//     });
//   }
//   try {
//     const foundBook = await Book.findById(book);
//     if (!foundBook) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Book not found" });
//     }
//     if (foundBook.copies < quantity) {
//       return res.status(400).json({
//         success: false,
//         message: "Not enough copies available",
//       });
//     }
//     foundBook.copies -= quantity;
//     foundBook.available = foundBook.copies > 0;
//     await foundBook.save();
//     const borrow = await Borrow.create({
//       book,
//       quantity,
//       dueDate: dueDateObj,
//     });
//     return res.status(201).json({
//       success: true,
//       message: "Book borrowed successfully",
//       data: borrow,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to borrow book",
//       error: (error as Error).message,
//     });
//   }
// });
exports.borrowRouter.get("/summary", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve borrow summary",
            error: error.message,
        });
    }
}));
