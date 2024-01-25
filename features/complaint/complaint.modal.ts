import { Schema, model } from "mongoose";
import { ComplaintStatus } from "../../types/enum";

const complaintSchema = new Schema({
  type: {
    type: Number,
    required: [true, "complaint type is required, but recived an empty value"],
  },
  block: {
    type: String,
    required: [true, "block number is required, but recived an empty value"],
  },
  house: {
    type: String,
    required: [true, "house number is required, but recived an empty value"],
  },
  status: {
    type: Number,
    default: ComplaintStatus.Pending,
  },
  date: {
    type: Date,
  },
});

complaintSchema.pre("save", function (next) {
  this.date = new Date();
  next();
});

export const Complaint = model("complaint", complaintSchema);
