# 🚀 How do you teach AI Engineering?

### Start small. Then go Agentic.

I’m a big believer in **Incremental & Iterative Learning**.
You don’t build a complex agentic system on Day 1.
You *sketch*, you *learn*, and *then* you architect.

To prove this, I built **PokéPals** as a teaching-grade example of how simple apps evolve into full AI systems.

---

## **Phase 1: The Sketch — Poke-Pals**

Start with the smallest artifact that teaches the domain.

A simple, static Next.js app.
No AI. No tools. Just UI, UX, and data fetching.
The goal: **learn the problem space without cognitive overload.**

� **Repo:** [https://github.com/donbr/poke-pals](https://github.com/donbr/poke-pals)
� **Demo:** [https://poke-pals.vercel.app/pokemon](https://poke-pals.vercel.app/pokemon)

---

## **Phase 2: The Agent — Poke-Pals Interactive**

Once the foundation was solid, the project evolved into a real **agentic system**.
Not a chatbot glued onto an app — but a proper cognitive architecture.

🧠 **Router vs Generator Modes**
The model decides when to be creative (stories, quizzes) and when to be precise (search filters, game hints).

🛡 **Safety Pipeline ("Defense in Depth")**
Regex filters + system prompts ensure kid-friendly content *before* the LLM sees input.

🧩 **Tool Contracts (Zod)**
The LLM must output *valid* JSON before the system will run a tool.

� **Repo:** [https://github.com/donbr/poke-pals-interactive](https://github.com/donbr/poke-pals-interactive)
� **Demo:** [https://poke-pals-interactive.vercel.app/](https://poke-pals-interactive.vercel.app/)

---

## **Teaching-Grade Documentation**

Because the goal is education, the repo includes:

📘 **Architecture Tour** — A guided, narrative walkthrough (7 Tour Stops)
📊 **Global Data Journey Diagram** — UI → API → Safety → LLM → Tools
🎓 **Full Slide Deck** — Built for onboarding new AI engineers

All of these live in `/architecture/docs` inside the repo.

If you're helping developers make the leap from traditional web apps → AI systems, this project is built to be read, remixed, and learned from.

---

### **The Principle**

**Start with something tiny.
Get it working.
Then push it one layer deeper.**

That’s how people learn AI Engineering — and how real systems are built.

#AIEngineering #AgenticAI #NextJS #OpenAI #Vercel #SoftwareArchitecture #LearnInPublic #TypeScript #RAG #LLMTools
