import { Complaint, ComplaintStatus, Language } from "./enum";

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
  type: Complaint;
  block: string;
  house: string;
  status: ComplaintStatus;
}

export interface UserI {
  name: string;
  block: string;
  house: string;
  mobile: string;
  lang: Language;
}
