# 🎓 PokéPals — Unified Architecture Tour for Students

*“From Button Click → AI → Tools → Response”*

This is the official **guided walkthrough** of how the PokéPals AI-powered web app works from end to end.
It is structured into **7 tour stops**, each one answering a single, critical question.

---

# 🧭 **Tour Stop 1 — The Big Picture (Global Data Journey)**

**Question:** *What actually happens when a user interacts with the PokéPals app?*

```
User (Browser)
   ↓
UI Components (Next.js / React)
   ↓
API Route (/api/llm/*)
   ↓
Safety Pipeline (filters + system prompt)
   ↓
LLM Orchestrator (GPT-5-nano)
   ↓
Tool Execution (search, quiz, story, hints)
   ↓
External Services (OpenAI, PokeAPI)
   ↓
Return Value → Streamed or JSON → UI Update
```

**Student takeaway:**
You now know the **top-level shape** of the entire application.

---

# 🎨 **Tour Stop 2 — The Presentation Layer**

**Question:** *How does the UI interact with the backend?*

The UI is built using:

* Next.js pages (server)
* Client components (interactive UI)
* Feature components (e.g., chat box, quiz, explorer)
* Tailwind + components for styling

👉 *The UI never holds API keys.*
👉 *The UI only talks to the server via safe endpoints.*

**Why this matters:**
It enforces **security** and teaches you how production systems handle sensitive operations.

---

# 🏗️ **Tour Stop 3 — Business Logic Layer (The Server)**

**Question:** *Where do AI calls happen?*

On the server.

* Each endpoint (`/api/llm/chat`, `/story`, `/quiz`, `/search`, etc.) performs:

  * Input parsing
  * Validation (via Zod schemas)
  * Safety guards
  * OpenAI SDK calls
  * Tool logic when needed

This is where the AI is orchestrated.

**Student takeaway:**
Server endpoints act as the “controller” between UI and AI.

---

# 🔐 **Tour Stop 4 — The Safety Pipeline**

**Question:** *How do we prevent unsafe prompts from reaching the LLM?*

Your code implements a **Safety Pipeline**:

```
User Input
   ↓
Regex Pre-Filter (blocks disallowed phrases)
   ↓
If Blocked → Friendly Safe Response
   ↓
If Allowed → System Prompt Injection
   ↓
OpenAI → Streaming or JSON
```

This maps exactly to your real `chat/route.ts`.

**Student takeaway:**
Every production-quality AI app needs a **safety chain** before LLM inference.

---

# 🧠 **Tour Stop 5 — Agentic Thinking & Orchestrator Logic**

**Question:** *How does the LLM decide what to do?*

The Orchestrator LLM behaves like the “brain”:

### **Generator Mode**

Used for:

* Chat
* Stories
* Quiz creation

The LLM **creates** content.

### **Router Mode**

Used for:

* Pokémon search
* Type filtering
* Hint generation

The LLM **decides which tool to call**.

---

# 🌳 **Tour Stop 6 — Decision Tree (How AI Decides)**

**Question:** *How does the system choose the right behavior for the user request?*

```
                 ┌──────────── Chat? ────────────→ Chat Tool
User Message ────┤
                 ├──── Story-like? ─────────────→ Story Tool
                 │
                 ├──── Search intent? ─────────→ Search Tool
                 │
                 ├──── Quiz request? ──────────→ Quiz Tool
                 │
                 └──── Safety Problem? ────────→ Safe Fallback
```

**What students learn:**
This is **exactly** how LangGraph routers work.
This architecture *prepares you* to learn agent frameworks later.

---

# 🧩 **Tour Stop 7 — Tool Contracts (LLM ↔ Function Interface)**

**Question:** *How does the LLM pass structured data to tools?*

Tool calls follow a strict contract:

```
User Intent
   ↓
LLM Router
   ↓
Input Schema (Zod)
   ↓
Validation
   ↓
Tool Execution (API calls, logic)
   ↓
Output Object
   ↓
LLM → Formatted Response to the User
```

**Concrete example:**

```
User: "Show me all small fire Pokémon."

Router Output:
{
  "types": ["fire"],
  "size": "small"
}

Tool Execution:
searchPokemon({ types:["fire"], size:"small" })

LLM Rendered Output:
"Here are 3 small fire Pokémon you might like..."
```

**Student takeaway:**
Tools allow LLMs to act as *controllers*, not just text generators.

---

# 📦 **Bonus Stop — Memory Layer (Future)**

This app will later integrate:

* **Vector memory (RAG)**
* **Graph memory (world or relationship memory)**
* **Event Log (Durable Execution)**

Students learn how small apps evolve into **enterprise-grade agentic systems**.

---

# 🧠 **Instructor Mode (Optional Supplemental Notes)**

Here are additional bullet points instructors can share:

* This architecture maps directly to **OpenAI Subagents**, **Claude Skills**, and **LangGraph Node Pipelines**.
* The app demonstrates the **entire lifecycle** of AI requests.
* Students can modify **any layer independently** (UI, logic, tools, memory, safety).
* It's a perfect starter template for **AI apps, games, copilots, and learning tools**.
