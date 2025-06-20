import express from "express";
import type { Router } from "express-serve-static-core";
import { client } from '../stream-client';
import { UserRequest } from "@stream-io/node-sdk";

const router: Router = express.Router();

router.post("/createUser", async (req: any, res: any) => {
  try {
    const { username, name, image } = req.body;

    if (!username || !name || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newUser: UserRequest = {
      id: username,
      role: "user",
      name,
      image,
    };

    await client.upsertUsers([newUser]); 

    const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
    const token = client.createToken(username, expiry);

    return res.status(200).json({ token, username, name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
