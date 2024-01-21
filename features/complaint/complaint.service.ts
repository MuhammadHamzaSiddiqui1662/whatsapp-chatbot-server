import { ComplaintI } from "../../types";
import { Complaint } from "./complaint.modal";

export const getAllComplaints = async (): Promise<ComplaintI[]> => {
  const complaints = await Complaint.find<ComplaintI>();
  return complaints;
};

export const getComplaintWithId = async (
  _id: string
): Promise<ComplaintI | null> => {
  const complaint = await Complaint.findOne<ComplaintI>({ _id });
  return complaint;
};

export const createComplaint = async (complaint: ComplaintI) => {
  const _complaint = new Complaint(complaint);
  return await _complaint.save();
};
