import { Bot, Message, createBot } from "whatsapp-cloud-api";
import { api } from "../../config/axios";
import axios from "axios";
import { MediaResponse, UserI } from "../../types";
import { TEMPLATES } from "../../config/templetes";
import { app } from "../../app";
import {
  Block,
  Complaint,
  ComplaintStatus,
  Language,
  Service,
} from "../../types/enum";
import {
  createComplaint,
  getComplaintWithId,
} from "../complaint/complaint.service";
import { createUser, getUserWithMobileNumber } from "../user/user.service";
import client from "../cache/cache.service";

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

(async () => {
  try {
    // temp code for development only
    await client.del("923341850193");
    await client.del("923158508658");
    await client.del("923341850193/user");
    await client.del("923158508658/user");

    await client.set("complaintNo", 1);

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
          const user = await getUserWithMobileNumber(msg.from);
          if (prevCon.length === 0) {
            if (!user) {
              //to be moved up // re-arrangment required
              const tempUser = await client.get(`${msg.from}/user`);
              const langCode: Language = Number(
                await extractLanguage(msg.from)
              );
              if (!tempUser) {
                await bot.sendReplyButtons(
                  msg.from,
                  `${TEMPLATES[Language.English].language.text}\n\n${
                    TEMPLATES[Language.Urdu].language.text
                  }`,
                  {
                    [Language.English]: "English",
                    [Language.Urdu]: "اردو",
                  }
                );
                await client.setEx(`${msg.from}/user`, 3600, "new");
              } else if (tempUser == "new") {
                await detectLanguage(msg);
              } else if (await getKeyValueFromCacheUser(msg.from, "blkNo")) {
                await client.setEx(
                  `${msg.from}/user`,
                  3600,
                  `${tempUser}hNo=${msg.data.text};`
                );
                const user = await createUser({
                  name: (await getKeyValueFromCacheUser(msg.from, "name"))!,
                  mobile: msg.from,
                  block: (await getKeyValueFromCacheUser(msg.from, "blkNo"))!,
                  house: (await getKeyValueFromCacheUser(msg.from, "hNo"))!,
                  lang: langCode,
                });
                await bot.sendText(
                  msg.from,
                  TEMPLATES[langCode].registrationThanks.text(user.name)
                );
                await bot.sendReplyButtons(
                  msg.from,
                  TEMPLATES[langCode].service.text,
                  langCode == Language.English
                    ? {
                        [Service.Complaint]: "Register Complaint",
                        [Service.Tracking]: "Complaint Tracking",
                      }
                    : {
                        [Service.Complaint]: "شکایت درج کریں",
                        [Service.Tracking]: "شکایت کی ٹریکنگ",
                      }
                );
                await client.rPush(msg.from, "new");
              } else if (await getKeyValueFromCacheUser(msg.from, "name")) {
                let content = "";
                if (msg.type === "button_reply") {
                  content = msg.data.id;
                } else {
                  content = msg.data.text;
                }
                await client.setEx(
                  `${msg.from}/user`,
                  3600,
                  `${tempUser}blkNo=${content};`
                );
                await bot.sendText(
                  msg.from,
                  TEMPLATES[langCode].residentialHouse.text
                );
              } else if (await getKeyValueFromCacheUser(msg.from, "lang")) {
                await client.setEx(
                  `${msg.from}/user`,
                  3600,
                  `${tempUser}name=${msg.data.text};`
                );
                await bot.sendReplyButtons(
                  msg.from,
                  TEMPLATES[langCode].residentialBlock.text,
                  {
                    [Block.Block13]: await getBlockTitle(
                      Block.Block13,
                      langCode
                    ),
                    [Block.Block17]: await getBlockTitle(
                      Block.Block17,
                      langCode
                    ),
                    [Block.Block18]: await getBlockTitle(
                      Block.Block18,
                      langCode
                    ),
                  }
                );
              } else {
              }
            } else {
              await bot.sendReplyButtons(
                msg.from,
                TEMPLATES[user.lang].welcome.text(user.name),
                user.lang == Language.English
                  ? {
                      [Service.Complaint]: "Register Complaint",
                      [Service.Tracking]: "Complaint Tracking",
                    }
                  : {
                      [Service.Complaint]: "شکایت درج کریں",
                      [Service.Tracking]: "شکایت کی ٹریکنگ",
                    }
              );
              await client.rPush(msg.from, "new");
            }
          } else if (prevCon.length === 1 && prevCon[0] === "new") {
            await detectService(msg, Language.English);
          } else {
            let temp = [...prevCon.reverse()];
            switch (Number(temp.pop())) {
              case Service.Complaint:
                await detectComplaint(msg, temp, user!);
                break;
              case Service.Tracking:
                await trackComplaint(msg);
                break;

              default:
                break;
            }
          }
          // } else if (msg.type === "image") {
          //   await bot.sendText(msg.from, "Received your image!");
          //   const imageId = msg.data.id;
          //   console.log("image id:", imageId);
          //   const image = await getMediaDetails(imageId);
          //   console.log("image details", image);
          //   const { data: imageData, headers } = await getMediaBinary(image.url);
          //   console.log("image binary:", imageData);
        } else {
          await bot.sendText(
            msg.from,
            `${msg.type} message type is not supported, please reply with the text or buttons.`
          );
        }
      } catch (error) {
        console.log(error);
      }
    });
  } catch (err) {
    console.log(err);
  }
})();

async function detectLanguage(msg: Message) {
  let content = "";
  if (msg.type === "button_reply") {
    content = msg.data.id;
  } else {
    content = msg.data.text;
  }
  if (content != "0" && content != "1") {
    await bot.sendReplyButtons(
      msg.from,
      `${TEMPLATES[Language.English].language.errorText}\n\n${
        TEMPLATES[Language.Urdu].language.errorText
      }`,
      {
        [Language.English]: "English",
        [Language.Urdu]: "اردو",
      }
    );
  } else {
    await client.setEx(`${msg.from}/user`, 3600, `lang=${content};`);
    if (content == "0")
      await bot.sendText(msg.from, TEMPLATES[Language.English].name.text);
    else await bot.sendText(msg.from, TEMPLATES[Language.Urdu].name.text);
  }
}

async function extractLanguage(mobile: string) {
  const data = await client.get(`${mobile}/user`);
  const combination = data
    ?.split(";")
    .find((combination) => combination.split("=")[0] == "lang");
  return combination ? combination.split("=")[1] : undefined;
}

async function getKeyValueFromCacheUser(mobile: string, key: string) {
  const data = await client.get(`${mobile}/user`);
  const combination = data
    ?.split(";")
    .find((combination) => combination.split("=")[0] == key);
  return combination ? combination.split("=")[1] : undefined;
}

async function getMediaDetails(id: string) {
  const { data } = await api.get<MediaResponse>(`/${id}/`);
  console.log(data);
  return data;
}

async function getMediaBinary(mediaUrl: string) {
  const { data, headers } = await axios.get(mediaUrl);
  return { data, headers };
}

async function detectService(msg: Message, langCode: Language) {
  let content = "";
  if (msg.type === "button_reply") {
    content = msg.data.id;
  } else {
    content = msg.data.text;
  }
  if (content != "0" && content != "1") {
    await bot.sendReplyButtons(
      msg.from,
      TEMPLATES[langCode].service.text,
      langCode == Language.English
        ? {
            [Service.Complaint]: "Register Complaint",
            [Service.Tracking]: "Complaint Tracking",
          }
        : {
            [Service.Complaint]: "شکایت درج کریں",
            [Service.Tracking]: "شکایت کی ٹریکنگ",
          }
    );
  } else {
    await client.rPop(msg.from);
    await client.rPush(msg.from, content);
    if (content == "0")
      await bot.sendReplyButtons(msg.from, TEMPLATES[langCode].complaint.text, {
        [Complaint.Sewerage]: await getComplaintTitle(
          Complaint.Sewerage,
          langCode
        ),
        [Complaint.StreetLight]: await getComplaintTitle(
          Complaint.StreetLight,
          langCode
        ),
        [Complaint.Sanitation]: await getComplaintTitle(
          Complaint.Sanitation,
          langCode
        ),
      });
    if (content == "1")
      await bot.sendText(msg.from, TEMPLATES[langCode].tracking.text);
  }
}

async function detectComplaint(msg: Message, temp: string[], user: UserI) {
  let content = "";
  if (msg.type === "button_reply") {
    content = msg.data.id;
  } else {
    content = msg.data.text;
  }
  if (temp.length > 0) {
    temp.pop();
    await isAddressSame(msg, temp, user);
  } else if (content != "0" && content != "1" && content != "2") {
    await bot.sendReplyButtons(msg.from, TEMPLATES[user.lang].complaint.text, {
      [Complaint.Sewerage]: await getComplaintTitle(
        Complaint.Sewerage,
        user.lang
      ),
      [Complaint.StreetLight]: await getComplaintTitle(
        Complaint.StreetLight,
        user.lang
      ),
      [Complaint.Sanitation]: await getComplaintTitle(
        Complaint.Sanitation,
        user.lang
      ),
    });
  } else {
    await client.rPush(msg.from, content);
    await bot.sendReplyButtons(msg.from, TEMPLATES[user.lang].address.text, {
      0: `${user.house} ${await getBlockTitle(Number(user.block), user.lang)}`,
      1: user.lang == Language.English ? "Other" : "کچھ اور",
    });
  }
}

async function isAddressSame(msg: Message, temp: string[], user: UserI) {
  let content = "";
  if (msg.type === "button_reply") {
    content = msg.data.id;
  } else {
    content = msg.data.text;
  }
  if (temp.length > 0) {
    const isSame = temp.pop() == "0";
    isSame
      ? await noteDetails(msg, temp, user)
      : await noteBlockNumberAndAskHouseNumber(msg, temp, user);
  } else if (content != "0" && content != "1") {
    await bot.sendReplyButtons(msg.from, TEMPLATES[user.lang].address.text, {
      0: `${user.house} ${getBlockTitle(Number(user.block), user.lang)}`,
      1: user.lang == Language.English ? "Other" : "کچھ اور",
    });
  } else {
    await client.rPush(msg.from, content);
    if (content == "0") {
      await bot.sendText(msg.from, TEMPLATES[user.lang].details.text);
    } else {
      await bot.sendReplyButtons(msg.from, TEMPLATES[user.lang].block.text, {
        [Block.Block13]: await getBlockTitle(Block.Block13, user.lang),
        [Block.Block17]: await getBlockTitle(Block.Block17, user.lang),
        [Block.Block18]: await getBlockTitle(Block.Block18, user.lang),
      });
    }
  }
}

async function noteDetails(msg: Message, temp: string[], user: UserI) {
  const complaintNo = Number(await client.get("complaintNo"));
  if (msg.type === "button_reply") {
    await bot.sendText(msg.from, TEMPLATES[user.lang].details.text);
  } else {
    const tempComplaint = (await client.lRange(msg.from, 0, -1))!;
    const complaint = await createComplaint(
      tempComplaint[2] == "0"
        ? {
            id: complaintNo,
            type: tempComplaint[1] as unknown as Complaint,
            block: user.block,
            house: user.house,
            status: ComplaintStatus.Pending,
          }
        : {
            id: complaintNo,
            type: tempComplaint[1] as unknown as Complaint,
            block: tempComplaint[3],
            house: tempComplaint[4],
            status: ComplaintStatus.Pending,
          }
    );

    await client.set("complaintNo", complaintNo + 1);
    await client.del(msg.from);

    if (user.lang == Language.English)
      await bot.sendText(
        msg.from,
        TEMPLATES[Language.English].complaintThanks.text(
          user.name,
          complaint.type
        )
      );
    else
      await bot.sendText(
        msg.from,
        TEMPLATES[Language.Urdu].complaintThanks.text
      );

    await bot.sendText(msg.from, TEMPLATES[user.lang].complaintNumber.text);
    await bot.sendText(msg.from, `${complaint.id}`);
  }
}

async function noteBlockNumberAndAskHouseNumber(
  msg: Message,
  temp: string[],
  user: UserI
) {
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
    await noteHouseNumber(msg, temp, user);
  } else if (id != "0" && id != "1" && id != "2") {
    await bot.sendReplyButtons(msg.from, TEMPLATES[user.lang].block.text, {
      [Block.Block13]: await getBlockTitle(Block.Block13, user.lang),
      [Block.Block17]: await getBlockTitle(Block.Block17, user.lang),
      [Block.Block18]: await getBlockTitle(Block.Block18, user.lang),
    });
  } else {
    await client.rPush(msg.from, content);
    await bot.sendText(msg.from, TEMPLATES[user.lang].house.text);
  }
}

async function noteHouseNumber(msg: Message, temp: string[], user: UserI) {
  if (msg.type === "button_reply") {
    await bot.sendText(msg.from, TEMPLATES[user.lang].house.text);
  } else if (temp.length > 0) {
    await noteDetails(msg, temp, user);
  } else {
    await client.rPush(msg.from, msg.data.text);
    await bot.sendText(msg.from, TEMPLATES[user.lang].details.text);
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
    if (isNaN(Number(content))) {
      return await bot.sendText(
        msg.from,
        "Invalid complaint id, re-enter the correct id"
      );
    }
    // check if there is any complaint in the database and respond with the status
    const complaint = await getComplaintWithId(content);
    if (complaint == null) {
      return await bot.sendText(
        msg.from,
        "Invalid complaint id, re-enter the correct id"
      );
    }

    await bot.sendText(
      msg.from,
      `Your complaint status is ${
        complaint?.status == ComplaintStatus.Pending
          ? "pending"
          : complaint?.status == ComplaintStatus.InProgress
          ? "in progress"
          : complaint?.status == ComplaintStatus.Completed
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

// async function detectInquiry(msg: Message) {
//   let content = "";
//   if (msg.type === "button_reply") {
//     content = msg.data.id;
//   } else {
//     content = msg.data.text;
//   }
//   if (content != "0" && content != "1" && content != "2" && content != "3") {
//     await bot.sendReplyButtons(msg.from, NEW_TEMPLATES.inquiry.errorText!, {
//       0: "Birth Certificate",
//       1: "Death Certificate",
//       2: "Marriage Certificate",
//       3: "Divorce Certificate",
//     });
//   } else {
//     await client.del(msg.from);
//     await bot.sendText(
//       msg.from,
//       "For the issuance of birth certificate, your require theses documents:\n1: CNIC copy\n2: hospital certificate"
//     );
//     await bot.sendText(
//       msg.from,
//       "This chat has ended here, to start a new chat send any text message"
//     );
//   }
// }

const getBlockTitle = async (blockCode: Block, langCode: Language) => {
  if (langCode == Language.English) {
    return blockCode == Block.Block13
      ? "Block 13"
      : blockCode == Block.Block17
      ? "Block 17"
      : blockCode == Block.Block18
      ? "Block 18"
      : "undefined";
  } else {
    return blockCode == Block.Block13
      ? "بلاک ۱۳"
      : blockCode == Block.Block17
      ? "بلاک ۱۷"
      : blockCode == Block.Block18
      ? "بلاک ۱۸"
      : "undefined";
  }
};

const getComplaintTitle = async (
  complaintCode: Complaint,
  langCode: Language
) => {
  if (langCode == Language.English) {
    return complaintCode == Complaint.Sewerage
      ? "Sewerage"
      : complaintCode == Complaint.StreetLight
      ? "Street Light"
      : complaintCode == Complaint.Sanitation
      ? "Sanitation"
      : "undefined";
  } else {
    return complaintCode == Complaint.Sewerage
      ? "سیوریج"
      : complaintCode == Complaint.StreetLight
      ? "گلی کی روشنی"
      : complaintCode == Complaint.Sanitation
      ? "صفائی"
      : "undefined";
  }
};

// [Complaint.GarbageCollection]: "Garbage Collection",
// [Complaint.CleaningSweeping]: "Cleaning / Sweeping",
// [Complaint.SewerageOverflow]: "Sewerage Overflow",
// [Complaint.ManholeCoverMissing]: "Manhole Cover Missing",
// [Complaint.StreetLightNotWorking]: "Street Light Not Working",
// [Complaint.WaterLineLeakage]: "Water Line Leakage",
// [Complaint.WaterSupplySuspended]: "Water Supply Suspended",
// [Complaint.RoadRepair]: "Road Repair",
// [Complaint.Other]: "Other",

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
