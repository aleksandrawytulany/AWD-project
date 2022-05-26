import { mongoose } from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    fullName: String,
    bio: String,
    linkedinLink: String,
    websiteLink: String,
    tags: String,
    dateCreated: String,
    studentImg: String,
  });

export const models = [
  {
    name: "Student",
    schema: studentSchema,
    collection: "students",
  },
];
