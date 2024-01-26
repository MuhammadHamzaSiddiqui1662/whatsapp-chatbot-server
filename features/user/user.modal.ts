import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required, but recived an empty value"],
  },
  block: {
    type: String,
    required: [true, "block number is required, but recived an empty value"],
  },
  house: {
    type: String,
    required: [true, "house number is required, but recived an empty value"],
  },
  mobile: {
    type: String,
    required: [true, "mobile number is required, but recived an empty value"],
  },
  lang: {
    type: String,
    required: [true, "lang is required, but recived an empty value"],
  },
});

export const User = model("user", userSchema);
