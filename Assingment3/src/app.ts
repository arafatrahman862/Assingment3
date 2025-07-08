import express, { Application, Request, Response } from "express";
import cors from "cors";
import { bookRouter } from "./app/controllers/book.controller";
import { borrowRouter } from "./app/controllers/borrow.controller";


const app: Application = express();

app.use(express.json());


app.use(
  cors({
    origin: ["https://assingment-client.vercel.app"],
  })
); 
app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter );

app.use((err: any, req: Request, res: Response, _next: Function) => {
  res.status(400).json({
    success: false,
    message: "Validation failed",
    error: err.message || err,
  });
});

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Library Management System");
});


export default app;