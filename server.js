import "dotenv/config";
import { createApp } from "./app.js";
import { SupabasePostStore } from "./store/postsStore.js";

const port = Number(process.env.PORT) || 3000;
const app = createApp(new SupabasePostStore());

app.listen(port, () => {
  console.log(`Message board running at http://localhost:${port}`);
});
