import { Redis } from "ioredis";

const redis = new Redis({
	host: process.env.REDIS_URL || "127.0.0.1",
	port: parseInt(process.env.REDIS_PORT || "6379"),
});

export default redis;
