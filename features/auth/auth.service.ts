import { compare } from "bcrypt";
import {
  createStaff,
  getStaffWithCnicNumber,
  updateStaff,
} from "../staff/staff.service";
import { Request, StaffI } from "../../types";
import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";

export const login = async (cnic: string, password: string) => {
  let staff = await getStaffWithCnicNumber(cnic);
  const result = await compare(password, staff?.password!);
  if (result && staff) {
    const accessToken = jwt.sign({ _id: staff?._id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });
    staff.accessToken = accessToken;
    await updateStaff(staff._id, staff);
    return staff;
  } else return null;
};

export const signUp = async (staff: StaffI) => {
  return await createStaff(staff);
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
