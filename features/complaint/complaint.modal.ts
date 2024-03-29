import { Schema, model } from "mongoose";
import { ComplaintStatus } from "../../types/enum";
import { ObjectId } from "mongodb";

const complaintSchema = new Schema({
  id: {
    type: Number,
    required: [true, "id is required, but recived an empty value"],
  },
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
  complainantId: {
    type: ObjectId,
    ref: "User",
    required: [true, "Complainant Id is required, but recived an empty value"],
  },
});

complaintSchema.pre("save", function (next) {
  this.date = new Date();
  next();
});

export const Complaint = model("complaint", complaintSchema);
