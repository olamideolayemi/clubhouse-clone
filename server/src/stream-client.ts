import { StreamClient } from "@stream-io/node-sdk";

const apiKey = "8uchjuawduc4";
const apiSecret = "ukv9tqxj7x4bjcturs4dstza4hgx8vz33kubk92d53ghs2z4kegscn4v3kcpknf4";

export const client = new StreamClient(apiKey, apiSecret)