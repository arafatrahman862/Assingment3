"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./app/controllers/book.controller");
const borrow_controller_1 = require("./app/controllers/borrow.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/books', book_controller_1.bookRouter);
app.use("/api/borrow", borrow_controller_1.borrowRouter);
app.use((err, req, res, next) => {
    res.status(400).json({
        success: false,
        message: "Validation failed",
        error: err.message || err,
    });
});
app.get('/', (req, res) => {
    res.send('Welcome to Library Management System');
});
exports.default = app;
