import { mongoose } from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    fullName: String,
  });

export const models = [
  {
    name: "Student",
    schema: studentSchema,
    collection: "students",
  },
];
