import { mongoose } from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
    minLength: [50, "Write a bit more"],
    maxLength: [150, "Your bio can be max 150 characters"],
  },
  linkedinLink: {
    type: String,
    required: true,
  },
  websiteLink: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  dateCreated: String,
  studentImg: {
    type: String,
    required: true,
  },
  creatorId: String,
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
      minLength: [4, "That's too short"],
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
