import React, { useState, useRef } from 'react';
import './styles/App.css';

import { SingleQuiz, MultiQuiz, TrueFalseQuiz, OutlinedQuiz } from './components/Quiz';
import SidePanel from './components/SidePanel';
import Flashcard from './components/Flashcard';
import Mindmap from './components/Mindmap';
import Podcast from './components/Podcast';
import ExportView from './components/ExportView';

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
//   dark: {
//     name: 'Dark Mode',
//     primary: '#3b82f6',
//     primaryForeground: '#ffffff',
//     secondary: '#1e40af',
//     background: '#1f2937',
//     cardBorder: '#374151',
//     muted: '#374151',
//     mutedBorder: '#4b5563',
//     foreground: '#f9fafb',
//     popoverForeground: '#ffffff',
//     success: '#10b981',
//     successForeground: '#ffffff',
//     warning: '#f59e0b',
//     warningForeground: '#ffffff'
//   }
};

function App() {
  const [currentPage, setCurrentPage] = useState('quiz');
  const [quizType, setQuizType] = useState('single');
  const [flashcardMode, setFlashcardMode] = useState('normal');
  const [colorPalette, setColorPalette] = useState('default');
  const [currentTheme, setCurrentTheme] = useState(colorPalettes.default);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [immediateFeedbackEnabled, setImmediateFeedbackEnabled] = useState(true);
  const [showNodeDetails, setShowNodeDetails] = useState(true);
  const [showConnectionLabels, setShowConnectionLabels] = useState(true);
  const [dynamicMapEnabled, setDynamicMapEnabled] = useState(true);
  const [podcastTranscript, setPodcastTranscript] = useState('simple');
  const [podcastVoice, setPodcastVoice] = useState('uomo');
  const [podcastMultispeaker, setPodcastMultispeaker] = useState(true);
  const [showExportView, setShowExportView] = useState(false);
  const [exportData, setExportData] = useState(null);
  const flashcardRef = useRef(null);
  const mindmapRef = useRef(null);
  const previousFeedbackStateRef = useRef(true); // Usa ref per non triggerare re-render
  const previousQuizTypeRef = useRef('single'); // Traccia il tipo di quiz precedente

  const handleShuffle = () => {
    if (flashcardRef.current && flashcardRef.current.shuffleFlashcards) {
      flashcardRef.current.shuffleFlashcards();
    }
  };

  const handleExport = () => {
    const quizTypeNames = {
      'single': 'Risposta Singola',
      'multi': 'Risposta Multipla',
      'truefalse': 'Vero/Falso',
      'outlined': 'Riquadri Contornati'
    };

    const flashcardModeNames = {
      'normal': 'Domanda classica',
      'fillblank': 'Riempi lo spazio',
      'mix': 'Mix'
    };

    const podcastTranscriptNames = {
      'none': 'Nessuno',
      'simple': 'Semplice',
      'detailed': 'Dettagliato'
    };

    const data = {
      exportDate: new Date().toLocaleString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      quiz: {
        funzionalità: quizTypeNames[quizType] || quizType,
        stile: colorPalettes[colorPalette].name,
        dettagli: {
          timer: timerEnabled,
          feedbackImmediato: immediateFeedbackEnabled
        }
      },
      flashcard: {
        funzionalità: flashcardModeNames[flashcardMode] || flashcardMode,
        stile: colorPalettes[colorPalette].name,
        dettagli: {
          timer: timerEnabled
        }
      },
      mindmap: {
        funzionalità: dynamicMapEnabled ? 'Dinamica' : 'Statica',
        stile: colorPalettes[colorPalette].name,
        dettagli: {
          dettagliNodo: showNodeDetails,
          etichetteRelazioni: showConnectionLabels
        }
      },
      podcast: {
        funzionalità: podcastTranscriptNames[podcastTranscript] || podcastTranscript,
        stile: colorPalettes[colorPalette].name,
        dettagli: {
          voce: podcastVoice,
          multispeaker: podcastMultispeaker
        }
      }
    };

    setExportData(data);
    setShowExportView(true);
  };

  const handleBackFromExport = () => {
    setShowExportView(false);
  };

  // Update theme when color palette changes
  React.useEffect(() => {
    setCurrentTheme(colorPalettes[colorPalette]);
  }, [colorPalette]);

  // Gestione feedback immediato per quiz con risposta multipla
  React.useEffect(() => {
    const prevQuizType = previousQuizTypeRef.current;
    
    // Quando passiamo a 'multi' da un altro tipo
    if (quizType === 'multi' && prevQuizType !== 'multi') {
      // Salva lo stato corrente e disattiva feedback immediato
      previousFeedbackStateRef.current = immediateFeedbackEnabled;
      setImmediateFeedbackEnabled(false);
    } 
    // Quando usciamo da 'multi' verso un altro tipo
    else if (quizType !== 'multi' && prevQuizType === 'multi') {
      // Ripristina lo stato precedente
      setImmediateFeedbackEnabled(previousFeedbackStateRef.current);
    }
    // Quando NON siamo in 'multi', aggiorna il valore salvato se l'utente cambia il toggle
    else if (quizType !== 'multi') {
      previousFeedbackStateRef.current = immediateFeedbackEnabled;
    }
    
    // Aggiorna il tipo di quiz precedente
    previousQuizTypeRef.current = quizType;
  }, [quizType, immediateFeedbackEnabled]);

  const renderQuiz = () => {
    const commonProps = {
      theme: currentTheme,
      timerEnabled,
      immediateFeedbackEnabled
    };

    const quizKey = `quiz-${immediateFeedbackEnabled}`; // Reset quiz when immediate feedback changes

    switch (quizType) {
      case 'single':
        return <SingleQuiz key={quizKey} {...commonProps} />;
      case 'multi':
        return <MultiQuiz key={quizKey} {...commonProps} />;
      case 'truefalse':
        return <TrueFalseQuiz key={quizKey} {...commonProps} />;
      case 'outlined':
        return <OutlinedQuiz key={quizKey} {...commonProps} />;
      default:
        return <SingleQuiz key={quizKey} {...commonProps} />;
    }
  };

  const renderContent = () => {
    if (showExportView && exportData) {
      return <ExportView exportData={exportData} onBack={handleBackFromExport} />;
    }
    
    if (currentPage === 'quiz') {
      return renderQuiz();
    } else if (currentPage === 'flashcard') {
      return <Flashcard ref={flashcardRef} theme={currentTheme} mode={flashcardMode} timerEnabled={timerEnabled} />;
    } else if (currentPage === 'mindmap') {
      return <Mindmap ref={mindmapRef} theme={currentTheme} showNodeDetails={showNodeDetails} showConnectionLabels={showConnectionLabels} dynamicMapEnabled={dynamicMapEnabled} />;
    } else if (currentPage === 'podcast') {
      return <Podcast theme={currentTheme} />;
    }
    return renderQuiz();
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
        <div className="main-content">
          {!showExportView && (
            <div className="navigation-buttons">
              <button
                className={`nav-button ${currentPage === 'quiz' ? 'active' : ''}`}
                onClick={() => setCurrentPage('quiz')}
              >
                Quiz
              </button>
              <button
                className={`nav-button ${currentPage === 'flashcard' ? 'active' : ''}`}
                onClick={() => setCurrentPage('flashcard')}
              >
                Flashcard
              </button>
              <button
                className={`nav-button ${currentPage === 'mindmap' ? 'active' : ''}`}
                onClick={() => setCurrentPage('mindmap')}
              >
                Mindmap
              </button>
              <button
                className={`nav-button ${currentPage === 'podcast' ? 'active' : ''}`}
                onClick={() => setCurrentPage('podcast')}
              >
                Podcast
              </button>
            </div>
          )}
          <div className="content-container">
            {renderContent()}
          </div>
        </div>
        {!showExportView && (
          <SidePanel
            currentPage={currentPage}
            quizType={quizType}
            setQuizType={setQuizType}
            flashcardMode={flashcardMode}
            setFlashcardMode={setFlashcardMode}
            onShuffle={handleShuffle}
            colorPalette={colorPalette}
            setColorPalette={setColorPalette}
            colorPalettes={colorPalettes}
            timerEnabled={timerEnabled}
            setTimerEnabled={setTimerEnabled}
            immediateFeedbackEnabled={immediateFeedbackEnabled}
            setImmediateFeedbackEnabled={setImmediateFeedbackEnabled}
            showNodeDetails={showNodeDetails}
            setShowNodeDetails={setShowNodeDetails}
            showConnectionLabels={showConnectionLabels}
            setShowConnectionLabels={setShowConnectionLabels}
            dynamicMapEnabled={dynamicMapEnabled}
            setDynamicMapEnabled={setDynamicMapEnabled}
            podcastTranscript={podcastTranscript}
            setPodcastTranscript={setPodcastTranscript}
            podcastVoice={podcastVoice}
            setPodcastVoice={setPodcastVoice}
            podcastMultispeaker={podcastMultispeaker}
            setPodcastMultispeaker={setPodcastMultispeaker}
            onExport={handleExport}
          />
        )}
      </div>
    </div>
  );
}

export default App;