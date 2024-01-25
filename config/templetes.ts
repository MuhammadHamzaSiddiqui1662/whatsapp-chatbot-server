import { Template } from "../types";

export const TEMPLATES: {
  [title: string]: Template;
} = {
  service: {
    text: `یو سی 2 سمن آباد شکایتی مرکز میں خوش آمدید\n\nWelcome to UC 2 Samanabad Complaints Center.\nThis is an automated bot service for Inquiry & Complaint Registration/Tracking regarding local issues.\n\nSelect the appropriate option`,
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
    text: `آپ کو کس نوعیت کی شکایت ہے؟\n\nIdentify the type of complaint:\n`,
    errorText: `This is an automated bot, you cannot chat with it, if you want to register any complaint so please select the option`,
  },
  block: {
    text: `شکایت کا بلاک کیا ہے؟\n\nWhat is the block of the complaint?`,
    errorText: `This is an automated bot, you cannot chat with it, if you want to register complaint so please select the option`,
  },
};
