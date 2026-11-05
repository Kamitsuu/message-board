# Public Message Board

A small public message board built with Node.js, Express, HTML, CSS, and browser JavaScript. The frontend and API run together on one Express server.

Posts are stored in the Supabase `posts` table. The Express server uses a server-only Supabase client through the post-store module; browser JavaScript never receives or stores Supabase credentials.

## Run locally

Requires Node.js 18 or newer.

```sh
npm install
cp .env.example .env
```

Set `SUPABASE_URL` and the server-only `SUPABASE_SECRET_KEY` in `.env`, then run:

```sh
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

## Supabase security

The migration enables RLS on `public.posts` and intentionally adds no public policies. The Express server accesses Supabase with the secret key because the browser is never given database credentials.

Never add `SUPABASE_SECRET_KEY`, a service-role key, database passwords, or tokens to browser JavaScript or `.env` files named for the browser (such as `NEXT_PUBLIC_*`).

## Test without losing existing data

Unit tests use the in-memory store by default, so they do not read or write Supabase data:

```sh
npm test
```

The running message board writes real posts to Supabase, so manual POST requests add data rather than replacing it. Use a unique test name/message and remove only that test row when necessary. For example, delete a row by its ID in the Supabase SQL editor:

```sql
delete from public.posts
where name = 'YOUR_TEST_NAME'
and message = 'YOUR_TEST_MESSAGE';
```

Do not use table truncation or migration reset commands when existing data must be preserved.
