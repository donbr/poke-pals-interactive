# 🐾 PokéPals Interactive

A fun, kid-friendly Pokémon adventure app with AI-powered interactions, built with Next.js, React, and the Vercel AI SDK!

## 🎓 Built During the AI Engineer Onramp Bootcamp

This project was created as part of the [**AI Makerspace AI Engineer Onramp Bootcamp**](https://github.com/AI-Maker-Space) – where brave students embark on an exciting journey to master AI-assisted development, agentic coding, and modern software engineering practices.

**Who says you can't have a little fun along the way?** 🚀

This app showcases what happens when AI-assisted development meets creativity, demonstrating that learning can be both educational *and* delightful! Unlike its simpler sibling, this version adds **AI-powered features** including an interactive chat assistant (Professor Pine) and dynamic content generation.

---

## ✨ Features

### 🤖 AI-Powered Interactions
- 💬 **Professor Pine Chat**: Kid-safe AI assistant with content filtering
- 📖 **Story Generator**: Create imaginative Pokémon adventures
- 🧩 **Quiz Generator**: AI-generated quizzes about Pokémon
- 💡 **Fun Facts**: Discover interesting Pokémon trivia
- 🎨 **Game Hints**: Get helpful guidance for activities

### 🎮 Interactive Activities
- 🔍 **Guess That Pokémon**: Test your Pokémon knowledge
- 🎨 **Color Playground**: Creative drawing with AI prompts
- 🧩 **Pokémon Quiz**: Answer questions about your favorite creatures

### 🌟 Additional Features
- 🔎 **Pokémon Exploration**: Discover creatures by type using PokeAPI
- 🎨 **3 Fun Themes**: Candy, Space, and Ocean themes for different moods
- 📱 **Mobile-Friendly**: Designed for kids on tablets and phones
- 🌈 **Playful Animations**: Gentle, kid-friendly motion and delight
- ♿ **Accessible**: High contrast, clear typography, large touch targets
- 🧪 **Test-Driven Development**: Built with TDD practices using Vitest

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Environment Setup

1. Install dependencies:
```bash
npm install
```

2. Copy the example environment file:
```bash
cp .env.example .env.local
```

3. Edit `.env.local` and add your OpenAI API key:
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see your PokéPals come to life!

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 🏗️ Built With

- **[Next.js 16](https://nextjs.org)** - React framework with App Router
- **[React 19](https://react.dev)** - UI library
- **[TypeScript](https://www.typescriptlang.org)** - Type safety with strict mode
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first styling with OKLCH colors
- **[shadcn/ui](https://ui.shadcn.com)** - Beautiful, accessible components (Radix UI)
- **[Vercel AI SDK](https://sdk.vercel.ai)** - AI integration with streaming
- **[OpenAI gpt-5-nano](https://platform.openai.com)** - Language model for chat and content
- **[Vitest](https://vitest.dev)** - Testing framework with React Testing Library
- **[MSW](https://mswjs.io)** - API mocking for tests
- **[PokeAPI](https://pokeapi.co)** - Pokémon data
- **[Lucide React](https://lucide.dev)** - Icons
- **[React Hook Form](https://react-hook-form.com)** - Form validation with Zod

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## 🎨 Themes

PokéPals Interactive includes three delightful themes:

- 🍬 **Candy** (default): Bright pinks and bubblegum colors
- 🌌 **Space**: Dark purples and blues with cosmic vibes
- 🌊 **Ocean**: Teals and aquas with underwater effects

Switch themes using the theme switcher on any page! All themes use OKLCH color space for perceptually uniform colors.

## 🗂️ Project Structure

```
poke-pals-interactive/
├── app/                    # Next.js App Router pages
│   ├── api/llm/            # AI route handlers (7 endpoints)
│   │   ├── chat/           # Professor Pine chat with content filtering
│   │   ├── story/          # Story generation
│   │   ├── quiz/           # Quiz generation
│   │   ├── fun-fact/       # Fun fact generation
│   │   ├── game-hints/     # Game hint generation
│   │   ├── color-prompt/   # Color playground prompts
│   │   └── query-pokeapi/  # Natural language PokeAPI queries
│   ├── explore/            # Pokémon exploration page
│   ├── chat/               # Professor Pine chat interface
│   ├── games/              # Games hub
│   ├── stories/            # Story builder
│   ├── themes/             # Theme switcher
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles and theme variables
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── games/              # Game components
│   ├── navigation.tsx      # Responsive navigation
│   ├── professor-pine-chat.tsx  # Chat UI component
│   └── theme-provider.tsx  # Custom theme context
├── lib/                    # Utility functions
└── public/                 # Static assets
```

## 🔒 Content Safety

This app is designed for kids ages 6-10 with multiple safety layers:

- **AI Content Filtering**: Pre-filter and post-filter inappropriate content
- **Grade 2-4 Reading Level**: Age-appropriate language
- **Professor Pine Personality**: Encouraging, supportive, and kid-friendly
- **Response Limits**: Concise responses (~100 words)
- **Topic Redirection**: Scary/inappropriate topics redirected to positive ones
- **No Personal Data**: Never collects or shares personal information

## 🧪 Testing

Built with Test-Driven Development (TDD) practices:

- **Contract Tests**: Validate API endpoint behavior
- **Integration Tests**: Test component interactions and user journeys
- **Vitest + React Testing Library**: Modern testing stack
- **MSW**: Mock API responses for reliable tests
- **Red-Green-Refactor**: Write failing tests first, then implement

Run tests with `npm test` or `npm run test:watch` for TDD workflow.

## 🤝 Contributing

This is a learning project built during the AI Engineer Onramp Bootcamp. Feel free to fork it and make it your own!

## 📚 Learn More

### About Next.js & React
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)

### About AI Development
- [Vercel AI SDK Documentation](https://sdk.vercel.ai)
- [AI Makerspace](https://github.com/AI-Maker-Space)
- [Cursor AI IDE](https://cursor.com)

### About Testing
- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [MSW Documentation](https://mswjs.io)

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

**Important**: Set your `OPENAI_API_KEY` environment variable in the Vercel project settings.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🙏 Acknowledgments

A huge thank you to:

- **[PokeAPI](https://pokeapi.co/)** - For providing free, open access to Pokémon data. This project wouldn't exist without their incredible work making Pokémon information available to developers worldwide!
- **[Vercel](https://vercel.com)** - For the amazing AI SDK that makes building AI-powered apps delightful
- **[OpenAI](https://openai.com)** - For providing the language models powering Professor Pine
- **The Pokémon Company** - For creating the beloved franchise that brings joy to kids (and adults!) everywhere
- **[AI Makerspace](https://github.com/AI-Maker-Space)** - For fostering a learning environment where projects like this can flourish

## ⚖️ Legal Notice

This is an unofficial, non-commercial fan project created for educational purposes.

- **Not affiliated with** Nintendo, Game Freak, or The Pokémon Company
- **[PokeAPI](https://pokeapi.co/)** is a free, community-maintained resource not affiliated with official Pokémon organizations
- **Pokémon** names, sprites, and all related intellectual property belong to their respective owners
- The **[MIT License](LICENSE)** applies only to the original source code in this repository and does **not** grant any rights to Pokémon intellectual property
- **API Usage**: This app uses the OpenAI API - you are responsible for your own API costs and usage

Made with love for learning! 💜

---

**Made with 💜 by a proud peer supporter of the AI Engineer Onramp Bootcamp**

*Celebrating the brave students who are learning, building, and having fun along the way!*
