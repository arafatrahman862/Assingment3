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
const book_model_1 = require("../models/book.model");
const borrow_model_1 = require("../models/borrow.model");
exports.borrowRouter = (0, express_1.Router)();
exports.borrowRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { book, quantity, dueDate } = req.body;
    if (!book || !quantity || !dueDate) {
        res.status(400).json({
            success: false,
            message: "Missing required fields",
        });
        return;
    }
    const dueDateObj = new Date(dueDate);
    if (isNaN(dueDateObj.getTime())) {
        res.status(400).json({
            success: false,
            message: "Invalid dueDate format",
        });
        return;
    }
    try {
        const foundBook = yield book_model_1.Book.findById(book);
        if (!foundBook) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
            return;
        }
        if (foundBook.copies < quantity) {
            res.status(400).json({
                success: false,
                message: "Not enough copies available",
            });
            return;
        }
        foundBook.copies -= quantity;
        foundBook.available = foundBook.copies > 0;
        yield foundBook.save();
        const borrow = yield borrow_model_1.Borrow.create({
            book,
            quantity,
            dueDate: dueDateObj,
        });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to borrow book",
            error: error.message,
        });
    }
}));
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
