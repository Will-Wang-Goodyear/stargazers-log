const list = document.getElementById("repo-list");
const statusEl = document.getElementById("status");

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Reject javascript: and other non-navigational schemes coming from the data file.
function safeUrl(value) {
  try {
    const url = new URL(value, document.baseURI);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function createItem(event) {
  const item = document.createElement("li");

  const url = safeUrl(event.url);
  const name = document.createElement(url ? "a" : "span");
  name.className = "repo-name";
  name.textContent = event.repo || "Unknown repository";
  if (url) {
    name.href = url;
  }
  item.append(name);

  if (event.description) {
    const description = document.createElement("p");
    description.className = "repo-description";
    description.textContent = event.description;
    item.append(description);
  }

  const meta = document.createElement("div");
  meta.className = "repo-meta";

  const language = document.createElement("span");
  const languageLabel = document.createElement("span");
  languageLabel.className = "visually-hidden";
  languageLabel.textContent = "Language: ";
  language.append(languageLabel, event.language || "Unknown");
  meta.append(language);

  const starredAt = document.createElement("time");
  starredAt.textContent = event.starredAt || "an unknown date";
  if (ISO_DATE.test(event.starredAt ?? "")) {
    starredAt.dateTime = event.starredAt;
  }
  const starred = document.createElement("span");
  starred.append("Starred ", starredAt);
  meta.append(starred);

  item.append(meta);
  return item;
}

function countLabel(count) {
  if (count === 0) {
    return "No starred repositories yet.";
  }
  return `${count} starred ${count === 1 ? "repository" : "repositories"}.`;
}

async function render() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const events = await response.json();
    if (!Array.isArray(events)) {
      throw new TypeError("Expected events.json to contain an array");
    }

    list.replaceChildren(...events.map(createItem));
    statusEl.textContent = countLabel(events.length);
  } catch (error) {
    console.error(error);
    list.replaceChildren();
    statusEl.textContent = "Could not load starred repositories. Please try again later.";
  }
}

render();
