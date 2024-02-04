import { JwtPayload } from "jsonwebtoken";
import { ComplaintType, ComplaintStatus, Language, StaffType } from "./enum";
import { Request as ExpressRequest } from "express";

export interface MediaResponse {
  url: string;
  mime_type: "image/jpeg";
  sha256: string;
  file_size: number;
  id: string;
  messaging_product: "whatsapp";
}

export type Template = {
  text: any;
  errorText?: string;
};

export interface ComplaintI {
  id: Number;
  type: ComplaintType;
  block: string;
  house: string;
  status: ComplaintStatus;
}

export interface UserI {
  _id: string;
  name: string;
  block: string;
  house: string;
  mobile: string;
  lang: Language;
}

export interface StaffI {
  _id: string;
  name: string;
  cnic: string;
  password: string;
  accessToken: string;
  mobile: string;
  email: string;
  address: string;
  type: StaffType;
}

export interface Request extends ExpressRequest {
  user?: string | JwtPayload | undefined;
}
