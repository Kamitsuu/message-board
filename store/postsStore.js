import { randomUUID } from "node:crypto";

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
