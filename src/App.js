import React, { useState } from 'react';
import './App.css';

import SingleQuiz from './components/SingleQuiz';
import MultiQuiz from './components/MultiQuiz';
import TrueFalseQuiz from './components/TrueFalseQuiz';
import OutlinedQuiz from './components/OutlinedQuiz';
import SidePanel from './components/SidePanel';

// Define color palettes
const colorPalettes = {
  default: {
    name: 'Default Blue',
    primary: '#21578c',
    primaryForeground: '#ffffff',
    secondary: '#21466e',
    background: '#ffffff',
    cardBorder: '#dfe1e6',
    muted: '#dfe1e6',
    mutedBorder: '#b4b8c5',
    foreground: '#303136',
    popoverForeground: '#111111',
    success: '#a2b99c',
    successForeground: '#121c12',
    warning: '#ff9359',
    warningForeground: '#440a06'
  },
  purple: {
    name: 'Purple Dream',
    primary: '#7c3aed',
    primaryForeground: '#ffffff',
    secondary: '#6d28d9',
    background: '#ffffff',
    cardBorder: '#e9d5ff',
    muted: '#f3e8ff',
    mutedBorder: '#d8b4fe',
    foreground: '#4c1d95',
    popoverForeground: '#2e1065',
    success: '#10b981',
    successForeground: '#064e3b',
    warning: '#f59e0b',
    warningForeground: '#78350f'
  },
  green: {
    name: 'Forest Green',
    primary: '#059669',
    primaryForeground: '#ffffff',
    secondary: '#047857',
    background: '#ffffff',
    cardBorder: '#d1fae5',
    muted: '#ecfdf5',
    mutedBorder: '#a7f3d0',
    foreground: '#064e3b',
    popoverForeground: '#022c22',
    success: '#10b981',
    successForeground: '#064e3b',
    warning: '#fbbf24',
    warningForeground: '#78350f'
  },
  dark: {
    name: 'Dark Mode',
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    secondary: '#1e40af',
    background: '#1f2937',
    cardBorder: '#374151',
    muted: '#374151',
    mutedBorder: '#4b5563',
    foreground: '#f9fafb',
    popoverForeground: '#ffffff',
    success: '#10b981',
    successForeground: '#ffffff',
    warning: '#f59e0b',
    warningForeground: '#ffffff'
  }
};

function App() {
  const [quizType, setQuizType] = useState('single');
  const [colorPalette, setColorPalette] = useState('default');
  const [currentTheme, setCurrentTheme] = useState(colorPalettes.default);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [immediateFeedbackEnabled, setImmediateFeedbackEnabled] = useState(true);

  // Update theme when color palette changes
  React.useEffect(() => {
    setCurrentTheme(colorPalettes[colorPalette]);
  }, [colorPalette]);

  const renderQuiz = () => {
    const commonProps = {
      theme: currentTheme,
      timerEnabled,
      immediateFeedbackEnabled,
      key: `quiz-${immediateFeedbackEnabled}` // Reset quiz when immediate feedback changes
    };

    switch (quizType) {
      case 'single':
        return <SingleQuiz {...commonProps} />;
      case 'multi':
        return <MultiQuiz {...commonProps} />;
      case 'truefalse':
        return <TrueFalseQuiz {...commonProps} />;
      case 'outlined':
        return <OutlinedQuiz {...commonProps} />;
      default:
        return <SingleQuiz {...commonProps} />;
    }
  };

  return (
    <div className="app" style={{
      '--primary': currentTheme.primary,
      '--primary-foreground': currentTheme.primaryForeground,
      '--secondary': currentTheme.secondary,
      '--background': currentTheme.background,
      '--card-border': currentTheme.cardBorder,
      '--muted': currentTheme.muted,
      '--muted-border': currentTheme.mutedBorder,
      '--foreground': currentTheme.foreground,
      '--popover-foreground': currentTheme.popoverForeground,
      '--success-background': currentTheme.success,
      '--success-foreground': currentTheme.successForeground,
      '--warning-background': currentTheme.warning,
      '--warning-foreground': currentTheme.warningForeground
    }}>
      <div className="app-container">
        <div className="quiz-container">
          {renderQuiz()}
        </div>
        <SidePanel
          quizType={quizType}
          setQuizType={setQuizType}
          colorPalette={colorPalette}
          setColorPalette={setColorPalette}
          colorPalettes={colorPalettes}
          timerEnabled={timerEnabled}
          setTimerEnabled={setTimerEnabled}
          immediateFeedbackEnabled={immediateFeedbackEnabled}
          setImmediateFeedbackEnabled={setImmediateFeedbackEnabled}
        />
      </div>
    </div>
  );
}

export default App;