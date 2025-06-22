import { model, Schema } from "mongoose";
import { IBook } from "../interfaces/books.interface";

const bookSchema = new Schema<IBook>(
    {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
      required: true,
    },
    isbn: { type: String, required: true, unique: true },
    description: String,
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    
  }, 
  { timestamps: true,
    versionKey: false,
   });

   bookSchema.methods.checkAvailability = function () {
     this.available = this.copies > 0;
   };

   bookSchema.pre<IBook>("save", function (next) {
     this.checkAvailability();
     next();
   });

   export const Book = model<IBook>("book", bookSchema);