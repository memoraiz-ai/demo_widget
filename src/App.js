import React, { useState, useRef } from 'react';
import './styles/App.css';
import './styles/Styles.css';

import { SingleQuiz, MultiQuiz, TrueFalseQuiz, OutlinedQuiz } from './components/Quiz';
import SidePanel from './components/SidePanel';
import Flashcard from './components/Flashcard';
import Mindmap from './components/Mindmap';
import Podcast from './components/Podcast';
import ExportView from './components/ExportView';

// Static content used when exporting the configuration
import quizData from './data/quiz.json';
import flashcardData from './data/flashcard.json';
import transcriptData from './data/transcript.json';

// Define visual styles
const visualStyles = {
  playful: { name: 'Playful' },
  tech: { name: 'Tech' },
  corporate: { name: 'Corporate' },
  picasso: { name: 'Picasso' },
  illustrated: { name: 'Illustrated' },
  schoolr: { name: 'Schoolr' },
  plai: { name: 'PLAI' },
  studenti: { name: 'Studenti' }
};

function App() {
  const [currentPage, setCurrentPage] = useState('quiz');
  const [quizType, setQuizType] = useState('single');
  const [flashcardMode, setFlashcardMode] = useState('normal');
  const [quizStyle, setQuizStyle] = useState('playful');
  const [flashcardStyle, setFlashcardStyle] = useState('playful');
  const [mindmapStyle, setMindmapStyle] = useState('playful');
  const [podcastStyle, setPodcastStyle] = useState('playful');
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [timerDuration, setTimerDuration] = useState(300); // 5 minutes default
  const [immediateFeedbackEnabled, setImmediateFeedbackEnabled] = useState(true);
  const [answersCount, setAnswersCount] = useState(4); // Default number of answers for single/multi choice
  const [correctPoints, setCorrectPoints] = useState(1); // Default points for correct answers
  const [incorrectPoints, setIncorrectPoints] = useState(-1); // Default points for incorrect answers
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
      single: 'Risposta Singola',
      multi: 'Risposta Multipla',
      truefalse: 'Vero/Falso',
      outlined: 'Riquadri Contornati'
    };

    const flashcardModeNames = {
      normal: 'Domanda classica',
      fillblank: 'Riempi lo spazio',
      mix: 'Mix'
    };

    const podcastTranscriptNames = {
      none: 'Nessuno',
      simple: 'Semplice',
      detailed: 'Dettagliato'
    };

    const exportDate = new Date().toLocaleString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Structured export object used both for JSON download
    // and for configuring the ExportView page
    const data = {
      exportMetadata: {
        exportDate,
        source: 'MemorAIz – Custom widget demo'
      },
      summary: {
        quiz: {
          funzionalità: quizTypeNames[quizType] || quizType,
          stile: visualStyles[quizStyle].name,
          dettagli: {
            timer: timerEnabled,
            feedbackImmediato: immediateFeedbackEnabled
          }
        },
        flashcard: {
          funzionalità: flashcardModeNames[flashcardMode] || flashcardMode,
          stile: visualStyles[flashcardStyle].name,
          dettagli: {
            timer: timerEnabled
          }
        },
        mindmap: {
          funzionalità: dynamicMapEnabled ? 'Dinamica' : 'Statica',
          stile: visualStyles[mindmapStyle].name,
          dettagli: {
            dettagliNodo: showNodeDetails,
            etichetteRelazioni: showConnectionLabels
          }
        },
        podcast: {
          funzionalità: podcastTranscriptNames[podcastTranscript] || podcastTranscript,
          stile: visualStyles[podcastStyle].name,
          dettagli: {
            voce: podcastVoice,
            multispeaker: podcastMultispeaker
          }
        }
      },
      config: {
        quiz: {
          type: quizType,
          style: quizStyle,
          timerEnabled,
          timerDuration,
          immediateFeedbackEnabled,
          answersCount,
          correctPoints,
          incorrectPoints
        },
        flashcard: {
          mode: flashcardMode,
          style: flashcardStyle,
          timerEnabled,
          timerDuration
        },
        mindmap: {
          style: mindmapStyle,
          showNodeDetails,
          showConnectionLabels,
          dynamicMapEnabled
        },
        podcast: {
          style: podcastStyle,
          transcript: podcastTranscript,
          voice: podcastVoice,
          multispeaker: podcastMultispeaker
        }
      },
      content: {
        quiz: quizData.quiz,
        flashcards: flashcardData.flashcards,
        transcript: transcriptData
      }
    };

    setExportData(data);
    setShowExportView(true);
  };

  const handleBackFromExport = () => {
    setShowExportView(false);
  };

  // Update theme when color palette changes
//   React.useEffect(() => {
//     setCurrentTheme(visualStyles[quizStyle]);
//   }, [quizStyle]);

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
      visualStyle: quizStyle,
      timerEnabled,
      timerDuration,
      immediateFeedbackEnabled,
      answersCount,
      correctPoints,
      incorrectPoints
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
      return <Flashcard ref={flashcardRef} visualStyle={flashcardStyle} mode={flashcardMode} timerEnabled={timerEnabled} timerDuration={timerDuration} />;
    } else if (currentPage === 'mindmap') {
      return <Mindmap ref={mindmapRef} visualStyle={mindmapStyle} showNodeDetails={showNodeDetails} showConnectionLabels={showConnectionLabels} dynamicMapEnabled={dynamicMapEnabled} />;
    } else if (currentPage === 'podcast') {
      return <Podcast visualStyle={podcastStyle} />;
    }
    return renderQuiz();
  };

  return (
    <div className={`app ${showExportView ? 'export-mode' : ''}`}>
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
                // colorPalette={colorPalette}
                // setColorPalette={setColorPalette}
                // colorPalettes={colorPalettes}
                timerEnabled={timerEnabled}
                setTimerEnabled={setTimerEnabled}
                timerDuration={timerDuration}
                setTimerDuration={setTimerDuration}
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
                answersCount={answersCount}
                setAnswersCount={setAnswersCount}
                correctPoints={correctPoints}
                setCorrectPoints={setCorrectPoints}
                incorrectPoints={incorrectPoints}
                setIncorrectPoints={setIncorrectPoints}
                quizStyle={quizStyle}
                setQuizStyle={setQuizStyle}
                flashcardStyle={flashcardStyle}
                setFlashcardStyle={setFlashcardStyle}
                mindmapStyle={mindmapStyle}
                setMindmapStyle={setMindmapStyle}
                podcastStyle={podcastStyle}
                setPodcastStyle={setPodcastStyle}
                visualStyles={visualStyles}
            />
        )}
      </div>
    </div>
  );
}

export default App;