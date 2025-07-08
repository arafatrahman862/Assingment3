import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { bookRouter } from "./app/controllers/book.controller";
import { borrowRouter } from "./app/controllers/borrow.controller";


const app: Application = express();

app.use(express.json());


app.use(
  cors({
    origin: ["https://assingment-client.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
); 
app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter );


app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Library Management System");
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(400).json({
    success: false,
    message: "Validation failed",
    error: err?.message || err,
  });
});



export default app;