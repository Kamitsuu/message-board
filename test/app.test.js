import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../app.js";

async function startTestServer() {
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

test("GET /api/posts returns newest posts first", async (t) => {
  const { server, baseUrl } = await startTestServer();
  t.after(() => server.close());

  await fetch(`${baseUrl}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Ada", message: "First" }),
  });
  await new Promise((resolve) => setTimeout(resolve, 2));
  await fetch(`${baseUrl}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Lin", message: "Second" }),
  });

  const response = await fetch(`${baseUrl}/api/posts`);
  assert.equal(response.status, 200);
  const posts = await response.json();
  assert.deepEqual(posts.map((post) => post.message), ["Second", "First"]);
});

test("POST /api/posts validates required fields", async (t) => {
  const { server, baseUrl } = await startTestServer();
  t.after(() => server.close());

  const response = await fetch(`${baseUrl}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: " ", message: "" }),
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /required/i);
});
