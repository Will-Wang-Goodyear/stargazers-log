const list = document.getElementById("repo-list");
const status = document.getElementById("status");

function createItem(event) {
  const item = document.createElement("li");

  const link = document.createElement("a");
  link.className = "repo-name";
  link.href = event.url;
  link.textContent = event.repo;
  link.rel = "noopener noreferrer";
  item.append(link);

  if (event.description) {
    const description = document.createElement("p");
    description.className = "repo-description";
    description.textContent = event.description;
    item.append(description);
  }

  const meta = document.createElement("div");
  meta.className = "repo-meta";

  const language = document.createElement("span");
  language.textContent = event.language ?? "Unknown";
  meta.append(language);

  const starred = document.createElement("span");
  starred.textContent = `Starred ${event.starredAt}`;
  meta.append(starred);

  item.append(meta);
  return item;
}

async function render() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const events = await response.json();
    list.replaceChildren(...events.map(createItem));
    status.textContent = `${events.length} starred repositories.`;
  } catch (error) {
    status.textContent = `Could not load starred repositories: ${error.message}`;
  }
}

render();
