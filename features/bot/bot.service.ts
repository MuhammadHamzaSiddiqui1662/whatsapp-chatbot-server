import { Bot, Message, createBot } from "whatsapp-cloud-api";
import { RedisClientType, createClient } from "redis";
import { api } from "../../config/axios";
import axios from "axios";
import { MediaResponse, Template } from "../../types";
import { TEMPLATES } from "../../config/templetes";
import { app } from "../../app";
import { Service } from "../../types/enum";

const from = process.env.PHONE_NUMBER_ID!;
const token = process.env.WHATSAPP_TOKEN!;
const webhookVerifyToken = process.env.WEBHOOK_VERIFICATION_TOKEN!;

// Create a bot that can send messages
const bot: Bot = createBot(from, token);
// Starting express server to listen for incoming messages
bot.startExpressServer({
  webhookVerifyToken,
  webhookPath: `/webhook`,
  app,
});

// Create redis client for cashing
const client: RedisClientType = createClient();
client.connect();
client.on("error", (err: any) => console.log("Redis Client Error", err));

(async () => {
  try {
    // temp code for development only
    await client.del("923341850193");

    // Send text message
    const result = await bot.sendText(
      process.env.PERSONAL_PHONE_NUMBER_FOR_TESTING!,
      "Hello world"
    );

    // Listen to ALL incoming messages
    bot.on("message", async (msg) => {
      console.log(msg);

      const prevCon: string[] = await client.lRange(msg.from, 0, -1);
      console.log(prevCon);

      if (msg.type === "text") {
        if (prevCon.length === 0) {
          await bot.sendText(msg.from, TEMPLATES.text as string);
          await client.rPush(msg.from, "new");
        } else if (prevCon.length === 1 && prevCon[0] === "new") {
          await detectService(msg);
        } else {
          let temp = [...prevCon.reverse()];
          switch (Number(temp.pop()) - 1) {
            case Service.Complaint:
              await detectComplaint(msg, temp);
              break;
            case Service.Tracking:
              await trackComplaint(msg);
              break;
            case Service.Inquiry:
              break;

            default:
              break;
          }
        }
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

async function detectService(msg: Message) {
  if (isNaN(msg.data.text)) {
    await bot.sendText(msg.from, TEMPLATES.errorText as string);
  } else {
    await client.rPop(msg.from);
    await client.rPush(msg.from, msg.data.text);
    await bot.sendText(
      msg.from,
      // @ts-ignore
      TEMPLATES[msg.data.text].text
    );
  }
}

async function detectComplaint(msg: Message, temp: string[]) {
  if (temp.length > 0) {
    temp.pop();
    await noteBlockNumberAndAskHouseNumber(msg, temp);
  } else if (isNaN(msg.data.text)) {
    await bot.sendText(
      msg.from,
      // @ts-ignore
      TEMPLATES[Service.Complaint + 1].errorText
    );
  } else {
    await client.rPush(msg.from, msg.data.text);
    await bot.sendText(
      msg.from,
      // @ts-ignore
      TEMPLATES[Service.Complaint + 1][msg.data.text].text
    );
  }
}

async function noteBlockNumberAndAskHouseNumber(msg: Message, temp: string[]) {
  if (temp.length > 0) {
    temp.pop();
    await noteHouseNumberAndAskForImage(msg, temp);
  } else if (isNaN(msg.data.text)) {
    await bot.sendText(
      msg.from,
      `Please provide only number of the block from the list below:\n17\n18\n19\n20`
    );
  } else {
    await client.rPush(msg.from, msg.data.text);
    await bot.sendText(
      msg.from,
      `Provide house number for which complaint has to be registered.\n\nFor example:\nA-123\nB-456\nL-20\nDT-50`
    );
  }
}

async function noteHouseNumberAndAskForImage(msg: Message, temp: string[]) {
  if (temp.length > 0) {
  } else {
    await client.rPush(msg.from, msg.data.text);

    // store record to moongoDB

    await bot.sendText(
      msg.from,
      `Your complaint has been succefully registered!\nComplaint Number: ${"xxxxx"}\n\nIf your want to attach any image to your complain so please send them, it will be helpfull in process`
    );
  }
}

async function trackComplaint(msg: Message) {
  if (isNaN(msg.data.text)) {
    await bot.sendText(
      msg.from,
      // @ts-ignore
      TEMPLATES[Service.Tracking + 1].errorText
    );
  } else {
    // check if there is any complaint in the database and respond with the status
    const dummyStatus = "*IN PROGRESS*";

    await bot.sendText(msg.from, `Your complaint status is ${dummyStatus}`);
  }
}

async function detectInquiry(msg: Message) {
  if (isNaN(msg.data.text)) {
    await bot.sendText(
      msg.from,
      // @ts-ignore
      TEMPLATES[Service.Inquiry + 1].errorText
    );
  } else {
    await bot.sendText(
      msg.from,
      // @ts-ignore
      TEMPLATES[Service.Inquiry + 1][msg.data.text].text
    );
  }
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
