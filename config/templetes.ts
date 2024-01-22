import { Template } from "../types";

export const TEMPLATES: {
  [title: string]: Template;
} = {
  service: {
    text: `Greetings!\nThis is an automated bot service for Inquiry & Complaint Registration/Tracking regarding local issues.\n\nSelect the appropriate option`,
    errorText: `This is an automated bot, you cannot chat with it, if you want to avail any of our service so please select the option`,
  },
  tracking: {
    text: `Please provide your complaint number`,
    errorText: `Not a valid complaint number, please provide a correct complaint number`,
  },
  inquiry: {
    text: `What do you want to inquire about?`,
    errorText: `This is an automated bot, you cannot chat with it, if you want to inquire about any service so please select the option`,
  },
  complaint: {
    text: `Which type of complaint do you want to register?`,
    errorText: `This is an automated bot, you cannot chat with it, if you want to register any complaint so please select the option`,
  },
  block: {
    text: `Specify the block number`,
    errorText: `This is an automated bot, you cannot chat with it, if you want to register complaint so please select the option`,
  },
  sewerage: {
    text: `Specify the block number`,
    errorText: `This is an automated bot, you cannot chat with it, if you want to register severage complaint so please select the option`,
  },
  streetLight: {
    text: `Specify the block number`,
    errorText: `This is an automated bot, you cannot chat with it, if you want to register street light complaint so please select the option`,
  },
  sanitation: {
    text: `Specify the block number`,
    errorText: `This is an automated bot, you cannot chat with it, if you want to register sanitation complaint so please select the option`,
  },
};
