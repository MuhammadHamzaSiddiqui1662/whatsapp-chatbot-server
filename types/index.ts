import { Complaint, ComplaintStatus } from "./enum";

export interface MediaResponse {
  url: string;
  mime_type: "image/jpeg";
  sha256: string;
  file_size: number;
  id: string;
  messaging_product: "whatsapp";
}

export type Template = {
  text: string;
  errorText: string;
};

export interface ComplaintI {
  type: Complaint;
  block: string;
  house: string;
  status: ComplaintStatus;
}
