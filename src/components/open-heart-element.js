class OpenHeart extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.clicked = false;
    this.storageKey = "_open_heart";
    this.handleInteraction = this.handleInteraction.bind(this);
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  async connectedCallback() {
    this.emoji = this.getAttribute("emoji") || "❤️";
    this.href = this.getAttribute("href");
    this.tabIndex = 0;
    this.setAttribute("role", "button");
    this.setAttribute("aria-busy", "false");

    if (!this.href) {
      this.setAttribute("disabled", "");
      return;
    }

    if (this.hasReacted()) {
      this.setReacted();
    } else {
      this.addEventListener("click", this.handleInteraction);
      this.addEventListener("keydown", this.handleInteraction);
    }

    await this.getCount();
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleInteraction);
    this.removeEventListener("keydown", this.handleInteraction);
  }

  get reactionKey() {
    return `${this.emoji}@${encodeURIComponent(this.href)}`;
  }

  hasReacted() {
    try {
      return (localStorage.getItem(this.storageKey) || "")
        .split(",")
        .includes(this.reactionKey);
    } catch {
      return false;
    }
  }

  saveReaction() {
    try {
      const reactions = (localStorage.getItem(this.storageKey) || "")
        .split(",")
        .filter(Boolean);
      reactions.push(this.reactionKey);
      localStorage.setItem(this.storageKey, reactions.join(","));
    } catch {
      // The reaction still works when storage is unavailable.
    }
  }

  setReacted() {
    this.setAttribute("aria-pressed", "true");
    this.setAttribute("disabled", "");
    this.removeEventListener("click", this.handleInteraction);
    this.removeEventListener("keydown", this.handleInteraction);
  }

  async handleInteraction(event) {
    if (event instanceof KeyboardEvent) {
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
    }

    if (this.disabled || this.getAttribute("aria-busy") === "true") return;

    try {
      this.setAttribute("aria-busy", "true");
      await fetch(this.href, {
        method: "POST",
        body: this.emoji,
        mode: "no-cors",
      });

      this.count += 1;
      this.clicked = true;
      this.saveReaction();
      this.setReacted();
      this.dispatchEvent(new CustomEvent("open-heart", {
        bubbles: true,
        composed: true,
        detail: { count: this.count },
      }));
    } catch (error) {
      console.error("Error updating count:", error);
    } finally {
      this.setAttribute("aria-busy", "false");
      this.render();
    }
  }

  async getCount() {
    try {
      const response = await fetch(this.href);
      if (response.ok) {
        const data = await response.json();
        this.count = Number(data[this.emoji] || 0);
      }
    } catch (error) {
      console.error("Error fetching count:", error);
    }
  }

  render() {
    this.textContent = this.emoji;
    this.setAttribute("count", String(this.count));

    if (this.clicked) {
      this.setAttribute("clicked", "");
    }
  }
}

// Register the web component once, including during development hot reloads.
if (!customElements.get("open-heart")) {
  customElements.define("open-heart", OpenHeart);
}
