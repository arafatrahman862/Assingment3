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
// borrowRouter.post("/borrow-book", async (req: Request, res: Response) => {
//   const body = req.body;
//   try {
//     const foundBook = await Book.findById(body.book);
//     if (!foundBook || foundBook.copies < body.quantity) {
//       return res.status(400).json({
//         success: false,
//         message: "Not enough copies available",
//         error: "Insufficient stock",
//       });
//     }
//     foundBook.copies -= body.quantity;
//     foundBook.checkAvailability?.();
//     await foundBook.save();
//     const borrow = await Borrow.create(body);
//     res.status(201).json({
//       success: true,
//       message: "Book borrowed successfully",
//       borrow,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to borrow book",
//       error,
//     });
//   }
// });
exports.borrowRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve borrow summary",
            error: error.message,
        });
    }
}));
