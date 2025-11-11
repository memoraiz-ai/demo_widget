# Quiz App

A React application featuring multiple quiz types with customizable color palettes.

## Features

### Funzionalità

- **Single Answer**: Traditional multiple choice with radio buttons
- **Multiple Answer**: Select all that apply with checkboxes
- **True/False**: Binary choice with styled true/false buttons
- **Outlined Boxes**: Modern card-based selection with checkmarks

### Color Themes

- **Default Blue**: Classic blue theme
- **Purple Dream**: Modern purple accent
- **Forest Green**: Natural green palette
- **Dark Mode**: Dark theme for low-light environments

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:



```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### SidePanel Controls

- **Quiz Type Selection**: Click on any quiz type card to switch between different quiz formats
- **Color Palette**: Choose from 4 predefined color themes
- **Quick Stats**: View current mode and theme information
- **Reset Button**: Return to default single quiz with blue theme

### Quiz Features

- **Timer**: Each quiz has a countdown timer
- **Progress Bar**: Visual progress through questions
- **Score Tracking**: Points awarded for correct answers
- **Navigation**: Previous/Next buttons for quiz flow
- **Interactive Feedback**: Immediate visual and textual feedback
- **Responsive Design**: Works on desktop, tablet, and mobile

## Project Structure

```

src/
├── components/
│   ├── SingleQuiz.js      # Single answer quiz component
│   ├── MultiQuiz.js       # Multiple answer quiz component
│   ├── TrueFalseQuiz.js   # True/False quiz component
│   ├── OutlinedQuiz.js    # Outlined boxes quiz component
│   ├── SidePanel.js       # Settings and theme panel
│   ├── QuizBase.css       # Shared quiz styling
│   └── SidePanel.css      # Sidepanel specific styles
├── App.js                 # Main app component with theme management
├── App.css                # Global app styles
└── index.js               # App entry point
```

## Customization

### Adding New Quiz Types
1. Create a new component in `src/components/`
2. Import and add to the quiz types array in `App.js`
3. Add to the `quizTypes` array in `SidePanel.js`

### Adding New Color Themes
1. Define new theme object in the `colorPalettes` object in `App.js`
2. Include all required color properties
3. The theme will automatically appear in the sidepanel

### Required Theme Colors
- `primary`: Primary accent color
- `primaryForeground`: Text color for primary elements
- `secondary`: Secondary accent color
- `background`: Main background color
- `cardBorder`: Border color for cards and panels
- `muted`: Background for disabled elements
- `mutedBorder`: Border for disabled elements
- `foreground`: Main text color
- `popoverForeground`: Text for overlays and headers
- `successBackground`: Background for success states
- `successForeground`: Text for success states
- `warningBackground`: Background for warning/error states
- `warningForeground`: Text for warning/error states

## Technologies Used

- **React 18**: Modern React with hooks
- **CSS Custom Properties**: Dynamic theming
- **CSS Grid/Flexbox**: Responsive layouts
- **Geist Font**: Modern typography

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+