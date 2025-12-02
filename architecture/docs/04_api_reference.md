# API Reference

## Overview

This document provides comprehensive API documentation for the PokePals Interactive application, a Next.js-based Pokemon educational platform for children. The API surface includes REST endpoints for AI-powered features, React components for the UI, utility functions, and configuration options.

## Table of Contents

- [API Reference](#api-reference)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Core APIs](#core-apis)
    - [REST API Endpoints](#rest-api-endpoints)
      - [`POST /api/llm/chat`](#post-apillmchat)
      - [`POST /api/llm/quiz`](#post-apillmquiz)
      - [`POST /api/llm/story`](#post-apillmstory)
      - [`POST /api/llm/game-hints`](#post-apillmgame-hints)
      - [`POST /api/llm/color-prompt`](#post-apillmcolor-prompt)
      - [`POST /api/llm/fun-fact`](#post-apillmfun-fact)
      - [`POST /api/llm/query-pokeapi`](#post-apillmquery-pokeapi)
    - [Utility Functions](#utility-functions)
      - [`cn(...inputs)`](#cninputs)
    - [React Components](#react-components)
      - [UI Components](#ui-components)
        - [`Button`](#button)
        - [`Card` Components](#card-components)
        - [`Input`](#input)
        - [`Tabs` Components](#tabs-components)
        - [`Dialog` Components](#dialog-components)
      - [Feature Components](#feature-components)
        - [`ThemeProvider`](#themeprovider)
        - [`useTheme()`](#usetheme)
        - [`PokemonExplorer`](#pokemonexplorer)
        - [`ProfessorPineChat`](#professorpinechat)
        - [`StoryBuilder`](#storybuilder)
  - [Configuration](#configuration)
    - [Environment Variables](#environment-variables)
    - [Next.js Configuration](#nextjs-configuration)
    - [TypeScript Configuration](#typescript-configuration)
  - [Type Definitions](#type-definitions)
    - [AI SDK Types](#ai-sdk-types)
    - [Theme Types](#theme-types)
    - [Story Types](#story-types)
  - [Usage Patterns](#usage-patterns)
    - [Pattern 1: Making AI API Calls](#pattern-1-making-ai-api-calls)
    - [Pattern 2: Using Theme System](#pattern-2-using-theme-system)
    - [Pattern 3: Building Forms with UI Components](#pattern-3-building-forms-with-ui-components)
  - [Best Practices](#best-practices)
  - [Error Handling](#error-handling)
    - [Common Errors](#common-errors)

---

## Core APIs

### REST API Endpoints

All API endpoints are located in `app/api/llm/` and use OpenAI's GPT-5-nano model for AI generation.

#### `POST /api/llm/chat`

**Description:** Stream-based chat endpoint for conversing with Professor Pine, a kid-friendly AI assistant.

**File:** `app/api/llm/chat/route.ts:37`

**Request Body:**
```typescript
{
  messages: UIMessage[]  // Array of chat messages
}
```

**Response:** Server-Sent Events (SSE) stream with AI-generated responses

**Example:**
```typescript
import { useChat } from '@ai-sdk/react';

const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({ api: '/api/llm/chat' }),
});

// Send a message
sendMessage({ text: "What's a fire type creature?" });
```

**System Prompt Characteristics:**
- Grade 2-4 reading level
- Responses under 100 words
- Kid-friendly, encouraging tone
- Content safety filters for inappropriate topics
- Sparring use of emojis (1-3 per message)

**Safety Features:**
- Pre-filter content check using regex pattern matching
- Blocks: kill, hate, weapon, violence, inappropriate, adult
- Redirects to safe content on blocked input

**Configuration:**
- Model: `gpt-5-nano`
- Max Duration: 30 seconds
- Max Output Tokens: 3000

**Notes:** Uses streaming for real-time response delivery. Implements abort signal support for request cancellation.

---

#### `POST /api/llm/quiz`

**Description:** Generate kid-friendly quiz questions about Pokemon.

**File:** `app/api/llm/quiz/route.ts:15`

**Request Body:**
```typescript
{
  count?: number  // Number of questions to generate (default: 5)
}
```

**Response:**
```typescript
{
  questions: Array<{
    question: string;
    options: string[];      // Array of exactly 4 options
    correctIndex: number;   // Index (0-3) of correct answer
  }>
}
```

**Example:**
```typescript
const response = await fetch('/api/llm/quiz', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ count: 5 })
});

const { questions } = await response.json();

questions.forEach(q => {
  console.log(q.question);
  console.log(q.options[q.correctIndex]); // Correct answer
});
```

**Validation Schema:**
```typescript
const quizSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctIndex: z.number().min(0).max(3),
    })
  )
});
```

**Fallback:** Returns 5 hardcoded questions if AI generation fails.

**Notes:** Uses structured output generation with Zod schema validation. Topics include types, habitats, and fun facts.

---

#### `POST /api/llm/story`

**Description:** Interactive story generation with branching choices.

**File:** `app/api/llm/story/route.ts:10`

**Request Body (Start):**
```typescript
{
  action: "start";
  heroName: string;
  creatureType: string;
  setting: string;
}
```

**Request Body (Continue):**
```typescript
{
  action: "continue";
  heroName: string;
  previousStory: string;
  choice: string;
}
```

**Response:**
```typescript
{
  text: string;        // Story paragraph (2-4 sentences)
  choices: string[];   // Array of exactly 3 choices
}
```

**Example:**
```typescript
// Start a story
const startResponse = await fetch('/api/llm/story', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'start',
    heroName: 'Alex',
    creatureType: 'water',
    setting: 'underwater kingdom'
  })
});

const { text, choices } = await startResponse.json();
console.log(text); // Story beginning
console.log(choices); // [choice1, choice2, choice3]

// Continue the story
const continueResponse = await fetch('/api/llm/story', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'continue',
    heroName: 'Alex',
    previousStory: text,
    choice: choices[0]
  })
});
```

**Story Rules:**
- Simple language (grade 2-4)
- Short paragraphs (2-4 sentences)
- Focus on friendship, bravery, kindness
- No scary or violent content
- Always 3 choices per segment

**Notes:** Each story segment builds on previous choices. Fallback story provided on error.

---

#### `POST /api/llm/game-hints`

**Description:** Generate progressive hints for Pokemon guessing game.

**File:** `app/api/llm/game-hints/route.ts:9`

**Request Body:**
```typescript
{
  name: string;      // Pokemon name
  types: string[];   // Array of type names
  id: number;        // Pokemon ID number
}
```

**Response:**
```typescript
{
  hints: string[];   // Array of exactly 3 hints
}
```

**Example:**
```typescript
const response = await fetch('/api/llm/game-hints', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Pikachu',
    types: ['electric'],
    id: 25
  })
});

const { hints } = await response.json();
// hints[0]: Vague hint about personality/habitat
// hints[1]: More specific about type/abilities
// hints[2]: Almost gives it away (appearance)
```

**Hint Structure:**
1. **First hint:** Very vague (personality or habitat)
2. **Second hint:** More specific (type or abilities)
3. **Third hint:** Almost gives it away (appearance)

**Notes:** Uses simple words (grade 2-4 reading level). Fallback hints use basic info if generation fails.

---

#### `POST /api/llm/color-prompt`

**Description:** Generate creative drawing prompts with color palettes for kids.

**File:** `app/api/llm/color-prompt/route.ts:10`

**Request Body:**
```typescript
{}  // No parameters required
```

**Response:**
```typescript
{
  prompt: string;     // Drawing prompt for kids
  colors: string[];   // Array of exactly 4 hex color codes
}
```

**Example:**
```typescript
const response = await fetch('/api/llm/color-prompt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});

const { prompt, colors } = await response.json();

console.log(prompt);  // "Draw a water creature having a pool party!"
console.log(colors);  // ["#4ECDC4", "#FFE66D", "#95E1D3", "#FF6B35"]

// Use in canvas/drawing app
colors.forEach((color, i) => {
  palette.addColor(color);
});
```

**Prompt Themes:**
- Creature types and activities
- Scenes and environments
- Social interactions
- Imaginative scenarios

**Color Palette:** Always returns 4 complementary hex colors that match the prompt theme.

**Notes:** Fallback provides a default prompt and color set on error.

---

#### `POST /api/llm/fun-fact`

**Description:** Generate a single fun, imaginative fact about a Pokemon.

**File:** `app/api/llm/fun-fact/route.ts:4`

**Request Body:**
```typescript
{
  name: string;      // Pokemon name
  types: string[];   // Array of type names
}
```

**Response:**
```typescript
{
  fact: string;      // Fun fact (1-2 sentences)
}
```

**Example:**
```typescript
const response = await fetch('/api/llm/fun-fact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Squirtle',
    types: ['water']
  })
});

const { fact } = await response.json();
console.log(fact);
// "Squirtle loves to play in the rain and can swim faster
//  than Olympic athletes! 💧"
```

**Fact Characteristics:**
- Grade 2-4 reading level
- 1-2 sentences
- Focus on habitat, personality, or abilities
- Imaginative but not copyrighted details
- Sparring emojis
- No game mechanics or stats

**Notes:** Uses Professor Pine persona. Fallback fact uses basic type information.

---

#### `POST /api/llm/query-pokeapi`

**Description:** Convert natural language queries into structured Pokemon search filters.

**File:** `app/api/llm/query-pokeapi/route.ts:11`

**Request Body:**
```typescript
{
  query: string;     // Natural language search query
}
```

**Response:**
```typescript
{
  types: string[];        // Pokemon types matching query
  traits: string[];       // Descriptive traits
  pokemonIds: number[];   // Pokemon IDs (1-151) that match
}
```

**Example:**
```typescript
const response = await fetch('/api/llm/query-pokeapi', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'cute and small pokemon that can fly'
  })
});

const { types, traits, pokemonIds } = await response.json();

console.log(types);       // ["flying", "normal"]
console.log(traits);      // ["cute", "small", "friendly"]
console.log(pokemonIds);  // [16, 17, 18, 21, 83, 84]

// Use IDs to fetch Pokemon data
pokemonIds.forEach(id => {
  fetchPokemon(id);
});
```

**Query Examples:**
- "cute and small" → Pikachu (25), Jigglypuff (39), Eevee (133)
- "looks scary" → Gengar (94), Haunter (93), Gyarados (130)
- "can fly" → Pidgeot (18), Charizard (6), Dragonite (149)
- "purple" → Gengar (94), Nidoking (34), Rattata (19)
- "friendly" → Pikachu (25), Chansey (113), Clefairy (35)

**Constraints:**
- Only returns Pokemon from original 151 (IDs 1-151)
- Returns 5-10 Pokemon IDs per query
- Kid-friendly, positive descriptions only

**Fallback:** Returns 6 random Pokemon IDs if AI fails.

**Notes:** Uses structured output with schema validation. Great for AI-powered search.

---

### Utility Functions

#### `cn(...inputs)`

**Description:** Utility function to merge Tailwind CSS class names with proper precedence.

**File:** `lib/utils.ts:4`

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| inputs | ClassValue[] | Yes | Variable number of class name values |

**Returns:** `string` - Merged and deduplicated class names

**Example:**
```typescript
import { cn } from '@/lib/utils';

// Basic usage
const className = cn('px-4 py-2', 'bg-blue-500');
// Result: "px-4 py-2 bg-blue-500"

// With conditionals
const className = cn(
  'base-class',
  isActive && 'active-class',
  isDisabled && 'disabled-class'
);

// With objects
const className = cn('text-base', {
  'font-bold': isBold,
  'text-red-500': hasError
});

// Tailwind conflict resolution (later classes win)
const className = cn('text-blue-500', 'text-red-500');
// Result: "text-red-500"
```

**Implementation:**
```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Notes:**
- Uses `clsx` for conditional class handling
- Uses `tailwind-merge` for proper Tailwind conflict resolution
- Essential for component styling with dynamic classes

---

### React Components

#### UI Components

##### `Button`

**Description:** Versatile button component with multiple variants and sizes.

**File:** `components/ui/button.tsx:39`

**Props:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| variant | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | No | "default" | Visual style variant |
| size | `"default" \| "sm" \| "lg" \| "icon" \| "icon-sm" \| "icon-lg"` | No | "default" | Size preset |
| asChild | boolean | No | false | Use Radix Slot for composition |
| className | string | No | - | Additional CSS classes |
| ...props | ButtonHTMLAttributes | No | - | Standard button props |

**Example:**
```typescript
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

// Basic button
<Button>Click me</Button>

// With variant and size
<Button variant="destructive" size="lg">
  Delete
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Send className="w-4 h-4" />
</Button>

// As child (renders custom component)
<Button asChild>
  <Link href="/explore">Explore</Link>
</Button>

// Disabled state
<Button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

**Variants:**
- `default`: Primary action (blue background)
- `destructive`: Dangerous action (red background)
- `outline`: Secondary action with border
- `secondary`: Subtle action
- `ghost`: Minimal styling
- `link`: Text link style

**Sizes:**
- `default`: h-9, standard padding
- `sm`: h-8, compact
- `lg`: h-10, larger
- `icon`: 36x36px square
- `icon-sm`: 32x32px square
- `icon-lg`: 40x40px square

**Accessibility:** Includes focus-visible ring, disabled state handling, and ARIA support.

---

##### `Card` Components

**Description:** Flexible card container with header, content, and footer sections.

**File:** `components/ui/card.tsx`

**Components:**
- `Card` (line 5)
- `CardHeader` (line 18)
- `CardTitle` (line 31)
- `CardDescription` (line 41)
- `CardAction` (line 51)
- `CardContent` (line 64)
- `CardFooter` (line 74)

**Example:**
```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

<Card>
  <CardHeader>
    <CardTitle>Pokemon Details</CardTitle>
    <CardDescription>
      Learn more about this creature
    </CardDescription>
    <CardAction>
      <Button variant="ghost" size="icon">X</Button>
    </CardAction>
  </CardHeader>

  <CardContent>
    <p>This is a friendly water-type Pokemon...</p>
  </CardContent>

  <CardFooter>
    <Button>Save to Favorites</Button>
  </CardFooter>
</Card>
```

**Layout:**
- Automatic gap spacing (1.5rem)
- Responsive padding
- Border and shadow styling
- Grid layout for header with action button

**Notes:** All sub-components accept standard div props and className for customization.

---

##### `Input`

**Description:** Styled input field with consistent design system.

**File:** `components/ui/input.tsx:5`

**Props:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| type | string | No | "text" | HTML input type |
| className | string | No | - | Additional CSS classes |
| ...props | InputHTMLAttributes | No | - | Standard input props |

**Example:**
```typescript
import { Input } from '@/components/ui/input';
import { useState } from 'react';

function SearchForm() {
  const [query, setQuery] = useState('');

  return (
    <>
      {/* Basic input */}
      <Input
        type="text"
        placeholder="Search Pokemon..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Email input */}
      <Input
        type="email"
        placeholder="Email address"
        required
      />

      {/* With custom styling */}
      <Input
        type="search"
        placeholder="Type to search..."
        className="h-14 text-lg rounded-full"
      />

      {/* Disabled */}
      <Input
        type="text"
        value="Loading..."
        disabled
      />
    </>
  );
}
```

**Features:**
- Built-in focus ring styling
- Error state support (aria-invalid)
- File upload styling
- Text selection styling
- Responsive font sizes

**Notes:** Automatically applies proper styling for different states (focus, error, disabled).

---

##### `Tabs` Components

**Description:** Accessible tab navigation using Radix UI primitives.

**File:** `components/ui/tabs.tsx`

**Components:**
- `Tabs` (line 8)
- `TabsList` (line 21)
- `TabsTrigger` (line 37)
- `TabsContent` (line 53)

**Example:**
```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="explore" className="w-full">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="explore">Explore</TabsTrigger>
    <TabsTrigger value="favorites">Favorites</TabsTrigger>
  </TabsList>

  <TabsContent value="explore">
    <PokemonGrid />
  </TabsContent>

  <TabsContent value="favorites">
    <FavoritesList />
  </TabsContent>
</Tabs>

// Controlled tabs
function ControlledTabs() {
  const [tab, setTab] = useState('browse');

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="browse">Browse</TabsTrigger>
        <TabsTrigger value="search">Search</TabsTrigger>
      </TabsList>
      <TabsContent value="browse">...</TabsContent>
      <TabsContent value="search">...</TabsContent>
    </Tabs>
  );
}
```

**Props (Tabs):**
- `defaultValue`: Initial tab value
- `value`: Controlled value
- `onValueChange`: Change handler

**Accessibility:** Full keyboard navigation, ARIA labels, focus management.

---

##### `Dialog` Components

**Description:** Modal dialog with overlay and customizable content.

**File:** `components/ui/dialog.tsx`

**Components:**
- `Dialog` (line 9)
- `DialogTrigger` (line 15)
- `DialogContent` (line 49)
- `DialogHeader` (line 83)
- `DialogTitle` (line 106)
- `DialogDescription` (line 119)
- `DialogFooter` (line 93)
- `DialogClose` (line 27)

**Example:**
```typescript
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

<Dialog>
  <DialogTrigger asChild>
    <Button>View Details</Button>
  </DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Pokemon Details</DialogTitle>
      <DialogDescription>
        Learn more about this amazing creature
      </DialogDescription>
    </DialogHeader>

    <div className="py-4">
      {/* Dialog content */}
      <p>Pokemon information here...</p>
    </div>

    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Controlled dialog
function ControlledDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Open</Button>
      </DialogTrigger>
      <DialogContent>...</DialogContent>
    </Dialog>
  );
}
```

**Props (DialogContent):**
- `showCloseButton`: Show/hide X button (default: true)
- `className`: Additional styles

**Features:**
- Portal rendering (outside DOM hierarchy)
- Overlay with backdrop
- Focus trap
- Escape key to close
- Animations (fade + zoom)

---

#### Feature Components

##### `ThemeProvider`

**Description:** Context provider for theme management with localStorage persistence.

**File:** `components/theme-provider.tsx:14`

**Props:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| children | ReactNode | Yes | Child components |

**Example:**
```typescript
import { ThemeProvider } from '@/components/theme-provider';

// In app layout
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Themes Available:**
- `candy`: Default pink/purple theme
- `space`: Dark space theme
- `ocean`: Blue aquatic theme

**Notes:**
- Persists theme to localStorage as `pokepals-theme`
- Applies theme via CSS class on document element
- Handles SSR/hydration properly with mounted state

---

##### `useTheme()`

**Description:** Hook to access and modify the current theme.

**File:** `components/theme-provider.tsx:40`

**Returns:**
```typescript
{
  theme: Theme;              // Current theme ("candy" | "space" | "ocean")
  setTheme: (theme: Theme) => void;  // Function to change theme
}
```

**Example:**
```typescript
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';

function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <Button
        variant={theme === 'candy' ? 'default' : 'outline'}
        onClick={() => setTheme('candy')}
      >
        Candy
      </Button>
      <Button
        variant={theme === 'space' ? 'default' : 'outline'}
        onClick={() => setTheme('space')}
      >
        Space
      </Button>
      <Button
        variant={theme === 'ocean' ? 'default' : 'outline'}
        onClick={() => setTheme('ocean')}
      >
        Ocean
      </Button>
    </div>
  );
}
```

**Throws:** Error if used outside ThemeProvider context

**Notes:** Theme changes are automatically persisted to localStorage and applied to DOM.

---

##### `PokemonExplorer`

**Description:** Main exploration component with browse and AI-powered search.

**File:** `components/pokemon-explorer.tsx:11`

**Props:** None (self-contained component)

**Example:**
```typescript
import { PokemonExplorer } from '@/components/pokemon-explorer';

// In explore page
export default function ExplorePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Pokemon</h1>
      <PokemonExplorer />
    </div>
  );
}
```

**Features:**
- **Browse Tab:**
  - Text search by name
  - Type filter buttons
  - Grid display of Pokemon

- **Ask AI Tab:**
  - Natural language search
  - Example query suggestions
  - AI-powered results using `/api/llm/query-pokeapi`

**State Management:**
- `searchQuery`: Text search input
- `naturalQuery`: AI search input
- `selectedType`: Filter by Pokemon type
- `nlResults`: Pokemon IDs from AI search
- `nlLoading`: Loading state for AI requests
- `activeTab`: Current tab ("browse" | "ask")

**Internal API Calls:**
```typescript
// Natural language search
fetch('/api/llm/query-pokeapi', {
  method: 'POST',
  body: JSON.stringify({ query: naturalQuery })
})
```

**Notes:** Handles both traditional and AI-powered search patterns. Responsive design with mobile support.

---

##### `ProfessorPineChat`

**Description:** AI chat interface with Professor Pine character.

**File:** `components/professor-pine-chat.tsx:22`

**Props:** None (self-contained component)

**Example:**
```typescript
import { ProfessorPineChat } from '@/components/professor-pine-chat';

// In chat page
export default function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <ProfessorPineChat />
    </div>
  );
}
```

**Features:**
- Streaming AI responses
- Message history with scroll
- Suggested questions
- Reset conversation
- Loading states
- Auto-scroll to latest message

**Uses AI SDK:**
```typescript
const { messages, sendMessage, status, setMessages } = useChat({
  transport: new DefaultChatTransport({ api: '/api/llm/chat' }),
  initialMessages: [welcomeMessage]
});
```

**Message Types:**
- User messages: Right-aligned, blue background
- Assistant messages: Left-aligned, gray background with Pine icon
- Streaming indicator: "Thinking..." animation

**Suggested Questions:**
- "What's the coolest water creature?"
- "Tell me about fire types!"
- "Which creature is the fastest?"
- "What creature would make a good friend?"
- "Tell me a fun story!"

**Notes:** Includes Professor Pine avatar and personality. Kid-friendly interface with large touch targets.

---

##### `StoryBuilder`

**Description:** Interactive story creation with AI-generated content and choices.

**File:** `components/story-builder.tsx:14`

**Props:** None (self-contained component)

**Example:**
```typescript
import { StoryBuilder } from '@/components/story-builder';

// In stories page
export default function StoriesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Story Builder</h1>
      <StoryBuilder />
    </div>
  );
}
```

**Features:**
- **Story Setup:**
  - Hero name input (required)
  - Creature type selection (fire, water, grass, electric, fairy)
  - Setting selection (magical forest, underwater kingdom, etc.)

- **Story Progression:**
  - AI-generated story paragraphs
  - 3 branching choices per segment
  - Continues based on user selection
  - Reset to start new story

**State Management:**
```typescript
interface StoryPart {
  text: string;       // Story paragraph
  choices?: string[]; // Available choices
}

const [heroName, setHeroName] = useState('')
const [creatureType, setCreatureType] = useState('')
const [setting, setSetting] = useState('')
const [story, setStory] = useState<StoryPart[]>([])
const [loading, setLoading] = useState(false)
const [started, setStarted] = useState(false)
```

**API Integration:**
```typescript
// Start story
fetch('/api/llm/story', {
  method: 'POST',
  body: JSON.stringify({
    action: 'start',
    heroName,
    creatureType,
    setting
  })
});

// Continue story
fetch('/api/llm/story', {
  method: 'POST',
  body: JSON.stringify({
    action: 'continue',
    heroName,
    previousStory: story.map(s => s.text).join('\n'),
    choice: selectedChoice
  })
});
```

**User Flow:**
1. Enter hero name
2. Select creature type (optional, defaults to "friendly")
3. Select setting (optional, defaults to "magical forest")
4. Click "Start My Adventure"
5. Read story paragraph
6. Choose one of 3 options
7. Continue story based on choice
8. Repeat until user resets

**Notes:** Includes fallback stories if API fails. Loading states with animations. Mobile-responsive design.

---

## Configuration

### Environment Variables

**File:** `.env.example`

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| OPENAI_API_KEY | string | Yes | - | OpenAI API key for all AI features |

**Setup Instructions:**

```bash
# 1. Copy example file
cp .env.example .env.local

# 2. Add your OpenAI API key
# Edit .env.local and replace placeholder with actual key
OPENAI_API_KEY=sk-your-actual-key-here
```

**Get API Key:** https://platform.openai.com/api-keys

**Production Deployment (Vercel):**
1. Go to Project Settings → Environment Variables
2. Add `OPENAI_API_KEY` with your key
3. Deploy

**Documentation:** https://vercel.com/docs/environment-variables

**Notes:**
- `.env.local` is gitignored for security
- Required for all AI endpoints (chat, quiz, story, etc.)
- App will fail to build/run without valid key

---

### Next.js Configuration

**File:** `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
```

**Configuration Options:**

**Images:**
- Allows loading images from GitHub raw content
- Used for Pokemon sprites from PokeAPI
- Pattern: `https://raw.githubusercontent.com/**`

**Extending Configuration:**
```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      // Add more image sources
      {
        protocol: "https",
        hostname: "example.com",
      }
    ],
  },
  // Other Next.js options
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
};
```

**Notes:** This configuration is required for Next.js Image component to load external Pokemon sprites.

---

### TypeScript Configuration

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Key Options:**

**Path Aliases:**
```typescript
// tsconfig.json
"paths": {
  "@/*": ["./*"]
}

// Usage in code
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

**Strict Mode:**
- Type checking enabled
- Helps catch errors early
- Recommended for production apps

**JSX Transform:** Uses new `react-jsx` transform (no need to import React)

**Module Resolution:** Uses bundler mode for Next.js App Router

**Notes:** Next.js plugin provides enhanced TypeScript support and auto-generated types.

---

## Type Definitions

### AI SDK Types

```typescript
// From ai package
import type { UIMessage } from 'ai';

interface UIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  parts?: MessagePart[];
}

interface MessagePart {
  type: 'text' | 'image' | 'file';
  text?: string;
  // ... other part properties
}
```

**Usage:**
```typescript
const messages: UIMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello!',
    parts: [{ type: 'text', text: 'Hello!' }]
  }
];
```

---

### Theme Types

**File:** `components/theme-provider.tsx:5`

```typescript
type Theme = "candy" | "space" | "ocean"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}
```

**Usage:**
```typescript
import type { Theme } from '@/components/theme-provider';

function setUserTheme(theme: Theme) {
  localStorage.setItem('theme', theme);
}
```

---

### Story Types

**File:** `components/story-builder.tsx:9`

```typescript
interface StoryPart {
  text: string;
  choices?: string[];
}
```

**Usage:**
```typescript
const storySegments: StoryPart[] = [
  {
    text: "Once upon a time...",
    choices: ["Go left", "Go right", "Stay here"]
  },
  {
    text: "You went left and found...",
    choices: ["Continue", "Go back", "Rest"]
  }
];
```

---

## Usage Patterns

### Pattern 1: Making AI API Calls

**Description:** Standard pattern for calling AI endpoints with error handling

```typescript
async function generateQuiz(count: number = 5) {
  try {
    const response = await fetch('/api/llm/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.questions;

  } catch (error) {
    console.error('Quiz generation failed:', error);
    // Return fallback or show error UI
    return getFallbackQuestions();
  }
}

// In React component
function QuizGame() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadQuiz = async () => {
    setLoading(true);
    const quiz = await generateQuiz(5);
    setQuestions(quiz);
    setLoading(false);
  };

  return (
    <Button onClick={loadQuiz} disabled={loading}>
      {loading ? 'Generating...' : 'Start Quiz'}
    </Button>
  );
}
```

**Best Practices:**
- Always include try-catch
- Show loading states
- Provide fallback content
- Handle network errors gracefully
- Use TypeScript for type safety

---

### Pattern 2: Using Theme System

**Description:** Implementing custom theme-aware components

```typescript
import { useTheme } from '@/components/theme-provider';

function ThemedHeader() {
  const { theme, setTheme } = useTheme();

  // Theme-specific content
  const themeConfig = {
    candy: {
      emoji: '🍭',
      title: 'Sweet Adventures',
      colors: 'bg-pink-500'
    },
    space: {
      emoji: '🚀',
      title: 'Cosmic Journey',
      colors: 'bg-purple-900'
    },
    ocean: {
      emoji: '🌊',
      title: 'Ocean Exploration',
      colors: 'bg-blue-600'
    }
  };

  const config = themeConfig[theme];

  return (
    <header className={cn('p-4', config.colors)}>
      <h1 className="text-2xl">
        {config.emoji} {config.title}
      </h1>

      {/* Theme switcher */}
      <div className="flex gap-2 mt-4">
        {(['candy', 'space', 'ocean'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={cn(
              'px-4 py-2 rounded',
              theme === t ? 'bg-white text-black' : 'bg-black/20'
            )}
          >
            {t}
          </button>
        ))}
      </div>
    </header>
  );
}
```

**CSS Theme Variables:**
```css
/* Default (candy) theme */
:root {
  --primary: #ff69b4;
  --background: #fff0f5;
}

/* Space theme */
.theme-space {
  --primary: #9370db;
  --background: #1a1a2e;
}

/* Ocean theme */
.theme-ocean {
  --primary: #4682b4;
  --background: #e0f7fa;
}
```

---

### Pattern 3: Building Forms with UI Components

**Description:** Creating accessible forms with validation

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function PokemonSearchForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/llm/query-pokeapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      setResults(data.pokemonIds);

    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Pokemon</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Describe what you're looking for..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-invalid={!!error}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-4">
            <p>Found {results.length} Pokemon!</p>
            {/* Render results */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

**Form Best Practices:**
- Use controlled inputs
- Validate before submission
- Show error messages clearly
- Disable submit during loading
- Clear errors on new input
- Use semantic HTML (form, button type="submit")
- Add ARIA attributes for accessibility

---

## Best Practices

1. **API Error Handling**
   - Always wrap API calls in try-catch blocks
   - Provide fallback content for failures
   - Log errors to console for debugging
   - Show user-friendly error messages

2. **Component Composition**
   - Use UI components consistently across the app
   - Leverage the `cn()` utility for conditional styling
   - Keep components focused on single responsibility
   - Extract reusable logic into custom hooks

3. **Performance**
   - Use loading states for async operations
   - Implement proper error boundaries
   - Lazy load heavy components when possible
   - Optimize images with Next.js Image component

4. **Accessibility**
   - Use semantic HTML elements
   - Add ARIA labels where needed
   - Ensure keyboard navigation works
   - Test with screen readers
   - Maintain color contrast ratios

5. **Type Safety**
   - Define interfaces for all data structures
   - Use TypeScript for all components
   - Validate API responses with Zod schemas
   - Avoid `any` types

6. **AI Integration**
   - Set reasonable token limits
   - Implement request timeouts
   - Cache responses where appropriate
   - Handle rate limiting gracefully
   - Provide fallback content

7. **State Management**
   - Keep state as local as possible
   - Use context for theme and global state
   - Lift state only when necessary
   - Consider URL state for navigation

8. **Security**
   - Never expose API keys in client code
   - Validate user input on both client and server
   - Sanitize AI-generated content
   - Implement content safety filters
   - Use environment variables for secrets

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `OPENAI_API_KEY not found` | Missing environment variable | Add key to `.env.local` or Vercel settings |
| `API rate limit exceeded` | Too many requests to OpenAI | Implement retry logic with exponential backoff |
| `Network request failed` | Network connectivity issue | Add retry mechanism and show offline UI |
| `Invalid JSON in response` | Malformed API response | Add response validation and fallback |
| `useTheme must be used within ThemeProvider` | Hook used outside provider | Wrap app with `<ThemeProvider>` |
| `Image failed to load` | Invalid Pokemon ID or URL | Add error boundaries and fallback images |
| `Quiz generation timeout` | AI request took too long | Reduce token count or show fallback questions |

**Error Boundary Example:**
```typescript
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-lg font-bold text-red-700">
            Oops! Something went wrong
          </h2>
          <p className="text-red-600">
            Please refresh the page and try again.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <PokemonExplorer />
</ErrorBoundary>
```

**API Error Handler:**
```typescript
async function callAIEndpoint(endpoint: string, body: any) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout');
        throw new Error('Request took too long');
      }
      console.error('API call failed:', error.message);
    }
    throw error;
  }
}
```

---

## Summary

This API reference covers:

- **7 AI-powered REST endpoints** for chat, quiz, story, hints, prompts, facts, and search
- **1 utility function** (`cn`) for class name management
- **10+ UI components** including Button, Card, Input, Tabs, Dialog
- **3 feature components** for theme management, exploration, chat, and stories
- **Configuration** for environment variables, Next.js, and TypeScript
- **Type definitions** for AI SDK, themes, and story data
- **Usage patterns** for common development tasks
- **Best practices** for error handling, accessibility, and performance

All APIs are designed to be kid-friendly, safe, and educational while providing a robust developer experience.

For implementation examples, see the source files referenced throughout this document. All file paths are absolute and point to ``.
