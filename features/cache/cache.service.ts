import { RedisClientType, createClient } from "redis";

// Create redis client for cashing
const client: RedisClientType = createClient();
client.connect();
client.on("error", (err: any) => console.log("Redis Client Error", err));

export default client;
