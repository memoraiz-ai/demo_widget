# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Essential Commands

**Package Manager**: npm (Create React App project)

```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:3000)
npm start

# Production build
npm run build

# Test runner (Jest via react-scripts)
npm test

# Note: Lint/format commands not configured in this repository
# Note: No test files exist in src/ directory - tests would need to be created
```

**Single test execution** (when tests exist):
```bash
npm test -- --testNamePattern="pattern"
npm test -- --watchAll=false  # CI mode
```

## High-Level Architecture

MemorAIz is a multi-modal educational platform built as a React SPA with centralized state management. The app supports 4 learning modes with 8 visual themes each.

```
JSON Content → App.js (State) → Mode Components → Themed UI
     ↑              ↓                    ↑            ↓
Content Files   SidePanel ←→ User Interactions → Export View
```

**Core Flow**:
- `src/App.js` centralizes all state (30+ state variables)
- Mode selection switches between Quiz/Flashcard/Mindmap/Podcast components
- `src/components/SidePanel/SidePanel.js` provides context-sensitive controls
- Static JSON imports from `src/data/` feed content to modes
- Export system creates structured JSON configuration

## Key Architectural Patterns

- **Centralized State**: All state lives in `App.js` using React hooks (no Redux/Context)
- **Prop Drilling**: State flows down via props, callbacks flow up
- **Conditional Rendering**: Components render different layouts per visual style
- **Ref Communication**: Parent triggers child methods via `useRef` (e.g., flashcard shuffle)
- **Static Import**: Content loaded via ES6 imports at build time
- **Command Pattern**: Export functionality structures complete app configuration

**State Management Strategy**:
- Mode state: `currentPage`, `quizType`, `flashcardMode`, `dynamicMapEnabled`
- Theme state: `quizStyle`, `flashcardStyle`, `mindmapStyle`, `podcastStyle`  
- Feature state: `timerEnabled`, `immediateFeedbackEnabled`, `showNodeDetails`
- Export state: `showExportView`, `exportData`

## Component Structure and Data Flow

```
App.js (state container)
├── Navigation buttons (mode switching)
├── Main content area
│   ├── Quiz modes: SingleQuiz, MultiQuiz, TrueFalseQuiz, OutlinedQuiz
│   ├── Flashcard (with shuffle via ref)
│   ├── Mindmap (with custom hooks: useMindmapState, useMindmapHandlers)  
│   ├── Podcast (with dynamic audio URL generation)
│   └── ExportView (two-row layout with video/transcript/interactive demos)
└── SidePanel (context-sensitive controls)
```

**Key Data Contracts**:
- Quiz content: `src/data/quiz.json` → `{id, question, options[{id, text, is_correct, explanation}]}`
- Flashcard content: `src/data/flashcard.json` → `{front, back, type}`
- Mindmap structure: `src/data/mindmap.json` → `{nodes[], connections[]}`
- Podcast data: `src/data/transcript.json` → `{title, description, transcript[]}`

## Visual Styling System (8 Themes)

**Theme Names** (defined in `src/App.js`):
`playful`, `tech`, `corporate`, `picasso`, `illustrated`, `schoolr`, `plai`, `studenti`

**Implementation**:
- CSS class prefixes: `.${visualStyle}-component-element`
- Example: `.playful-flashcard-wrapper`, `.tech-quiz-container`  
- Style files: `src/styles/App.css`, `src/styles/Styles.css`, component-specific CSS
- Runtime switching via state: `setQuizStyle()`, `setFlashcardStyle()`, etc.

**Adding New Themes**:
1. Add to `visualStyles` object in `src/App.js`
2. Implement CSS classes following `${themeName}-component-element` pattern
3. Add icon mapping in `src/components/SidePanel/SidePanel.js`

## Content Management

**Location**: `src/data/*.json` - all content statically imported

**Schemas**:
```javascript
// Quiz questions
{
  "quiz": [{
    "id": 1,
    "question": "Question text?",
    "options": [{
      "id": "A",
      "text": "Answer text", 
      "is_correct": true,
      "explanation": "Explanation text"
    }]
  }]
}

// Flashcards  
{
  "flashcards": [{
    "front": "Question",
    "back": "Answer",
    "type": "classic" | "cloze"
  }]
}

// Mindmap
{
  "nodes": [{"id": "node-1", "text": "Label", "position": {"x": 100, "y": 100}}],
  "connections": [{"from": "node-1", "to": "node-2", "label": "Relationship"}]
}
```

**Content Loading**: Static ES6 imports in `src/App.js` (no dynamic fetching)

## Export Functionality and Configuration

**Trigger**: Export button in SidePanel → `handleExport()` in `src/App.js`

**Export Structure**:
- `exportMetadata`: timestamp, source info
- `summary`: human-readable config per mode  
- `config`: technical settings (all state variables)
- `content`: complete quiz/flashcard/transcript data

**ExportView Component** (`src/components/ExportView/ExportView.js`):
- Two-row layout: Video/Transcript (top) + Interactive demos (bottom)
- Tabs: Quiz, Flashcards, Audio Player, Mindmap
- Download as JSON file functionality
- Live demo of each mode with selected configurations

**Configuration Flow**: App state → Export object → ExportView props → Interactive components

## Development Notes

**Important Patterns**:
- Multi-quiz immediate feedback: automatically disabled for `multi` type, restored when switching away
- Dynamic audio URLs: `https://cdn.memoraiz.com/audio/PLAI/{language}_{voiceType}{_with_bgm}.mp3`
- Mindmap interactions: drag nodes, zoom/pan, create connections, edit labels inline
- Visual style inheritance: each component checks `visualStyle` prop for conditional rendering

**Key Files for Modifications**:
- Add content: Edit JSON files in `src/data/`
- Add quiz types: Create component in `src/components/Quiz/`, update `src/App.js` renderQuiz
- Modify themes: Update CSS in `src/styles/`, add theme entry in `src/App.js`
- Export format: Modify `handleExport()` in `src/App.js`

**Architecture Constraints**: 
- UI text is in Italian
- No routing library - mode switching via state
- No external state management - all state in App.js
- Content is build-time static, not runtime dynamic