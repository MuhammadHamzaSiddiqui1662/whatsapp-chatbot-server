import { Bot, Message, createBot } from "whatsapp-cloud-api";
import { RedisClientType, createClient } from "redis";
import { api } from "../../config/axios";
import axios from "axios";
import { MediaResponse } from "../../types";
import { TEMPLATES } from "../../config/templetes";
import { app } from "../../app";
import { Complaint, ComplaintStatus, Service } from "../../types/enum";
import {
  createComplaint,
  getComplaintWithId,
} from "../complaint/complaint.service";

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
    await client.del("923158508658");

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
      try {
        if (msg.type === "text" || msg.type === "button_reply") {
          if (prevCon.length === 0) {
            // await bot.sendText(msg.from, TEMPLATES.text as string);
            await bot.sendReplyButtons(msg.from, TEMPLATES.service.text, {
              0: "Register Complaint",
              1: "Complaint Tracking",
              2: "Inquiry",
            });
            // await bot.sendReplyButtons(msg.from, "abc", { 3: "dsf", 4: "sdf" });
            await client.rPush(msg.from, "new");
          } else if (prevCon.length === 1 && prevCon[0] === "new") {
            await detectService(msg);
          } else {
            let temp = [...prevCon.reverse()];
            switch (Number(temp.pop())) {
              case Service.Complaint:
                await detectComplaint(msg, temp);
                break;
              case Service.Tracking:
                await trackComplaint(msg);
                break;
              case Service.Inquiry:
                await detectInquiry(msg);
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
      } catch (error) {
        console.log(error);
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
  let content = "";
  if (msg.type === "button_reply") {
    content = msg.data.id;
  } else {
    content = msg.data.text;
  }
  if (content != "0" && content != "1" && content != "2") {
    await bot.sendReplyButtons(msg.from, TEMPLATES.service.errorText, {
      0: "Register Complaint",
      1: "Complaint Tracking",
      2: "Inquiry",
    });
  } else {
    await client.rPop(msg.from);
    await client.rPush(msg.from, content);
    if (content == "0")
      await bot.sendReplyButtons(msg.from, TEMPLATES.complaint.text, {
        0: "Sewerage",
        1: "Street Light",
        2: "Sanitaion",
      });
    if (content == "1") await bot.sendText(msg.from, TEMPLATES.tracking.text);
    if (content == "2")
      await bot.sendReplyButtons(msg.from, TEMPLATES.inquiry.text, {
        0: "Birth Certificate",
        1: "Death Certificate",
        2: "Marriage Certificate",
        3: "Divorce Certificate",
      });
  }
}

async function detectComplaint(msg: Message, temp: string[]) {
  let content = "";
  if (msg.type === "button_reply") {
    content = msg.data.id;
  } else {
    content = msg.data.text;
  }
  if (temp.length > 0) {
    temp.pop();
    await noteBlockNumberAndAskHouseNumber(msg, temp);
  } else if (content != "0" && content != "1" && content != "2") {
    await bot.sendReplyButtons(msg.from, TEMPLATES.complaint.errorText, {
      0: "Sewerage",
      1: "Street Light",
      2: "Sanitaion",
    });
  } else {
    await client.rPush(msg.from, content);
    await bot.sendReplyButtons(msg.from, TEMPLATES.block.text, {
      0: "Block 13",
      1: "Block 17",
      2: "Block 18",
    });
  }
}

async function noteBlockNumberAndAskHouseNumber(msg: Message, temp: string[]) {
  let content = "";
  let id = "";
  if (msg.type === "button_reply") {
    content = msg.data.title;
    id = msg.data.id;
  } else {
    content = msg.data.text;
    id = msg.data.text;
  }
  if (temp.length > 0) {
    temp.pop();
    await noteHouseNumberAndAskForImage(msg, temp);
  } else if (id != "0" && id != "1" && id != "2") {
    await bot.sendReplyButtons(msg.from, TEMPLATES.block.errorText, {
      0: "Block 13",
      1: "Block 17",
      2: "Block 18",
    });
  } else {
    await client.rPush(msg.from, content);
    await bot.sendText(
      msg.from,
      `شکایت کا پتہ کیا ہے؟\n\nWhat is the address of the complaint?`
    );
  }
}

async function noteHouseNumberAndAskForImage(msg: Message, temp: string[]) {
  let content = "";
  if (msg.type === "button_reply") {
    content = msg.data.id;
  } else {
    content = msg.data.text;
  }
  if (temp.length > 0) {
  } else {
    await client.rPush(msg.from, content);

    // store record to moongoDB
    const complaint = await createComplaint({
      house: (await client.rPop(msg.from))!,
      block: (await client.rPop(msg.from))!,
      type: (await client.rPop(msg.from))! as any as Complaint,
      status: ComplaintStatus.Pending,
    });

    await client.del(msg.from);

    await bot.sendText(
      msg.from,
      `Thank you for registering your complaint regarding ${
        Complaint[complaint.type]
      }.\nPlease note your complaint number in the next message for tracking in future.\nOne of our team members will be assigned to resolve the issue as soon as possible.\nExpected complaint resolution time is 2 to 3 working days.\nWe appreciate your cooperation.\n\nTeam UC 2 Samanabad`
    );
    await bot.sendText(msg.from, `Your Complaint Number is:`);
    await bot.sendText(msg.from, `${complaint._id}`);
  }
}

async function trackComplaint(msg: Message) {
  try {
    let content = "";
    if (msg.type === "button_reply") {
      content = msg.data.id;
    } else {
      content = msg.data.text;
    }
    // check if there is any complaint in the database and respond with the status
    const complaint = await getComplaintWithId(content);
    if (complaint === null) {
      return await bot.sendText(
        msg.from,
        "Invalid complaint id, re-enter the correct id"
      );
    }

    await bot.sendText(
      msg.from,
      `Your complaint status is ${
        complaint?.status === ComplaintStatus.Pending
          ? "pending"
          : complaint?.status === ComplaintStatus.InProgress
          ? "in progress"
          : complaint?.status === ComplaintStatus.Completed
          ? "completed"
          : "undefined"
      }`
    );
    await client.del(msg.from);
    await bot.sendText(
      msg.from,
      "This chat has ended here, to start a new chat send any text message"
    );
  } catch (err: any) {
    console.log(err);
  }
}

async function detectInquiry(msg: Message) {
  let content = "";
  if (msg.type === "button_reply") {
    content = msg.data.id;
  } else {
    content = msg.data.text;
  }
  if (content != "0" && content != "1" && content != "2" && content != "3") {
    await bot.sendReplyButtons(msg.from, TEMPLATES.inquiry.errorText, {
      0: "Birth Certificate",
      1: "Death Certificate",
      2: "Marriage Certificate",
      3: "Divorce Certificate",
    });
  } else {
    await client.del(msg.from);
    await bot.sendText(
      msg.from,
      "For the issuance of birth certificate, your require theses documents:\n1: CNIC copy\n2: hospital certificate"
    );
    await bot.sendText(
      msg.from,
      "This chat has ended here, to start a new chat send any text message"
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
