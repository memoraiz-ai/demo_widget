# Demo MemorAIz - Developer Documentation

> **Purpose**: This documentation provides comprehensive information about the MemorAIz project structure, architecture, and implementation details to assist AI systems and developers in understanding and modifying the codebase.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Core Features](#core-features)
6. [Component Details](#component-details)
7. [Data Flow](#data-flow)
8. [Styling System](#styling-system)
9. [State Management](#state-management)
10. [Data Files](#data-files)
11. [How to Modify](#how-to-modify)
12. [Key Patterns](#key-patterns)

---

## 🎯 Project Overview

**MemorAIz** is an interactive educational web application built with React that provides multiple learning modes for studying content:

- **Quiz Mode**: Test knowledge with various question formats
- **Flashcard Mode**: Study with interactive flashcards
- **Mindmap Mode**: Visual learning through interactive mind maps
- **Podcast Mode**: Audio-based learning experience

The application features **8 distinct visual styles** (themes) that can be applied independently to each mode, providing a highly customizable learning experience.

**Live Demo**: [https://demo-memoraiz.vercel.app/](https://demo-memoraiz.vercel.app/)

---

## 💻 Tech Stack

```json
{
  "name": "quiz-app",
  "version": "1.0.0",
  "dependencies": {
    "lucide-react": "^0.553.0",    // Icon library
    "react": "^18.2.0",             // Core UI framework
    "react-dom": "^18.2.0",         // React DOM rendering
    "react-scripts": "5.0.1"        // Build tooling
  }
}
```

**Key Technologies**:
- React 18.2.0 (Functional Components + Hooks)
- CSS3 (Multiple theme-based stylesheets)
- lucide-react for icons
- JSON for content data storage

---

## 🏗 Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App.js                              │
│                   (Main Application)                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Navigation Bar                          │  │
│  │  [Quiz] [Flashcard] [Mindmap] [Podcast]            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────────────────┬───────────────────────────┐│
│  │                            │                           ││
│  │    Main Content Area       │     Side Panel           ││
│  │                            │                           ││
│  │  • Quiz Components         │  • Functionality         ││
│  │  • Flashcard Component     │  • Style Selector        ││
│  │  • Mindmap Component       │  • Settings/Details      ││
│  │  • Podcast Component       │  • Export Button         ││
│  │  • Export View            │                           ││
│  │                            │                           ││
│  └────────────────────────────┴───────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── Navigation Buttons
├── Main Content
│   ├── Quiz Mode
│   │   ├── SingleQuiz
│   │   ├── MultiQuiz
│   │   ├── TrueFalseQuiz
│   │   └── OutlinedQuiz
│   ├── Flashcard Mode
│   │   └── Flashcard (with multiple visual styles)
│   ├── Mindmap Mode
│   │   ├── MindmapControls
│   │   ├── MindmapNode
│   │   ├── ConnectionLabel
│   │   ├── NodeCustomization
│   │   └── MindmapMinimap
│   ├── Podcast Mode
│   │   └── Podcast
│   └── Export View
│       └── ExportView
└── Side Panel
    └── SidePanel (context-sensitive controls)
```

---

## 📁 Project Structure

```
Demo-MemorAIz/
├── public/                          # Static assets
│   ├── index.html
│   ├── favicon.ico
│   └── *.png                        # Emotion/reaction images for styles
├── src/
│   ├── index.js                     # React entry point
│   ├── App.js                       # Main application component
│   │
│   ├── components/                  # React components
│   │   ├── Quiz/
│   │   │   ├── QuizBase.js         # Base wrapper (minimal)
│   │   │   ├── SingleQuiz.js       # Radio button quiz
│   │   │   ├── MultiQuiz.js        # Checkbox quiz
│   │   │   ├── TrueFalseQuiz.js    # True/False quiz
│   │   │   ├── OutlinedQuiz.js     # Card-based quiz
│   │   │   └── index.js            # Exports
│   │   │
│   │   ├── Flashcard/
│   │   │   ├── Flashcard.js        # Main flashcard component
│   │   │   └── index.js
│   │   │
│   │   ├── Mindmap/
│   │   │   ├── Mindmap.js          # Main mindmap component
│   │   │   ├── components/         # Sub-components
│   │   │   │   ├── ConnectionLabel.js
│   │   │   │   ├── MindmapControls.js
│   │   │   │   ├── MindmapMinimap.js
│   │   │   │   ├── MindmapNode.js
│   │   │   │   ├── NodeCustomization.js
│   │   │   │   └── NodeTooltip.js
│   │   │   ├── hooks/              # Custom hooks
│   │   │   │   ├── useMindmapHandlers.js
│   │   │   │   └── useMindmapState.js
│   │   │   ├── utils/              # Utility functions
│   │   │   │   └── mindmapUtils.js
│   │   │   ├── data/
│   │   │   │   └── nodeInfoData.js
│   │   │   └── index.js
│   │   │
│   │   ├── Podcast/
│   │   │   ├── Podcast.js          # Audio player component
│   │   │   └── index.js
│   │   │
│   │   ├── ExportView/
│   │   │   ├── ExportView.js       # Configuration export view
│   │   │   └── index.js
│   │   │
│   │   ├── SidePanel/
│   │   │   ├── SidePanel.js        # Context-sensitive controls
│   │   │   └── index.js
│   │   │
│   │   └── index.js                # Main component exports
│   │
│   ├── data/                        # JSON content files
│   │   ├── quiz.json               # Quiz questions
│   │   ├── quiz_multi_answer.json
│   │   ├── quiz_true_false.json
│   │   ├── flashcard.json          # Flashcard data
│   │   ├── mindmap.json            # Mindmap structure
│   │   ├── transcript.json         # Podcast transcript
│   │   └── transcript.txt
│   │
│   └── styles/                      # CSS stylesheets
│       ├── App.css                 # Global and layout styles
│       ├── Styles.css              # Quiz and component styles
│       ├── QuizBase.css
│       ├── SidePanel.css
│       ├── Podcast.css
│       └── ExportView.css
│
├── generated/                       # Runtime generated files
├── build/                          # Production build output
├── package.json
└── README.md
```

---

## 🎨 Core Features

### 1. **Quiz Mode**

Four distinct quiz types with customizable settings:

#### Quiz Types
- **Single Answer** (`single`): Radio button selection, one correct answer
- **Multiple Answer** (`multi`): Checkbox selection, multiple correct answers
- **True/False** (`truefalse`): Binary choice questions
- **Outlined** (`outlined`): Card-based selection with visual feedback

#### Quiz Settings (via SidePanel)
- **Timer**: Enable/disable with configurable duration (1-15 minutes)
- **Immediate Feedback**: Show instant answer validation
- **Number of Answers**: 2-8 answer options (single/multi only)
- **Scoring**:
  - Points for correct answers (default: +1)
  - Points for incorrect answers (default: -1)
- **Visual Style**: 8 different themes

**Important Behavior**: When switching to `multi` quiz, immediate feedback is automatically disabled and restored when switching away.

### 2. **Flashcard Mode**

Interactive flashcards with flip animation:

#### Flashcard Modes
- **Normal Mode** (`normal`): Standard question/answer cards
- **Fill the Blank** (`fillblank`): Complete sentences mode
- **Mix Mode** (`mix`): Combination of different types

#### Flashcard Settings
- **Timer**: Enable/disable with configurable duration
- **Shuffle**: Randomize card order
- **Visual Style**: 8 different themes
- **Navigation**: Previous/Next buttons, dot indicators
- **Flip Interaction**: Click to flip, shows progress

### 3. **Mindmap Mode**

Interactive visual mind map with node relationships:

#### Mindmap Modes
- **Dynamic** (`dynamic`): Edit nodes, connections, colors
- **Static** (`static`): View-only mode

#### Mindmap Features
- **Drag & Drop**: Move nodes around canvas
- **Zoom & Pan**: Mouse wheel zoom, drag to pan
- **Node Editing**: Double-click to edit text
- **Connection Creation**: Drag from node to create relationships
- **Connection Labels**: Editable relationship descriptions
- **Node Customization**:
  - Color picker for nodes
  - Icon/emoji selection
  - Add/delete nodes
- **Minimap**: Overview navigation
- **Tooltips**: Hover for node details

#### Mindmap Settings
- **Show Node Details**: Enable/disable tooltips
- **Show Connection Labels**: Toggle relationship labels
- **Visual Style**: 8 different themes

### 4. **Podcast Mode**

Audio player interface (UI only, no actual audio in demo):

#### Podcast Features
- Play/Pause controls
- Progress slider
- Time display (current/total)
- Episode information display

#### Podcast Settings
- **Transcript**: Simple/Detailed/None
- **Voice**: Male/Female selection
- **Multispeaker**: Enable/disable multiple voices
- **Visual Style**: 8 different themes

### 5. **Export Functionality**

Export complete configuration and content:

#### Export Content
- All settings for each mode
- Visual style selections
- Content data (quizzes, flashcards, transcript)
- Metadata (export date, source)

#### Export Format
Structured JSON with:
- `exportMetadata`: Date and source info
- `summary`: Human-readable configuration summary
- `config`: Technical configuration details
- `content`: All quiz/flashcard/podcast data

---

## 🧩 Component Details

### App.js

**Purpose**: Main application component, orchestrates all features

**Key State Variables**:
```javascript
// Page navigation
currentPage: 'quiz' | 'flashcard' | 'mindmap' | 'podcast'

// Quiz settings
quizType: 'single' | 'multi' | 'truefalse' | 'outlined'
quizStyle: string // Visual style
timerEnabled: boolean
timerDuration: number // in seconds
immediateFeedbackEnabled: boolean
answersCount: number // 2-8
correctPoints: number
incorrectPoints: number

// Flashcard settings
flashcardMode: 'normal' | 'fillblank' | 'mix'
flashcardStyle: string

// Mindmap settings
mindmapStyle: string
showNodeDetails: boolean
showConnectionLabels: boolean
dynamicMapEnabled: boolean

// Podcast settings
podcastStyle: string
podcastTranscript: 'none' | 'simple' | 'detailed'
podcastVoice: 'uomo' | 'donna'
podcastMultispeaker: boolean

// Export
showExportView: boolean
exportData: object | null
```

**Key Methods**:
- `handleShuffle()`: Shuffles flashcards via ref
- `handleExport()`: Creates export data structure
- `renderQuiz()`: Conditionally renders quiz type
- `renderContent()`: Switches between main content views

**Important Patterns**:
- Uses `useRef` for child component methods (flashcard shuffle)
- Uses `useEffect` to manage immediate feedback state for multi-quiz
- Passes visual style as prop to all components
- Centralized state management (no context/redux)

---

### SidePanel Component

**Purpose**: Context-sensitive controls that change based on active page

**Structure**:
```javascript
// Conditional rendering based on currentPage
if (currentPage === 'quiz') {
  // Show quiz types, quiz settings
}
if (currentPage === 'flashcard') {
  // Show flashcard modes, flashcard settings
}
if (currentPage === 'mindmap') {
  // Show mindmap modes, mindmap settings
}
if (currentPage === 'podcast') {
  // Show podcast transcripts, podcast settings
}
// Always show: Style selector, Quick Info, Reset/Export buttons
```

**Sections**:
1. **Funzionalità** (Functionality): Mode/type selection cards
2. **Dettagli** (Details): Settings specific to current mode
3. **Stile** (Style): Visual theme selector
4. **Informazioni rapide** (Quick Info): Current configuration summary
5. **Footer**: Reset and Export buttons

**UI Pattern**: Card-based selection with hover effects and active states

---

### Quiz Components

All quiz components share common structure but differ in interaction:

**Common Props**:
```javascript
{
  visualStyle: string,
  timerEnabled: boolean,
  timerDuration: number,
  immediateFeedbackEnabled: boolean,
  answersCount: number,        // single/multi only
  correctPoints: number,
  incorrectPoints: number
}
```

**State Pattern** (all quiz types):
```javascript
const [currentQuestion, setCurrentQuestion] = useState(0);
const [selectedAnswers, setSelectedAnswers] = useState(/*varies*/);
const [showResults, setShowResults] = useState(false);
const [score, setScore] = useState(0);
const [timeRemaining, setTimeRemaining] = useState(timerDuration);
const [answerFeedback, setAnswerFeedback] = useState({});
```

**Quiz Types Specifics**:

1. **SingleQuiz**: 
   - `selectedAnswers`: Single answer ID
   - Radio button inputs
   - Immediate feedback shows correct/incorrect per question

2. **MultiQuiz**:
   - `selectedAnswers`: Array of answer IDs
   - Checkbox inputs
   - Immediate feedback disabled by design (enforced in App.js)

3. **TrueFalseQuiz**:
   - `selectedAnswers`: 'true' or 'false'
   - Custom true/false buttons
   - Binary choice only

4. **OutlinedQuiz**:
   - Similar to SingleQuiz
   - Different visual presentation (cards instead of radio)
   - Checkmark overlay on selection

---

### Flashcard Component

**Purpose**: Interactive flashcard study interface with multiple visual styles

**Key Features**:
- Flip animation (CSS 3D transforms)
- Navigation (previous/next/direct)
- Shuffle capability (exposed via ref)
- Timer countdown
- Multiple visual implementations

**Structure**:
```javascript
// Single component with conditional rendering per visual style
if (visualStyle === 'playful') { return <PlayfulFlashcard /> }
if (visualStyle === 'tech') { return <TechFlashcard /> }
// ... etc for all 8 styles
```

**Props**:
```javascript
{
  visualStyle: string,
  mode: 'normal' | 'fillblank' | 'mix',
  timerEnabled: boolean,
  timerDuration: number
}
```

**Exposed Methods** (via `useImperativeHandle`):
```javascript
shuffleFlashcards() // Called from parent via ref
```

**State**:
```javascript
currentCard: number         // Index of current card
isFlipped: boolean          // Flip state
flashcards: array          // Card data
timeRemaining: number      // Countdown
isFinished: boolean        // Timer expired
```

---

### Mindmap Component

**Purpose**: Interactive node-based visualization with drag, edit, and connect

**Architecture**:
```javascript
Mindmap (main component)
├── useMindmapState (custom hook)      // All state variables
├── useMindmapHandlers (custom hook)   // All event handlers
└── Sub-components:
    ├── MindmapControls
    ├── MindmapNode
    ├── ConnectionLabel
    ├── NodeCustomization
    └── MindmapMinimap
```

**State** (from `useMindmapState`):
```javascript
nodes: array                    // Node objects with position, text, color, icon
connections: array             // Connection objects with from/to node IDs
zoom: number                   // Zoom level
pan: {x, y}                    // Canvas offset
draggedNode: string|null       // ID of node being dragged
editingNode: string|null       // ID of node being edited
selectedNode: string|null      // ID of selected node
hoveredNode: string|null       // ID of hovered node
editingConnection: string|null // Key of connection being edited
selectedConnection: string|null
draggingConnection: object|null // Temporary connection being created
connectionTarget: string|null   // Target node for new connection
```

**Handlers** (from `useMindmapHandlers`):
```javascript
handleMouseDown              // Start drag
handleCanvasMouseDown        // Pan canvas
handleZoomIn/Out            // Zoom controls
handleResetView             // Reset to default view
handleNodeTextChange        // Update node text
handleConnectionLabelChange // Update connection label
handleColorChange           // Change node color
handleIconChange            // Change node icon
addNode                     // Create new node
deleteNode                  // Remove node
deleteConnection            // Remove connection
// ... and more
```

**Key Interactions**:
- **Drag Node**: mouseDown on node → mousemove → mouseUp
- **Pan Canvas**: mouseDown on canvas → mousemove → mouseUp
- **Zoom**: mousewheel event
- **Edit Node**: Double-click node → inline edit
- **Create Connection**: Click connection handle → drag to target → release
- **Edit Connection**: Double-click connection label → inline edit

**SVG Layer**: 
- Draws all connection lines
- Uses markers for arrowheads
- Positioned absolutely over nodes

**Node Layer**:
- Positioned absolutely with CSS
- Transform applied for zoom/pan
- Interactive elements (buttons, inputs)

---

### Podcast Component

**Purpose**: Audio player with dynamic audio URL generation based on user selections

**Props**:
```javascript
{
  visualStyle: string,        // Visual theme (playful, tech, etc.)
  backgroundMusic: boolean,   // Enable/disable background music
  language: string,           // italian, brazilian, english, chinese
  voice: string,              // uomo (male), donna (female)
  multispeaker: boolean       // Enable dialogue mode
}
```

**Features**:
- Play/Pause toggle
- Progress slider
- Time formatting
- Episode metadata display
- **Dynamic audio URL generation** based on user selections

**State**:
```javascript
isPlaying: boolean
currentTime: number
duration: number
```

**Dynamic Audio URL**:
The component generates audio URLs dynamically using the pattern:
```
https://cdn.memoraiz.com/audio/PLAI/{language}_{voiceType}{_with_bgm}.mp3
```

Where:
- `language`: italian, brazilian, english, or chinese
- `voiceType`: 
  - `dialogue` if multispeaker is enabled
  - `male` if single speaker with voice="uomo"
  - `female` if single speaker with voice="donna"
- `_with_bgm`: appended only if backgroundMusic is enabled

**Examples**:
- Italian, male, no BGM: `italian_male.mp3`
- Brazilian, dialogue, with BGM: `brazilian_dialogue_with_bgm.mp3`
- English, female, with BGM: `english_female_with_bgm.mp3`

**Audio Element**:
```jsx
<audio ref={audioRef} 
  onTimeUpdate={handleTimeUpdate}
  onLoadedMetadata={handleLoadedMetadata}
  onEnded={() => setIsPlaying(false)}>
  <source src={audioUrl} type="audio/mpeg" />
</audio>
```

---

### ExportView Component

**Purpose**: Display and download configuration as JSON, with live demonstrations

**Features**:
- Pretty-printed JSON display
- Download as file functionality
- Back navigation
- Formatted configuration summary
- **Video player** with synchronized transcript
- **Audio player** (matches podcast style from main app)
- **Interactive transcript** with click-to-seek
- **Mindmap visualization**
- **Learning Tools panel** with Quiz and Flashcard previews

**Layout Structure** (Two-Row Layout):
```
┌─────────────────────────────────────────────────────────────┐
│                    Export View Header                       │
│              [Back] Title  [Copy JSON] [Download]           │
└─────────────────────────────────────────────────────────────┘
┌────────────────────────────┬────────────────────────────────┐
│                            │                                │
│      Video Player          │     Learning Tools             │
│                            │   ┌──────────────────────┐     │
│  [Video with Controls]     │   │ Quiz | Flashcard     │     │
│                            │   └──────────────────────┘     │
│                            │   [Interactive Preview]         │
│                            │                                │
└────────────────────────────┴────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│         [Transcript | Audio Player | Mind Map]              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              Content Area (Full Width)                      │
│         • Transcript with auto-scroll                       │
│         • Audio player with controls                        │
│         • Interactive mindmap                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Props**:
```javascript
{
  exportData: object,  // Complete config + content
  onBack: function     // Return to main view
}
```

**State**:
```javascript
// Video player
currentTime: number
duration: number
activeSegmentIndex: number

// Audio player
isAudioPlaying: boolean
audioCurrentTime: number
audioDuration: number

// UI
activeTab: 'quiz' | 'flashcard'
activeContentTab: 'transcript' | 'audio' | 'mindmap'
```

**Key Layout Features**:
- **First Row**: Video player (left) and Learning Tools panel (right) displayed side-by-side
  - Video takes ~60% width, Learning Tools takes ~40% width
  - Both cards have equal height, aligned at the top
  - Learning Tools panel has internal scrolling for quiz/flashcard content
- **Second Row**: Full-width tabbed content area
  - Tabs for Transcript, Audio Player, and Mind Map
  - Content stretches across entire page width
  - Each tab shows its respective content card

**Learning Tools Panel**:
- Styled to match other cards on the page (white background, subtle shadow)
- Features Quiz/Flashcard tab switcher
- Content area scrolls vertically (no page-level scroll)
- Displays interactive quiz or flashcard preview based on selected tab

**Audio Player Details**:
- The audio player uses the same visual style (`podcastStyle`) selected in the main application
- Located in the second row as a full-width tab option
- **Dynamically loads audio** based on podcast configuration (language, voice, multispeaker, backgroundMusic)
- Uses the same URL generation logic as the main Podcast component
- Reuses podcast CSS classes for consistent styling across all 8 visual themes
- Features: play/pause, time display, progress slider, seek functionality

---

## 🔄 Data Flow

### State Flow Diagram

```
User Interaction (SidePanel)
         ↓
    State Update (App.js)
         ↓
    Props to Child Components
         ↓
    Component Re-render
         ↓
    Visual Update
```

### Example: Changing Quiz Type

```
1. User clicks "Risposta Multipla" in SidePanel
   ↓
2. SidePanel calls setQuizType('multi')
   ↓
3. App.js state updates: quizType = 'multi'
   ↓
4. useEffect detects change → disables immediate feedback
   ↓
5. renderQuiz() called → returns <MultiQuiz {...commonProps} />
   ↓
6. MultiQuiz renders with new props
```

### Example: Shuffling Flashcards

```
1. User clicks shuffle button in SidePanel
   ↓
2. SidePanel calls onShuffle() (prop from App)
   ↓
3. App.handleShuffle() calls flashcardRef.current.shuffleFlashcards()
   ↓
4. Flashcard component receives imperative call
   ↓
5. Flashcard shuffles array, resets state
   ↓
6. Flashcard re-renders with shuffled order
```

### Data Loading

All content data is **imported statically** at build time:

```javascript
// In App.js
import quizData from './data/quiz.json';
import flashcardData from './data/flashcard.json';
import transcriptData from './data/transcript.json';
```

Components read from these imported objects directly.

---

## 🎨 Styling System

### Visual Styles (Themes)

8 distinct visual styles available:

1. **Playful** (`playful`): Colorful, fun, gradient backgrounds
2. **Tech** (`tech`): Dark theme, monospace fonts, code-like
3. **Corporate** (`corporate`): Professional, minimal, business-like
4. **Picasso** (`picasso`): Artistic, bold shadows, unique shapes
5. **Illustrated** (`illustrated`): Hand-drawn feel, bold borders
6. **Schoolr** (`schoolr`): Educational, warm colors
7. **PLAI** (`plai`): Modern, clean, subtle gradients
8. **Studenti** (`studenti`): Student-friendly, organized layout

### Style Implementation

Each component implements styles using **CSS class prefixes**:

```javascript
// Example from Flashcard component
const prefix = visualStyle; // e.g., 'playful'

return (
  <div className={`${prefix}-flashcard-wrapper`}>
    <div className={`${prefix}-flashcard-container`}>
      <button className={`${prefix}-flashcard-flip-btn`}>
        ...
      </button>
    </div>
  </div>
);
```

### CSS Organization

Styles are defined in multiple files:

- `App.css`: Global layout, navigation, container styles
- `Styles.css`: Quiz-specific styles for all visual styles
- `SidePanel.css`: SidePanel component styles
- `Podcast.css`: Podcast player styles
- `ExportView.css`: Export view styles
- Component folders may contain additional styles

### Style Classes Pattern

For each visual style and component:

```css
/* Playful Flashcard Example */
.playful-flashcard-wrapper { /* container */ }
.playful-flashcard-container { /* main */ }
.playful-flashcard-header { /* header */ }
.playful-flashcard-card { /* card */ }
.playful-flashcard-front { /* front face */ }
.playful-flashcard-back { /* back face */ }
.playful-flashcard-nav-btn { /* buttons */ }

/* Tech Flashcard Example */
.tech-flashcard-wrapper { /* ... */ }
.tech-flashcard-container { /* ... */ }
/* ... same structure, different styles */
```

### Responsive Design

Media queries for different screen sizes:

```css
@media (max-width: 1280px) { /* Desktop */ }
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 640px)  { /* Mobile */ }
```

---

## 📊 State Management

### State Location

All state is **centralized in App.js** using React's `useState` hook.

**No external state management libraries** (Redux, Zustand, etc.) are used.

### Prop Drilling

State flows down through props:

```javascript
App (state)
 ↓ props
Child Components (read/update via callbacks)
```

### Refs for Imperative Actions

Used when parent needs to call child methods:

```javascript
// In App.js
const flashcardRef = useRef(null);

<Flashcard ref={flashcardRef} {...props} />

// Later:
flashcardRef.current.shuffleFlashcards();
```

### Effect Hooks

Used for side effects:

```javascript
// Auto-disable immediate feedback for multi-quiz
useEffect(() => {
  if (quizType === 'multi' && prevQuizType !== 'multi') {
    previousFeedbackStateRef.current = immediateFeedbackEnabled;
    setImmediateFeedbackEnabled(false);
  }
  // ... restore logic
}, [quizType, immediateFeedbackEnabled]);
```

### Mindmap State Management

Mindmap uses **custom hooks** for organization:

```javascript
// useMindmapState.js - Returns all state variables
const state = useMindmapState();

// useMindmapHandlers.js - Returns all handler functions
const handlers = useMindmapHandlers(state);

// In Mindmap.js
const state = useMindmapState();
const handlers = useMindmapHandlers(state);
```

This pattern keeps the main Mindmap component clean while managing complex interactions.

---

## 📄 Data Files

### quiz.json

**Structure**:
```json
{
  "quiz": [
    {
      "id": 1,
      "question": "Question text?",
      "options": [
        {
          "id": "A",
          "text": "Answer text",
          "is_correct": true,
          "explanation": "Why this is correct/incorrect"
        }
        // ... more options
      ]
    }
    // ... more questions
  ]
}
```

**Key Fields**:
- `id`: Unique question identifier (number)
- `question`: Question text (string)
- `options`: Array of answer objects
  - `id`: Answer identifier (A, B, C, etc.)
  - `text`: Answer text
  - `is_correct`: Boolean flag
  - `explanation`: Feedback text

### flashcard.json

**Structure**:
```json
{
  "flashcards": [
    {
      "front": "Question or prompt",
      "back": "Answer or explanation",
      "question": "Alternative field name",
      "answer": "Alternative field name"
    }
    // ... more flashcards
  ]
}
```

**Note**: Supports both `front/back` and `question/answer` field names for flexibility.

### mindmap.json

**Structure**:
```json
{
  "nodes": [
    {
      "id": "node-1",
      "text": "Node label",
      "color": "#hexcolor",
      "icon": "emoji",
      "position": { "x": 100, "y": 100 },
      "description": "Optional tooltip text"
    }
    // ... more nodes
  ],
  "connections": [
    {
      "from": "node-1",
      "to": "node-2",
      "label": "Relationship description"
    }
    // ... more connections
  ]
}
```

### transcript.json

**Structure**:
```json
{
  "title": "Podcast title",
  "description": "Episode description",
  "duration": "15:30",
  "publishedDate": "14 Nov 2025",
  "transcript": [
    {
      "time": "0:00",
      "speaker": "Host",
      "text": "Transcript text..."
    }
    // ... more transcript entries
  ]
}
```

---

## 🔧 How to Modify

### Adding a New Visual Style

1. **Define the style in App.js**:
```javascript
const visualStyles = {
  // ... existing styles
  newstyle: { name: 'New Style' }
};
```

2. **Add CSS classes** in appropriate stylesheet:
```css
/* For Flashcards - in Styles.css or component CSS */
.newstyle-flashcard-wrapper { /* ... */ }
.newstyle-flashcard-container { /* ... */ }
.newstyle-flashcard-header { /* ... */ }
/* ... all necessary classes */
```

3. **Implement in component** (if needed):
```javascript
// In Flashcard.js
if (visualStyle === 'newstyle') {
  return (
    <div className="newstyle-flashcard-wrapper">
      {/* New style JSX */}
    </div>
  );
}
```

4. **Add icon** in SidePanel.js:
```javascript
<span className="quiz-type-icon">
  {key === 'newstyle' && '🎭'}
</span>
```

### Adding a New Quiz Type

1. **Create component** in `src/components/Quiz/`:
```javascript
// NewTypeQuiz.js
import React, { useState, useEffect } from 'react';
import quizData from '../../data/quiz.json';

const NewTypeQuiz = ({ 
  visualStyle, 
  timerEnabled, 
  timerDuration,
  immediateFeedbackEnabled,
  answersCount,
  correctPoints,
  incorrectPoints
}) => {
  // Your implementation
  return (
    <div className={`${visualStyle}-quiz`}>
      {/* Quiz UI */}
    </div>
  );
};

export default NewTypeQuiz;
```

2. **Export in index.js**:
```javascript
// src/components/Quiz/index.js
export { default as NewTypeQuiz } from './NewTypeQuiz';
```

3. **Import in App.js**:
```javascript
import { SingleQuiz, MultiQuiz, TrueFalseQuiz, OutlinedQuiz, NewTypeQuiz } from './components/Quiz';
```

4. **Add to renderQuiz**:
```javascript
switch (quizType) {
  // ... existing cases
  case 'newtype':
    return <NewTypeQuiz key={quizKey} {...commonProps} />;
  default:
    return <SingleQuiz key={quizKey} {...commonProps} />;
}
```

5. **Add to SidePanel**:
```javascript
const quizTypes = [
  // ... existing types
  { 
    id: 'newtype', 
    name: 'New Type', 
    icon: '🆕', 
    description: 'Description of new type' 
  }
];
```

6. **Add CSS styles** for each visual style:
```css
.playful-newtype-quiz { /* ... */ }
.tech-newtype-quiz { /* ... */ }
/* ... etc */
```

### Modifying Quiz Questions

Simply edit `src/data/quiz.json`:

```json
{
  "quiz": [
    {
      "id": 999,
      "question": "Your new question?",
      "options": [
        {
          "id": "A",
          "text": "Option A",
          "is_correct": true,
          "explanation": "This is correct because..."
        },
        {
          "id": "B",
          "text": "Option B",
          "is_correct": false,
          "explanation": "This is incorrect because..."
        }
      ]
    }
  ]
}
```

The app will automatically load the new questions on next build/reload.

### Adding Flashcard Modes

1. **Update SidePanel**:
```javascript
const flashcardModes = [
  // ... existing modes
  { 
    id: 'newmode', 
    name: 'New Mode', 
    icon: '✨', 
    description: 'Description' 
  }
];
```

2. **Update Flashcard logic**:
```javascript
// In Flashcard.js
// Add mode-specific logic if needed
if (mode === 'newmode') {
  // Custom behavior
}
```

### Customizing Timer

Modify in `SidePanel.js`:

```javascript
<select 
  value={timerDuration}
  onChange={(e) => setTimerDuration(Number(e.target.value))}>
  <option value={60}>1 minuto</option>
  <option value={300}>5 minuti</option>
  <option value={600}>10 minuti</option>
  <option value={1800}>30 minuti</option> {/* NEW */}
</select>
```

### Adding Mindmap Features

1. **Add state** in `useMindmapState.js`
2. **Add handlers** in `useMindmapHandlers.js`
3. **Update UI** in `Mindmap.js` or sub-components
4. **Update controls** in `MindmapControls.js` or `NodeCustomization.js`

Example - Adding node size control:

```javascript
// In useMindmapState.js
const [nodeSize, setNodeSize] = useState('medium');

// In useMindmapHandlers.js
const handleSizeChange = (nodeId, newSize) => {
  setNodes(prev => prev.map(node => 
    node.id === nodeId ? { ...node, size: newSize } : node
  ));
};

// Return in handlers
return {
  // ... existing handlers
  handleSizeChange,
  setNodeSize
};

// In NodeCustomization.js
<button onClick={() => handleSizeChange(selectedNode, 'large')}>
  Large
</button>
```

---

## 🎯 Key Patterns

### 1. Visual Style Pattern

All components receive `visualStyle` prop and use it for CSS class prefixes:

```javascript
<div className={`${visualStyle}-component-element`}>
```

### 2. Conditional Rendering by Style

For components with dramatically different layouts per style:

```javascript
if (visualStyle === 'playful') return <PlayfulVersion />;
if (visualStyle === 'tech') return <TechVersion />;
// ... etc
```

### 3. Common Props Pattern

Quiz components receive standardized props:

```javascript
const commonProps = {
  visualStyle,
  timerEnabled,
  timerDuration,
  immediateFeedbackEnabled,
  answersCount,
  correctPoints,
  incorrectPoints
};
```

### 4. Ref Communication Pattern

Parent calls child methods via refs:

```javascript
// Parent
const childRef = useRef(null);
<Child ref={childRef} />
childRef.current.methodName();

// Child
useImperativeHandle(ref, () => ({
  methodName: () => { /* implementation */ }
}));
```

### 5. Context-Sensitive SidePanel

SidePanel content changes based on `currentPage`:

```javascript
{currentPage === 'quiz' && <QuizControls />}
{currentPage === 'flashcard' && <FlashcardControls />}
{currentPage === 'mindmap' && <MindmapControls />}
```

### 6. Timer Pattern

Consistent across Quiz and Flashcard components:

```javascript
const [timeRemaining, setTimeRemaining] = useState(timerDuration);

useEffect(() => {
  if (timerEnabled && timeRemaining > 0) {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Handle timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }
}, [timerEnabled, timeRemaining]);
```

### 7. State Update Pattern with Previous Value

```javascript
setNodes(prev => prev.map(node => 
  node.id === targetId 
    ? { ...node, updatedField: newValue }
    : node
));
```

### 8. Key Reset Pattern

Force component remount by changing key:

```javascript
const quizKey = `quiz-${immediateFeedbackEnabled}`;
return <SingleQuiz key={quizKey} {...props} />;
```

When `immediateFeedbackEnabled` changes, React unmounts old component and mounts new one with fresh state.

---

## 🚀 Running the Application

### Development
```bash
npm install
npm start
```

Runs on `http://localhost:3000`

### Production Build
```bash
npm run build
```

Creates optimized build in `build/` directory

### Testing
```bash
npm test
```

---

## 🔑 Key Files for Modifications

| Task | Files to Modify |
|------|----------------|
| Add quiz questions | `src/data/quiz.json` |
| Add flashcards | `src/data/flashcard.json` |
| Change mindmap structure | `src/data/mindmap.json` |
| Add visual style | `App.js`, `Styles.css`, `SidePanel.js` |
| Modify layout | `App.css` |
| Add quiz type | `src/components/Quiz/`, `App.js`, `SidePanel.js` |
| Change timer options | `SidePanel.js` |
| Modify export format | `App.js` (handleExport) |
| Change scoring | `SidePanel.js`, Quiz components |
| Update mindmap interactions | `src/components/Mindmap/hooks/` |

---

## 📚 Additional Notes

### Language
The UI is primarily in **Italian**. Text labels can be found in:
- Component JSX (hardcoded strings)
- SidePanel.js (control labels)
- Data JSON files (questions/answers)

### Browser Compatibility
- Modern browsers with ES6+ support
- CSS Grid and Flexbox required
- CSS 3D transforms for flashcard flip

### Performance Considerations
- All data loaded at build time (no API calls)
- State updates trigger re-renders (standard React behavior)
- Mindmap can be intensive with many nodes (uses SVG + DOM)
- No virtualization (all items rendered)

### Accessibility
- Semantic HTML elements used
- Keyboard navigation not fully implemented
- ARIA labels could be improved
- Color contrast may vary by visual style

### Future Enhancement Areas
- Actual audio file integration for Podcast
- Internationalization (i18n)
- Local storage for progress persistence
- Animation performance optimization
- Accessibility improvements
- Mobile touch interactions refinement
- Dark mode toggle (separate from visual styles)

---

## 🤖 For AI Assistants

When modifying this codebase:

1. **Preserve visual style system**: All 8 styles should work for any changes
2. **Maintain prop consistency**: Don't break existing prop interfaces
3. **Keep centralized state**: State should remain in App.js
4. **Follow naming conventions**: Use kebab-case for CSS, camelCase for JS
5. **Test all modes**: Changes should work across Quiz/Flashcard/Mindmap/Podcast
6. **Respect data structure**: Don't break JSON file formats
7. **Consider responsive design**: Test changes on mobile/tablet
8. **Update this documentation**: Document any architectural changes

---

## 📞 Summary

MemorAIz is a **React-based educational tool** with:
- 4 learning modes
- 8 visual styles per mode
- Static JSON content
- Centralized state management
- CSS-based theming
- Export functionality

The codebase is **well-organized** with clear separation of concerns and consistent patterns throughout. Modifications should be straightforward by following the established patterns documented above.

**Key Philosophy**: Flexibility through visual styles, simplicity through centralized state, extensibility through component composition.

---

## 📝 Recent Changes

### November 16, 2025 - Dynamic Audio URL Implementation

#### Podcast Component Enhancement
- **Extended props** to accept `voice` and `multispeaker` in addition to existing props
- **Implemented dynamic audio URL generation**:
  - Base URL: `https://cdn.memoraiz.com/audio/PLAI/`
  - URL pattern: `{language}_{voiceType}{_with_bgm}.mp3`
  - Supports 4 languages: italian, brazilian, english, chinese
  - Voice types: dialogue (multispeaker), male (uomo), female (donna)
  - Background music suffix: `_with_bgm` when enabled
- **Removed hardcoded audio placeholder** (`your-audio-file.mp3`)
- Added helper function `buildPodcastAudioUrl()` for URL generation

#### App.js Updates
- **Updated Podcast component usage** to pass `voice` and `multispeaker` props
- Ensures all podcast configuration values flow from SidePanel selections to component

#### ExportView Component Enhancement
- **Implemented matching dynamic audio URL logic** for consistency
- **Removed hardcoded schoolr audio URL** (`https://cdn.memoraiz.com/audio/schoolr/course-summaries/es/31363-103.mp3`)
- Added same helper function `buildPodcastAudioUrl()` as Podcast component
- Audio player now respects exported podcast configuration

#### Adding New Languages or Voice Types
To add support for new languages or voice types:
1. **Update `languageMap`** in both `Podcast.js` and `ExportView.js`
2. **Ensure audio files exist** at CDN following naming convention
3. **Update SidePanel.js** to include new language option in dropdown
4. **Test all combinations** to verify URL generation

### November 16, 2025 - ExportView Layout Restructure and Styling Updates

#### Layout Restructure (Two-Row Design)
- **Restructured ExportView layout** from sidebar-based to two-row grid layout:
  - **First row**: Video player (left) and Learning Tools panel (right) side-by-side
  - **Second row**: Full-width tabbed content area (Transcript/Audio/Mindmap)
- Updated CSS grid structure:
  - `.export-view-body`: Changed from grid to flex column layout
  - `.export-first-row`: Grid with `1.5fr` (video) and `1.3fr` (learning tools)
  - `.export-second-row`: Full-width flex column for tabbed content
- Removed sticky positioning from Learning Tools panel
- Learning Tools panel now has fixed height matching video player height

#### Styling Updates (Learning Tools Panel)
- **Restyled Learning Tools sidebar** to match page aesthetic:
  - Changed from dark theme (`#020617` background) to light theme (`#ffffff`)
  - Updated borders to use `var(--card-border)` (`#dfe1e6`)
  - Reduced shadow intensity: `rgba(15, 23, 42, 0.06)` instead of `0.55`
  - Adjusted header border to light gray: `#e5e7eb`
- **Updated text colors** for light background:
  - Title: `#111827` (dark gray)
  - Subtitle: `#6b7280` (medium gray)
- **Redesigned tabs** to match content tabs style:
  - Light background: `#f9fafb`
  - Border: `#e5e7eb`
  - Active state: `#f3f4f6` background with `#111827` text
- **Updated scrollbar styling** for light theme:
  - Track: `#f3f4f6`
  - Thumb: `#d1d5db`
  - Thumb hover: `#9ca3af`

#### Audio Player Integration
- Audio player component positioned in second row as tab option
- Matches podcast visual style selected in main application
- Plays audio from: `https://cdn.memoraiz.com/audio/schoolr/course-summaries/es/31363-103.mp3`
- Reuses existing podcast CSS classes for all 8 visual themes
- Includes full controls: play/pause, progress slider, time display

---

*Last Updated: November 16, 2025*
*Version: 1.0.1*

