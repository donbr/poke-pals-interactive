# Architecture Diagrams

## Overview

PokePals Interactive is a Next.js 16 web application built with TypeScript and React 19, designed as a kid-friendly Pokemon exploration platform. The architecture follows a modern JAMstack pattern with Server-Side Rendering (SSR), API Routes, and AI-powered features using OpenAI's GPT models. The application integrates with the external PokeAPI for Pokemon data and implements a custom theming system with multiple visual themes (candy, space, ocean).

**Key Technologies:**
- **Framework:** Next.js 16.0.3 with App Router
- **UI:** React 19.2.0, Radix UI components, Tailwind CSS 4.1.9
- **AI Integration:** Vercel AI SDK (@ai-sdk/openai, @ai-sdk/react)
- **External API:** PokeAPI (https://pokeapi.co)
- **Styling:** Tailwind CSS with custom theming, tailwindcss-animate
- **Type Safety:** TypeScript with Zod schema validation

## System Architecture

### Description

The application follows a three-tier layered architecture:

1. **Presentation Layer**: Client-side React components with Server Components and Client Components
2. **Business Logic Layer**: Next.js API Routes handling AI integration, data transformation, and orchestration
3. **Data/Infrastructure Layer**: External API integrations (PokeAPI, OpenAI) and client-side state management

```mermaid
graph TB
    subgraph "Presentation Layer (Client)"
        UI[React Components]
        Pages[Next.js Pages]
        ClientComp[Client Components]
        ServerComp[Server Components]
    end

    subgraph "Business Logic Layer (API Routes)"
        ChatAPI["/api/llm/chat"]
        QuizAPI["/api/llm/quiz"]
        StoryAPI["/api/llm/story"]
        QueryAPI["/api/llm/query-pokeapi"]
        HintsAPI["/api/llm/game-hints"]
        ColorAPI["/api/llm/color-prompt"]
        FunFactAPI["/api/llm/fun-fact"]
    end

    subgraph "Data/Infrastructure Layer"
        PokeAPI[PokeAPI REST API]
        OpenAI[OpenAI GPT-5-nano]
        LocalStorage[Browser LocalStorage]
    end

    UI --> Pages
    Pages --> ClientComp
    Pages --> ServerComp

    ClientComp --> ChatAPI
    ClientComp --> QuizAPI
    ClientComp --> StoryAPI
    ClientComp --> QueryAPI
    ClientComp --> HintsAPI
    ClientComp --> ColorAPI
    ClientComp --> FunFactAPI

    ChatAPI --> OpenAI
    QuizAPI --> OpenAI
    StoryAPI --> OpenAI
    QueryAPI --> OpenAI
    HintsAPI --> OpenAI
    ColorAPI --> OpenAI
    FunFactAPI --> OpenAI

    ClientComp --> PokeAPI
    ClientComp --> LocalStorage

    style UI fill:#ff6ec7,stroke:#333,color:#fff
    style Pages fill:#ff6ec7,stroke:#333,color:#fff
    style ClientComp fill:#ff6ec7,stroke:#333,color:#fff
    style ChatAPI fill:#4ecdc4,stroke:#333
    style QuizAPI fill:#4ecdc4,stroke:#333
    style StoryAPI fill:#4ecdc4,stroke:#333
    style PokeAPI fill:#95e1d3,stroke:#333
    style OpenAI fill:#95e1d3,stroke:#333
```

## Component Relationships

### Description

The component hierarchy demonstrates a clear separation between layout components, feature components, and UI primitives. The PageWrapper provides consistent layout structure, while feature components (ProfessorPineChat, PokemonExplorer, GamesHub, StoryBuilder) encapsulate specific functionality. The application uses both Server Components (pages, layout) and Client Components (interactive features).

```mermaid
graph LR
    subgraph "Root Layout"
        RootLayout[layout.tsx]
        ThemeProvider[ThemeProvider]
        Analytics[Vercel Analytics]
    end

    subgraph "Pages (Server Components)"
        HomePage[page.tsx /]
        ChatPage[chat/page.tsx]
        ExplorePage[explore/page.tsx]
        GamesPage[games/page.tsx]
        StoriesPage[stories/page.tsx]
        ThemesPage[themes/page.tsx]
    end

    subgraph "Layout Components"
        PageWrapper[PageWrapper]
        Navigation[Navigation]
        Footer[Footer]
    end

    subgraph "Feature Components"
        HomeHero[HomeHero]
        QuickActions[QuickActions]
        FeaturedPokemon[FeaturedPokemon]
        ProfessorPineChat[ProfessorPineChat]
        PokemonExplorer[PokemonExplorer]
        GamesHub[GamesHub]
        StoryBuilder[StoryBuilder]
        ThemeSwitcher[ThemeSwitcher]
    end

    subgraph "Sub-Components"
        PokemonGrid[PokemonGrid]
        PokemonDetailModal[PokemonDetailModal]
        TypeFilter[TypeFilter]
        GuessGame[GuessGame]
        QuizGame[QuizGame]
        ColorPlayground[ColorPlayground]
    end

    subgraph "UI Primitives"
        Button[Button]
        Card[Card]
        Input[Input]
        Dialog[Dialog]
        Tabs[Tabs]
    end

    RootLayout --> ThemeProvider
    RootLayout --> Analytics
    ThemeProvider --> HomePage
    ThemeProvider --> ChatPage
    ThemeProvider --> ExplorePage

    HomePage --> PageWrapper
    ChatPage --> PageWrapper
    ExplorePage --> PageWrapper

    PageWrapper --> Navigation
    PageWrapper --> Footer

    HomePage --> HomeHero
    HomePage --> QuickActions
    HomePage --> FeaturedPokemon

    ChatPage --> ProfessorPineChat
    ExplorePage --> PokemonExplorer
    GamesPage --> GamesHub
    StoriesPage --> StoryBuilder
    ThemesPage --> ThemeSwitcher

    PokemonExplorer --> PokemonGrid
    PokemonExplorer --> TypeFilter
    PokemonGrid --> PokemonDetailModal

    GamesHub --> GuessGame
    GamesHub --> QuizGame
    GamesHub --> ColorPlayground

    ProfessorPineChat --> Button
    ProfessorPineChat --> Input
    ProfessorPineChat --> Card

    style RootLayout fill:#ffd93d,stroke:#333
    style ThemeProvider fill:#ffd93d,stroke:#333
    style PageWrapper fill:#a8e6cf,stroke:#333
    style ProfessorPineChat fill:#ff6ec7,stroke:#333
    style PokemonExplorer fill:#ff6ec7,stroke:#333
    style GamesHub fill:#ff6ec7,stroke:#333
```

## API Route Architecture

### Description

The API layer is organized around AI-powered features, with each route handling specific LLM interactions. All routes use OpenAI's GPT-5-nano model through the Vercel AI SDK. Routes employ either streaming responses (chat) or structured object generation (quiz, story, hints) using Zod schemas for type safety.

```mermaid
graph TD
    subgraph "Client Components"
        ProfChat[ProfessorPineChat]
        PokExplorer[PokemonExplorer]
        Games[Game Components]
        Story[StoryBuilder]
    end

    subgraph "API Routes - /app/api/llm/"
        ChatRoute[chat/route.ts<br/>POST - Streaming Chat]
        QuizRoute[quiz/route.ts<br/>POST - Generate Quiz Questions]
        StoryRoute[story/route.ts<br/>POST - Generate Story Parts]
        QueryRoute[query-pokeapi/route.ts<br/>POST - Parse Natural Language]
        HintsRoute[game-hints/route.ts<br/>POST - Generate Game Hints]
        ColorRoute[color-prompt/route.ts<br/>POST - Generate Art Prompts]
        FactRoute[fun-fact/route.ts<br/>POST - Generate Fun Facts]
    end

    subgraph "AI SDK Functions"
        StreamText[streamText]
        GenObject[generateObject]
    end

    subgraph "External Services"
        OpenAI[OpenAI GPT-5-nano]
    end

    ProfChat -->|useChat hook| ChatRoute
    PokExplorer -->|fetch| QueryRoute
    Games -->|fetch| QuizRoute
    Games -->|fetch| HintsRoute
    Games -->|fetch| ColorRoute
    Story -->|fetch| StoryRoute

    ChatRoute -->|DefaultChatTransport| StreamText
    QuizRoute --> GenObject
    StoryRoute --> GenObject
    QueryRoute --> GenObject
    HintsRoute --> GenObject
    ColorRoute --> GenObject
    FactRoute --> GenObject

    StreamText --> OpenAI
    GenObject --> OpenAI

    style ChatRoute fill:#4ecdc4,stroke:#333
    style QuizRoute fill:#4ecdc4,stroke:#333
    style StoryRoute fill:#4ecdc4,stroke:#333
    style QueryRoute fill:#4ecdc4,stroke:#333
    style OpenAI fill:#95e1d3,stroke:#333
```

## Data Flow

### Description

The application implements multiple data flow patterns:

1. **Pokemon Data Flow**: Direct client-to-PokeAPI requests with client-side caching and pagination
2. **AI Chat Flow**: Streaming responses from OpenAI via Server-Side API route
3. **AI Generation Flow**: Structured object generation with Zod schema validation
4. **Theme Management**: Client-side state with localStorage persistence

```mermaid
flowchart LR
    subgraph "User Interactions"
        UserInput[User Input/Action]
        UserView[User View/Display]
    end

    subgraph "Client Layer"
        Component[React Component]
        State[React State/Hooks]
        Cache[Client Cache]
    end

    subgraph "API Layer"
        APIRoute[API Route Handler]
        Validation[Zod Schema Validation]
        AIPrompt[AI Prompt Construction]
    end

    subgraph "External Services"
        PokeAPI[PokeAPI<br/>Pokemon Data]
        OpenAI[OpenAI<br/>GPT-5-nano]
    end

    subgraph "Response Processing"
        Transform[Data Transformation]
        Format[Format for UI]
    end

    UserInput --> Component
    Component --> State

    State -->|Direct Fetch| PokeAPI
    State -->|POST Request| APIRoute

    APIRoute --> Validation
    Validation --> AIPrompt
    AIPrompt --> OpenAI

    PokeAPI --> Cache
    OpenAI --> Transform

    Cache --> Format
    Transform --> Format

    Format --> State
    State --> Component
    Component --> UserView

    style UserInput fill:#ffd93d,stroke:#333
    style Component fill:#ff6ec7,stroke:#333
    style APIRoute fill:#4ecdc4,stroke:#333
    style OpenAI fill:#95e1d3,stroke:#333
    style PokeAPI fill:#95e1d3,stroke:#333
```

## Module Dependencies

### Description

The codebase uses a modular structure with clear dependency patterns. The @/ alias maps to the project root, enabling clean imports. UI primitives from /components/ui are consumed by feature components, which are then composed into pages. All TypeScript files maintain strict type safety with interface definitions.

```mermaid
graph TD
    subgraph "App Directory Structure"
        AppPages["/app - Pages & Routing"]
        APIRoutes["/app/api/llm - API Routes"]
    end

    subgraph "Components Directory"
        UIComponents["/components/ui - Primitives"]
        FeatureComponents["/components - Features"]
        GameComponents["/components/games - Game Features"]
    end

    subgraph "Utilities & Configuration"
        LibUtils["/lib/utils.ts"]
        NextConfig[next.config.ts]
        TailwindConfig[globals.css]
    end

    subgraph "External Dependencies"
        NextJS[next]
        React[react]
        AISDK["@ai-sdk/react, @ai-sdk/openai"]
        RadixUI["@radix-ui/*"]
        TailwindCSS[tailwindcss]
        Zod[zod]
    end

    AppPages --> FeatureComponents
    AppPages --> UIComponents
    AppPages --> LibUtils

    APIRoutes --> AISDK
    APIRoutes --> Zod

    FeatureComponents --> UIComponents
    FeatureComponents --> LibUtils
    FeatureComponents --> AISDK

    GameComponents --> UIComponents
    GameComponents --> LibUtils

    UIComponents --> RadixUI
    UIComponents --> LibUtils

    LibUtils --> TailwindCSS

    AppPages --> NextJS
    AppPages --> React
    FeatureComponents --> React

    NextConfig --> NextJS
    TailwindConfig --> TailwindCSS

    style AppPages fill:#ffd93d,stroke:#333
    style FeatureComponents fill:#ff6ec7,stroke:#333
    style UIComponents fill:#a8e6cf,stroke:#333
    style AISDK fill:#95e1d3,stroke:#333
```

## Theming Architecture

### Description

The application implements a custom theming system using React Context and CSS custom properties. Three themes (candy, space, ocean) are available, with theme state persisted in localStorage. The ThemeProvider wraps the entire application and manages theme switching through CSS class application.

```mermaid
graph TB
    subgraph "Theme System"
        ThemeContext[ThemeContext<br/>Context API]
        ThemeProvider[ThemeProvider<br/>State Management]
        ThemeHook[useTheme Hook<br/>Consumer Hook]
    end

    subgraph "Theme Storage"
        LocalStorage[localStorage<br/>'pokepals-theme']
        DOMClasses[document.documentElement<br/>CSS Classes]
    end

    subgraph "Theme Variants"
        CandyTheme[Candy Theme<br/>Default]
        SpaceTheme[Space Theme<br/>.theme-space]
        OceanTheme[Ocean Theme<br/>.theme-ocean]
    end

    subgraph "CSS System"
        GlobalCSS[globals.css<br/>Theme Variables]
        TailwindCSS[Tailwind Classes<br/>Dynamic Styling]
    end

    subgraph "Components Using Theme"
        ThemeSwitcher[ThemeSwitcher<br/>Theme Selection UI]
        AllComponents[All App Components<br/>Theme-aware Styling]
    end

    ThemeProvider --> ThemeContext
    ThemeContext --> ThemeHook

    ThemeProvider --> LocalStorage
    ThemeProvider --> DOMClasses

    DOMClasses --> CandyTheme
    DOMClasses --> SpaceTheme
    DOMClasses --> OceanTheme

    CandyTheme --> GlobalCSS
    SpaceTheme --> GlobalCSS
    OceanTheme --> GlobalCSS

    GlobalCSS --> TailwindCSS

    ThemeHook --> ThemeSwitcher
    TailwindCSS --> AllComponents

    style ThemeProvider fill:#ffd93d,stroke:#333
    style ThemeContext fill:#a8e6cf,stroke:#333
    style GlobalCSS fill:#4ecdc4,stroke:#333
```

## AI Integration Architecture

### Description

All AI features use the Vercel AI SDK with OpenAI's GPT-5-nano model. The architecture separates concerns between streaming responses (chat) and structured generation (games, stories). Each API route implements specific prompt engineering and safety filters for kid-friendly content.

```mermaid
graph TB
    subgraph "AI-Powered Features"
        Chat[Professor Pine Chat<br/>Conversational AI]
        NLSearch[Natural Language Search<br/>Query Understanding]
        Quiz[Quiz Generation<br/>Structured Output]
        Story[Story Builder<br/>Structured Output]
        Hints[Game Hints<br/>Structured Output]
        Color[Color Prompts<br/>Structured Output]
        Facts[Fun Facts<br/>Structured Output]
    end

    subgraph "AI SDK Integration"
        StreamText["streamText()<br/>Streaming Responses"]
        GenObject["generateObject()<br/>Zod Schema Validation"]
        UIStream["toUIMessageStreamResponse()<br/>React Hook Compatible"]
    end

    subgraph "Schema Definitions"
        QuizSchema[quizSchema<br/>Questions Array]
        StorySchema[storyResponseSchema<br/>Text + Choices]
        HintsSchema[hintsSchema<br/>3 Hints Array]
        SearchSchema[searchFiltersSchema<br/>Types + IDs]
    end

    subgraph "Prompt Engineering"
        SystemPrompts[System Prompts<br/>Role Definition]
        SafetyFilters[Content Safety<br/>Kid-Friendly Rules]
        Fallbacks[Error Fallbacks<br/>Default Responses]
    end

    subgraph "OpenAI Service"
        GPT5Nano[GPT-5-nano Model<br/>Fast, Cost-Effective]
    end

    Chat --> StreamText
    NLSearch --> GenObject
    Quiz --> GenObject
    Story --> GenObject
    Hints --> GenObject
    Color --> GenObject
    Facts --> GenObject

    StreamText --> UIStream
    StreamText --> GPT5Nano
    GenObject --> GPT5Nano

    GenObject --> QuizSchema
    GenObject --> StorySchema
    GenObject --> HintsSchema
    GenObject --> SearchSchema

    Chat --> SystemPrompts
    Chat --> SafetyFilters
    Quiz --> SystemPrompts
    Story --> SystemPrompts

    Chat --> Fallbacks
    Quiz --> Fallbacks
    Story --> Fallbacks

    style Chat fill:#ff6ec7,stroke:#333,color:#fff
    style StreamText fill:#4ecdc4,stroke:#333
    style GenObject fill:#4ecdc4,stroke:#333
    style GPT5Nano fill:#95e1d3,stroke:#333
```

## File Organization

### Description

The project follows Next.js 16 App Router conventions with clear separation between server and client code. The /app directory contains pages and API routes, /components holds all UI components, and /lib contains utilities. Configuration files are at the root level.

```mermaid
graph LR
    Root["Project Root"]

    subgraph "App Directory - /app"
        AppLayout[layout.tsx<br/>Root Layout]
        AppPage[page.tsx<br/>Home Page]
        AppGlobals[globals.css<br/>Global Styles]

        ChatDir["/chat"]
        ExploreDir["/explore"]
        GamesDir["/games"]
        StoriesDir["/stories"]
        ThemesDir["/themes"]
        APIDir["/api"]
    end

    subgraph "Components - /components"
        UIDir["/ui - Primitives"]
        GamesComp["/games - Game Components"]
        FeatureComp[Feature Components]
    end

    subgraph "Library - /lib"
        Utils[utils.ts<br/>Helper Functions]
    end

    subgraph "Configuration Files"
        NextConf[next.config.ts]
        TSConf[tsconfig.json]
        PkgJSON[package.json]
        TailConf[postcss.config.mjs]
        CompJSON[components.json]
    end

    subgraph "API Routes - /app/api/llm"
        ChatAPI[chat/route.ts]
        QuizAPI[quiz/route.ts]
        StoryAPI[story/route.ts]
        QueryAPI[query-pokeapi/route.ts]
        HintsAPI[game-hints/route.ts]
        ColorAPI[color-prompt/route.ts]
        FactAPI[fun-fact/route.ts]
    end

    Root --> AppLayout
    Root --> AppPage
    Root --> NextConf
    Root --> TSConf
    Root --> PkgJSON

    AppLayout --> ChatDir
    AppLayout --> ExploreDir
    AppLayout --> GamesDir
    AppLayout --> StoriesDir
    AppLayout --> ThemesDir

    AppLayout --> APIDir
    APIDir --> ChatAPI
    APIDir --> QuizAPI
    APIDir --> StoryAPI
    APIDir --> QueryAPI
    APIDir --> HintsAPI
    APIDir --> ColorAPI
    APIDir --> FactAPI

    Root --> FeatureComp
    Root --> UIDir
    Root --> GamesComp
    Root --> Utils

    style Root fill:#ffd93d,stroke:#333
    style AppLayout fill:#a8e6cf,stroke:#333
    style FeatureComp fill:#ff6ec7,stroke:#333
    style ChatAPI fill:#4ecdc4,stroke:#333
```

## Key Files Reference

### Pages & Routing
- `app/layout.tsx` - Root layout with ThemeProvider
- `app/page.tsx` - Home page composition
- `app/chat/page.tsx` - Chat interface page
- `app/explore/page.tsx` - Pokemon explorer page
- `app/games/page.tsx` - Games hub page
- `app/stories/page.tsx` - Story builder page
- `app/themes/page.tsx` - Theme switcher page

### API Routes
- `app/api/llm/chat/route.ts` - Streaming chat with Professor Pine
- `app/api/llm/quiz/route.ts` - Quiz question generation
- `app/api/llm/story/route.ts` - Interactive story generation
- `app/api/llm/query-pokeapi/route.ts` - Natural language Pokemon search
- `app/api/llm/game-hints/route.ts` - Guessing game hint generation
- `app/api/llm/color-prompt/route.ts` - Art prompt generation
- `app/api/llm/fun-fact/route.ts` - Fun fact generation

### Feature Components
- `components/professor-pine-chat.tsx` - AI chat interface (lines 1-198)
- `components/pokemon-explorer.tsx` - Pokemon browsing/search (lines 1-123)
- `components/pokemon-grid.tsx` - Pokemon card grid with PokeAPI integration (lines 1-160)
- `components/games-hub.tsx` - Game selection hub (lines 1-70)
- `components/story-builder.tsx` - Interactive story builder (lines 1-206)
- `components/theme-provider.tsx` - Theme context provider (lines 1-47)
- `components/theme-switcher.tsx` - Theme selection UI
- `components/home-hero.tsx` - Homepage hero section
- `components/quick-actions.tsx` - Homepage quick navigation
- `components/featured-pokemon.tsx` - Featured Pokemon showcase

### Game Components
- `components/games/guess-game.tsx` - "Who's That Creature" game (lines 1-219)
- `components/games/quiz-game.tsx` - Quiz game component
- `components/games/color-playground.tsx` - Art prompt game

### Layout Components
- `components/page-wrapper.tsx` - Consistent page layout wrapper
- `components/navigation.tsx` - Navigation component
- `components/footer.tsx` - Footer component

### Supporting Components
- `components/pokemon-detail-modal.tsx` - Pokemon detail modal
- `components/type-filter.tsx` - Pokemon type filter

### UI Primitives
- `components/ui/button.tsx` - Button component
- `components/ui/card.tsx` - Card component
- `components/ui/input.tsx` - Input component
- `components/ui/dialog.tsx` - Dialog component
- `components/ui/tabs.tsx` - Tabs component

### Configuration & Utils
- `lib/utils.ts` - Utility functions (cn helper)
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies
- `app/globals.css` - Global styles and theme variables

## Architecture Patterns

### 1. Server Components vs Client Components
- **Server Components**: All page files (page.tsx) for initial SSR
- **Client Components**: Interactive features marked with "use client" directive
- **Pattern**: Server Components fetch data, Client Components handle interactivity

### 2. API Route Pattern
- **Location**: /app/api/llm/* for all AI endpoints
- **Method**: POST requests with JSON payloads
- **Response Types**: Streaming (chat) or JSON (structured generation)
- **Error Handling**: Try-catch with fallback responses

### 3. State Management
- **Local State**: useState for component-level state
- **Context**: ThemeProvider for global theme state
- **External State**: Direct API calls with client-side caching
- **No Redux/Zustand**: Simple state management sufficient for app scope

### 4. Styling Strategy
- **Base**: Tailwind CSS with custom configuration
- **Theming**: CSS custom properties with class-based switching
- **Component Library**: Radix UI primitives with custom styling
- **Animations**: tailwindcss-animate for transitions

### 5. Type Safety
- **TypeScript**: Strict mode enabled throughout
- **Zod Schemas**: Runtime validation for AI responses
- **Interface Definitions**: Explicit types for Pokemon, components, props
- **Path Aliases**: @/ alias for clean imports

### 6. Performance Optimizations
- **Image Optimization**: Next.js Image component with remote patterns
- **Code Splitting**: Automatic via Next.js App Router
- **SSR**: Server-side rendering for initial page loads
- **Client Caching**: Pokemon data cached in component state

### 7. Security & Safety
- **Content Filtering**: Regex-based blocked patterns in chat
- **Kid-Friendly Prompts**: System prompts enforce appropriate content
- **Environment Variables**: API keys in .env.local
- **No Direct DB**: Stateless architecture, no sensitive data storage
