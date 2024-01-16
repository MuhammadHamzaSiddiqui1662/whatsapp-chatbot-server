import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createBot } from "whatsapp-cloud-api";
import { createClient } from "redis";

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

      const prevCon = await client.lRange(msg.from, 0, -1);
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
      }
    });
  } catch (err) {
    console.log(err);
  }
})();
