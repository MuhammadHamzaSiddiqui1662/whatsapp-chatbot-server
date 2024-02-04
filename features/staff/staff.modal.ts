import { Schema, model } from "mongoose";
import { isEmail } from "validator";
import { genSalt, hash } from "bcrypt";

const staffSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required, but recived an empty value"],
  },
  cnic: {
    type: String,
    unique: true,
    required: [true, "cnic is required, but recived an empty value"],
  },
  password: {
    type: String,
    required: [true, "password is required, but recived an empty value"],
    minlength: [3, "minimun password length is 3 characters"],
  },
  accessToken: {
    type: String,
  },
  mobile: {
    type: String,
    required: [true, "mobile number is required, but recived an empty value"],
  },
  email: {
    type: String,
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  address: {
    type: String,
    required: [true, "address is required, but recived an empty value"],
  },
  type: {
    type: Number,
    require: [true, "staff type is required, but recived an empty value"],
  },
});

staffSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

export const Staff = model("staff", staffSchema);
