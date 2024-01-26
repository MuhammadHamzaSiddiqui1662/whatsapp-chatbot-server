import { ComplaintI } from "../../types";
import { ComplaintStatus } from "../../types/enum";
import { Complaint } from "./complaint.modal";

export const getAllComplaints = async (): Promise<ComplaintI[]> => {
  const complaints = await Complaint.find<ComplaintI>();
  return complaints;
};

export const getComplaintWithId = async (
  id: string
): Promise<ComplaintI | null> => {
  const complaint = await Complaint.findOne<ComplaintI>({ id });
  return complaint;
};

export const createComplaint = async (complaint: ComplaintI) => {
  const _complaint = new Complaint(complaint);
  return await _complaint.save();
};

export const updateComplaintStatus = async (
  id: string,
  status: ComplaintStatus
) => {
  const complaint = await Complaint.updateOne({ _id: id }, { status });
  console.log(complaint);
  return complaint;
};
