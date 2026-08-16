//import type { Request, Response } from "express";
//import * as queries from "../db/queries";
//import { getAuth } from "@clerk/express";

//export async function syncUser(req: Request, res: Response) {
    /*try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { email, name, imageUrl } = req.body;

    if (!email || !name || !imageUrl) {
      return res.status(400).json({ error: "Email, name, and imageUrl are required" });
    }

    const user = await queries.upsertUser({
      id: userId,
      email,
      name,
      imageUrl,
    });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }*/

    //bu code rabbitin şeyi
    /*
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const { email, name, imageUrl } = body;

    const isNonBlankString = (value: unknown): value is string =>
      typeof value === "string" && value.trim().length > 0;

    if (
      !isNonBlankString(email) ||
      !isNonBlankString(name) ||
      !isNonBlankString(imageUrl)
    ) {
      return res
        .status(400)
        .json({ error: "Email, name, and imageUrl must be non-blank strings" });
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    let isValidImageUrl = false;
    try {
      const url = new URL(imageUrl);
      isValidImageUrl = url.protocol === "http:" || url.protocol === "https:";
    } catch {
      isValidImageUrl = false;
    }

    if (!isValidEmail || !isValidImageUrl) {
      return res
        .status(400)
        .json({ error: "Email or imageUrl has an invalid format" });
    }
}*/

import type { Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import * as queries from "../db/queries";


export async function syncUser(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    if (!email) {
      return res.status(400).json({ error: "Clerk user has no primary email address" });
    }

    const user = await queries.upsertUser({
      id: userId,
      email,
      name: clerkUser.fullName,
      imageUrl: clerkUser.imageUrl,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    return res.status(500).json({ error: "Failed to sync user" });
  }
}

