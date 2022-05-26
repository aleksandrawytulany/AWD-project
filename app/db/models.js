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

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "You need a username"],
      minLength: [3, "That's too short"],
    },
    password: {
      type: String,
      required: [true, "You need a password"],
      minLength: [8, "That's too short"],
    },
  },
  { timestamps: true }
);

export const models = [
  {
    name: "Student",
    schema: studentSchema,
    collection: "students",
  },
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
];
