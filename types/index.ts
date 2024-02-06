import { ComplaintType, ComplaintStatus, Language } from "./enum";

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
  complainantId: string;
}

export interface UserI {
  _id: string;
  name: string;
  block: string;
  house: string;
  mobile: string;
  lang: Language;
}
