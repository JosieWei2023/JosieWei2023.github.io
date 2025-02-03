// Define the OpenHeart web component
class OpenHeart extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.clicked = false;
  }

  static get observedAttributes() {
    return ["href", "emoji"];
  }

  async connectedCallback() {
    this.emoji = this.getAttribute("emoji") || "❤️";
    this.href = this.getAttribute("href");

    // Set up click handler
    this.addEventListener("click", this.handleClick);

    // Initial count fetch
    await this.getCount();

    // Initial render
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
  }

  async handleClick() {
    if (this.disabled) return;

    try {
      this.disabled = true;
      const response = await fetch(this.href, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.count = data.count;
        this.clicked = true;

        // Dispatch event for parent components
        this.dispatchEvent(
          new CustomEvent("open-heart", {
            bubbles: true,
            composed: true,
            detail: { count: this.count },
          })
        );
      }
    } catch (error) {
      console.error("Error updating count:", error);
    } finally {
      this.disabled = false;
      this.render();
    }
  }

  async getCount() {
    try {
      const response = await fetch(this.href);
      if (response.ok) {
        const data = await response.json();
        this.count = data.count;
        this.render();
      }
    } catch (error) {
      console.error("Error fetching count:", error);
    }
  }

  render() {
    this.textContent = this.emoji;
    if (this.count > 0) {
      this.setAttribute("count", this.count);
    } else {
      this.removeAttribute("count");
    }

    if (this.clicked) {
      this.setAttribute("clicked", "");
    }
  }
}

// Register the web component
customElements.define("open-heart", OpenHeart);
