import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { InMemoryPostStore } from "./store/postsStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp(postStore = new InMemoryPostStore()) {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/api/posts", async (_req, res, next) => {
    try {
      res.json(await postStore.list());
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/posts", async (req, res, next) => {
    try {
      const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
      const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

      if (!name || !message) {
        return res.status(400).json({ error: "Name and message are required." });
      }

      if (name.length > 50) {
        return res.status(400).json({ error: "Name must be 50 characters or fewer." });
      }

      if (message.length > 1000) {
        return res.status(400).json({ error: "Message must be 1000 characters or fewer." });
      }

      const post = await postStore.create({ name, message });
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  });

  return app;
}
