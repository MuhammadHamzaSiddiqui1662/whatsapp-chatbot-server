import { StaffI } from "../../types";
import { Staff } from "./staff.modal";

export const getAllStaff = async (): Promise<StaffI[]> => {
  const staff = await Staff.find<StaffI>();
  return staff;
};

export const getStaffWithId = async (_id: string): Promise<StaffI | null> => {
  const staff = await Staff.findOne<StaffI>({ _id });
  return staff;
};

export const getStaffWithMobileNumber = async (
  mobile: string
): Promise<StaffI | null> => {
  const staff = await Staff.findOne<StaffI>({ mobile });
  return staff;
};

export const getStaffWithCnicNumber = async (
  cnic: string
): Promise<StaffI | null> => {
  const staff = await Staff.findOne<StaffI>({ cnic });
  return staff;
};

export const createStaff = async (staff: Omit<StaffI, "_id">) => {
  const _staff = new Staff(staff);
  return await _staff.save();
};

export const updateStaff = async (id: string, staff: StaffI) => {
  return await Staff.updateOne({ _id: id }, staff);
};
