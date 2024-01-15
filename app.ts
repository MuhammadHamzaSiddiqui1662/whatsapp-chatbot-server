import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { api } from "./config/axios";
import { Message, WebhookRequest } from "./types";

dotenv.config();

const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  console.log(`Server is running on port ${PORT}`);
  res.send("Hello World!");
});

app.get("/webhook", async (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === "SECRET") {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", async (req, res) => {
  const messages = extractMessages(req);
  if (messages && messages.length > 0) {
    // Handle each message
    messages.forEach((message: Message) => {
      // Process the message
      console.log("Received message:", message);
      // Respond to the message
      sendMessage(message.from, "Hello! This is an automated response.");
    });
  }
  res.sendStatus(200);
});

const sendMessage = async (to: number, text: string) => {
  try {
    const response = await api.post(``, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { body: text },
    });
    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const extractMessages = (req: WebhookRequest) =>
  req.body.entry[0].changes[0].value.messages;

const extractContacts = (req: WebhookRequest) =>
  req.body.entry[0].changes[0].value.contacts;

const extractMetadata = (req: WebhookRequest) =>
  req.body.entry[0].changes[0].value.metadata;
