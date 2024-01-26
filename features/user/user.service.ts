import { UserI } from "../../types";
import { User } from "./user.modal";

export const getAllUsers = async (): Promise<UserI[]> => {
  const users = await User.find<UserI>();
  return users;
};

export const getUserWithId = async (_id: string): Promise<UserI | null> => {
  const user = await User.findOne<UserI>({ _id });
  return user;
};

export const getUserWithMobileNumber = async (
  mobile: string
): Promise<UserI | null> => {
  const user = await User.findOne<UserI>({ mobile });
  return user;
};

export const createUser = async (user: UserI) => {
  const _user = new User(user);
  return await _user.save();
};
