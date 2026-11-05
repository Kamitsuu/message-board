const form = document.querySelector("#post-form");
const postsElement = document.querySelector("#posts");
const statusElement = document.querySelector("#form-status");
const submitButton = form.querySelector("button[type='submit']");

async function api(path, options) {
  const response = await fetch(path, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Request failed.");
  }

  return result;
}

async function loadPosts() {
  const posts = await api("/api/posts");
  postsElement.replaceChildren();

  if (posts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No messages yet. Be the first to post.";
    postsElement.append(empty);
    return;
  }

  for (const post of posts) {
    const article = document.createElement("article");
    article.className = "post";

    const header = document.createElement("div");
    header.className = "post-header";

    const name = document.createElement("span");
    name.className = "post-name";
    name.textContent = post.name;

    const time = document.createElement("time");
    time.dateTime = post.createdAt;
    time.textContent = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(post.createdAt));

    const message = document.createElement("p");
    message.className = "post-message";
    message.textContent = post.message;

    header.append(name, time);
    article.append(header, message);
    postsElement.append(article);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  statusElement.textContent = "Posting...";

  const formData = new FormData(form);
  const body = {
    name: formData.get("name"),
    message: formData.get("message"),
  };

  try {
    await api("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    form.reset();
    statusElement.textContent = "Posted.";
    await loadPosts();
  } catch (error) {
    statusElement.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

loadPosts().catch((error) => {
  statusElement.textContent = error.message;
});
