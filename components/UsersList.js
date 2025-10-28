class UsersList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  get users() {
    try {
      return JSON.parse(this.getAttribute("users") || "[]");
    } catch (e) {
      console.error("Invalid users data:", e);
      return [];
    }
  }

  set users(value) {
    this.setAttribute("users", JSON.stringify(value));
  }

  static get observedAttributes() {
    return ["users"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "users" && oldValue !== newValue) {
      this.renderList();
    }
  }

  removeUser(index) {
    const updatedUsers = this.users.filter((_, i) => i !== index);
    this.setAttribute("users", JSON.stringify(updatedUsers));
  }

  connectedCallback() {
    this.shadowRoot.addEventListener("click", (e) => {
      if (e.target.matches(".remove-btn")) {
        const index = parseInt(e.target.getAttribute("data-index"));
        this.removeUser(index);
      }
    });
    this.renderList();
  }

  renderList() {
    this.shadowRoot.innerHTML = `
     <style>
        .container {
          padding: 1rem;
        }
        .user-list {
          list-style: none;
          padding: 0;
        }
        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;
          margin: 0.5rem 0;
          background: #f5f5f5;
          border-radius: 7px;
        }
        .remove-btn {
          padding: 0.5rem 1rem;
          background: #ff4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .remove-btn:hover {
          background: #cc0000;
        }
        .cross-icon {
          font-size: 1.2rem;
          font-weight: bold;
          line-height: 1;
        }
          @media (max-width: 480px) {
          h1 {
            font-size: 1.5rem;
          }
            .container {
              padding: 0 1rem;
            }
              .remove-btn {
                padding: 0.4rem 0.5rem;
              }
            }
        }
      </style>
    <div class="container">
    <h1>Users List</h1>
    <ul class="user-list">
    ${this.users
      .map(
        (user, index) => `<li><p>${user}</p>
         <button class="remove-btn" data-index="${index}">
           <span class="cross-icon">×</span>
           Remove
         </button></li>`
      )
      .join("")}
    </ul>
    </div>`;
  }
}

customElements.define("users-list", UsersList);
