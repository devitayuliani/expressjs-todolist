import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  task: string;
  description:string,
  completed: boolean;
}

const ToDoSchema: Schema = new Schema({
    task: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

export const Item = mongoose.model<IItem>("Item",ToDoSchema);