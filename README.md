# Public Message Board

A small public message board built with Node.js, Express, HTML, CSS, and browser JavaScript. The frontend and API run together on one Express server.

Posts are currently kept in server memory and reset when the server restarts. The API is isolated behind a post-store module so a Supabase implementation can replace the in-memory store later.

## Run locally

Requires Node.js 18 or newer.

```sh
npm install
npm start
```

Open `http://localhost:3000`.

For automatic server restarts while editing:

```sh
npm run dev
```

Use `PORT=8080 npm start` to run on another port.

## Test

```sh
npm test
```

To test the API manually while the server is running:

```sh
curl http://localhost:3000/api/posts

curl -X POST http://localhost:3000/api/posts \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","message":"Hello from the board"}'
```

Then call the GET endpoint again. Messages are returned newest first.

## Supabase preparation

The current store interface is `list()` and `create({ name, message })` in `store/postsStore.js`. A Supabase store can implement that same interface and be passed to `createApp(...)` instead of the in-memory implementation.

Keep Supabase service-role keys, database passwords, and other server secrets outside browser code and only use environment variables on the server. Browser JavaScript only calls `/api/posts`; it should never receive API credentials.
