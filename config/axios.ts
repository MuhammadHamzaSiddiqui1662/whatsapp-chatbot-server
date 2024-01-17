import axios from "axios";

const VERSION = process.env.WHATSAPP_API_VERSION || "";
const ID = process.env.PHONE_NUMBER_ID || "";
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN || "";

export const api = axios.create({
  baseURL: `https://graph.facebook.com/${VERSION}`,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});
axios.defaults.headers.common["Authorization"] = `Bearer ${ACCESS_TOKEN}`;
