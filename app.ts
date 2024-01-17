import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createBot } from "whatsapp-cloud-api";
import { createClient } from "redis";
import { api } from "./config/axios";
import axios from "axios";
import { MediaResponse } from "./types";

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

(async () => {
  try {
    const from = process.env.PHONE_NUMBER_ID!;
    const token = process.env.WHATSAPP_TOKEN!;
    const webhookVerifyToken = process.env.WEBHOOK_VERIFICATION_TOKEN!;

    // Create a bot that can send messages
    const bot = createBot(from, token);

    const client = await createClient()
      .on("error", (err: any) => console.log("Redis Client Error", err))
      .connect();

    // Send text message
    const result = await bot.sendText(
      process.env.PERSONAL_PHONE_NUMBER_FOR_TESTING!,
      "Hello world"
    );

    // Starting express server to listen for incoming messages
    await bot.startExpressServer({
      webhookVerifyToken,
      webhookPath: `/webhook`,
      app,
    });
    console.log(await client.del("923341850193"));

    // Listen to ALL incoming messages
    // NOTE: remember to always run: await bot.startExpressServer() first
    bot.on("message", async (msg) => {
      console.log(msg);

      const prevCon: string[] = await client.lRange(msg.from, 0, -1);
      console.log(prevCon);

      if (msg.type === "text") {
        // Add reply to cache
        await client.rPush(msg.from, msg.data.text);
        const newCon = await client.lRange(msg.from, 0, -1);
        const conLength = await client.lLen(msg.from);
        console.log(newCon, conLength);

        await bot.sendText(msg.from, "Received your text message!");
      } else if (msg.type === "image") {
        await bot.sendText(msg.from, "Received your image!");
        const imageId = msg.data.id;
        console.log("image id:", imageId);
        const image = await getMediaDetails(imageId);
        console.log("image details", image);
        const { data: imageData, headers } = await getMediaBinary(image.url);
        console.log("image binary:", imageData);
      }
    });
  } catch (err) {
    console.log(err);
  }
})();

async function getMediaDetails(id: string) {
  const { data } = await api.get<MediaResponse>(`/${id}/`);
  console.log(data);
  return data;
}

async function getMediaBinary(mediaUrl: string) {
  const { data, headers } = await axios.get(mediaUrl);
  return { data, headers };
}
// 52f3d73d2308c7802bec15e6694e9076fb090a04dc6e59fbd00d5092dfadf61b
// UvPXPSMIx4Ar7BXmaU6QdvsJCgTcbln70A1Qkt+t9hs=

// const SampleMediaResponse = {
//   url: "https://lookaside.fbsbx.com/whatsapp_business/attachments/?mid=2086288015070658&ext=1705479380&hash=ATuGwy80gb8vhM3wuXHt6MqmyCKwxzh0WEYYOTKMyafwSw";
//   mime_type: "image/jpeg";
//   sha256: "52f3d73d2308c7802bec15e6694e9076fb090a04dc6e59fbd00d5092dfadf61b";
//   file_size: 247777;
//   id: "2086288015070658";
//   messaging_product: "whatsapp";
// }
