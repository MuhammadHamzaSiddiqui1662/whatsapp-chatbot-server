export interface MediaResponse {
  url: string;
  mime_type: "image/jpeg";
  sha256: string;
  file_size: number;
  id: string;
  messaging_product: "whatsapp";
}

export type Template =
  | TemplateOptions
  | {
      text: string;
      errorText?: string;
    };

export interface TemplateOptions {
  [option: string]: Template;
}
