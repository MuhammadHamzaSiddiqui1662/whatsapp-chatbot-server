export interface Message {
  from: number;
  id: "wamid.ID";
  timestamp: number;
  text: {
    body: string;
  };
  type:
    | "text"
    | "image"
    | "document"
    | "audio"
    | "video"
    | "sticker"
    | "location"
    | "contacts"
    | "button_reply"
    | "list_reply";
}

export interface Metadata {
  display_phone_number: number;
  phone_number_id: number;
}

export interface Contact {
  profile: Profile;
  wa_id: string;
}

export interface Profile {
  name: string;
}

export interface WebhookRequest {
  body: {
    object: string;
    entry: {
      id: number;
      changes: {
        value: {
          messaging_product: string;
          metadata: Metadata;
          contacts: Contact[];
          messages: Message[];
        };
        field: "messages";
      }[];
    }[];
  };
}
