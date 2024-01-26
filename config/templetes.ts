import { Template } from "../types";
import { Language } from "../types/enum";

export const TEMPLATES: {
  [lang: number]: {
    [title: string]: Template;
  };
} = {
  [Language.English]: {
    service: {
      text: `Please identify the type of service:`,
    },
    tracking: {
      text: `Please enter your complaint number:`,
      errorText: `This complaint number is not correct.\nPlease share the correct complaint number.`,
    },
    inquiry: {
      text: `What do you want to inquire about?`,
      errorText: `This is an automated bot, you cannot chat with it, if you want to inquire about any service so please select the option`,
    },
    complaint: {
      text: `Identify the type of complaint:`,
    },
    block: {
      text: `What is the block of the complaint?`,
    },
    house: {
      text: `What is the house number of the complaint?`,
    },
    language: {
      text: `Welcome to UC 2 Samanabad Complaints Center.\nPlease select the language to proceed further:`,
      errorText: `Please select the language to proceed further:`,
    },
    name: {
      text: `Please provide your complete name to start:`,
    },
    residentialBlock: {
      text: `Please identify your residential block:`,
    },
    residentialHouse: {
      text: `Please share your house address in this format:`,
    },
    registrationThanks: {
      text: (name: string) =>
        `Thank you for registering yourself ${name}.\nYou can now register your complaints.`,
    },
    address: {
      text: `What is the address of the complaint?`,
    },
    details: {
      text: `Provide any details related to the complaint:`,
    },
    complaintThanks: {
      text: (name: string, complaintType: string) =>
        `Thank you ${name} for registering your complaint regarding ${complaintType}.\nPlease note your complaint number in the next message for tracking in future.\nOne of our team members will be assigned to resolve the issue as soon as possible.\nExpected complaint resolution time is 2 to 3 working days.\nWe appreciate your cooperation.\n\nTeam UC 2 Samanabad`,
    },
    complaintNumber: {
      text: `Your Complaint Number is:`,
    },
    welcome: {
      text: (name: string) =>
        `Welcome back ${name}.\nPlease identify the type of service:`,
    },
  },
  [Language.Urdu]: {
    service: {
      text: `آپ کو کس نوعیت کی سہولت درکار ہے؟`,
    },
    tracking: {
      text: `برائے مہربانی اپنا شکایتی نمبر درج کیجئے۔`,
      errorText: `آپ کا فراہم کیا گیا شکایتی نمبر درست نہیں ہے۔\nبرائے مہربانی صحیح شکایتی نمبر درج کیجئے۔`,
    },
    inquiry: {
      text: `What do you want to inquire about?`,
      errorText: `This is an automated bot, you cannot chat with it, if you want to inquire about any service so please select the option`,
    },
    complaint: {
      text: `آپ کو کس نوعیت کی شکایت ہے؟`,
    },
    block: {
      text: `شکایت کا بلاک کیا ہے؟`,
    },
    house: {
      text: "شکایت کا مکان نمبر کیا ہے؟",
    },
    language: {
      text: `یو سی 2 سمن آباد شکایتی مرکز میں خوش آمدید۔\n برائے مہربانی زبان کا انتخاب کیجیے۔`,
      errorText: `برائے مہربانی زبان کا انتخاب کیجیے۔`,
    },
    name: {
      text: `برائے مہربانی اپنا مکمل نام درج کریں۔`,
    },
    residentialBlock: {
      text: `آپ کس بلاک میں رہتے ہیں؟`,
    },
    residentialHouse: {
      text: `اپنا مکان نمبر اس طرح درج کریں۔`,
    },
    registrationThanks: {
      text: `اپنے کوائف کا اندراج کروانے کا شکریہ۔\nاب آپ اپنی شکایت درج کروا سکتے ہیں۔`,
    },
    address: {
      text: `شکایت کا پتہ کیا ہے؟`,
    },
    details: {
      text: `اپنی شکایت کے بارے میں تفصیل درج کیجئے۔`,
    },
    complaintThanks: {
      text: `بہت شکریہ۔ آپ کی شکایت درج کی جا چکی ہے۔\nاگلے میسج میں دیا گیا آپ کا شکایتی نمبر نوٹ فرما لیجئے۔\nہماری ٹیم آپ کی شکایت حل کرنے کی جلد از جلد کوشش کرے گی۔\nشکایت حل کرنے میں اندازاً دو سے تین دن لگ سکتے ہیں۔\nاس دوران ہم آپ کے تعاون کے شکر گزار رہیں گے۔\n\nٹیم یو سی 2 سمن آباد`,
    },
    complaintNumber: {
      text: `:آپ کا شکایتی نمبر ہے`,
    },
    welcome: {
      text: `خوش آمدید\nآپ کو کس نوعیت کی شکایت ہے؟`,
    },
  },
};
