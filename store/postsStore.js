import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export class InMemoryPostStore {
  constructor() {
    this.posts = [];
  }

  async list() {
    return [...this.posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async create({ name, message }) {
    const post = {
      id: randomUUID(),
      name,
      message,
      createdAt: new Date().toISOString(),
    };

    this.posts.push(post);
    return post;
  }
}

export class SupabasePostStore {
  constructor() {
    const url = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!url || !secretKey) {
      throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are required.");
    }

    this.client = createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async list() {
    const { data, error } = await this.client
      .from("posts")
      .select("id,name,message,created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((post) => ({
      id: post.id,
      name: post.name,
      message: post.message,
      createdAt: post.created_at,
    }));
  }

  async create({ name, message }) {
    const { data, error } = await this.client
      .from("posts")
      .insert({ name, message })
      .select("id,name,message,created_at")
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      message: data.message,
      createdAt: data.created_at,
    };
  }
}
