import { RedisClientType, createClient } from "redis";

// Create redis client for cashing
const client: RedisClientType = createClient({
  url: process.env.REDIS_URL,
});
client.connect();
client.on("error", (err: any) => console.log("Redis Client Error", err));

export default client;
