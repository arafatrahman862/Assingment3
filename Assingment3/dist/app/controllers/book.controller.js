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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRouter = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
exports.bookRouter = express_1.default.Router();
exports.bookRouter.post("/create-book", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const book = yield book_model_1.Book.create(body);
    res.status(201).json({
        success: true,
        message: "Book created successfully",
        book,
    });
}));
exports.bookRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genre = req.query.genre;
        const sortBy = req.query.sortBy || "createdAt";
        const sort = req.query.sort === "desc" ? -1 : 1;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {};
        if (genre)
            filter.genre = genre;
        const books = yield book_model_1.Book.find(filter)
            .sort({ [sortBy]: sort })
            .skip(skip)
            .limit(limit);
        const total = yield book_model_1.Book.countDocuments(filter);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            books,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to retrieve books",
            error: error.message,
        });
    }
}));
exports.bookRouter.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const book = yield book_model_1.Book.findById(bookId);
    res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        book,
    });
}));
exports.bookRouter.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const book = yield book_model_1.Book.findByIdAndDelete(bookId);
    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        book,
    });
}));
exports.bookRouter.patch("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const updatedData = req.body;
    const book = yield book_model_1.Book.findByIdAndUpdate(bookId, updatedData, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        book,
    });
}));
