import React, { useState, useRef } from 'react';
import './styles/App.css';
import './styles/Styles.css';

import { SingleQuiz, MultiQuiz, TrueFalseQuiz, OutlinedQuiz } from './components/Quiz';
import SidePanel from './components/SidePanel';
import Flashcard from './components/Flashcard';
import Mindmap from './components/Mindmap';

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
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [immediateFeedbackEnabled, setImmediateFeedbackEnabled] = useState(true);
  const [showNodeDetails, setShowNodeDetails] = useState(true);
  const [showConnectionLabels, setShowConnectionLabels] = useState(true);
  const [dynamicMapEnabled, setDynamicMapEnabled] = useState(true);
  const flashcardRef = useRef(null);
  const mindmapRef = useRef(null);
  const previousFeedbackStateRef = useRef(true); // Usa ref per non triggerare re-render
  const previousQuizTypeRef = useRef('single'); // Traccia il tipo di quiz precedente

  const handleShuffle = () => {
    if (flashcardRef.current && flashcardRef.current.shuffleFlashcards) {
      flashcardRef.current.shuffleFlashcards();
    }
  };

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
    if (currentPage === 'quiz') {
      return renderQuiz();
    } else if (currentPage === 'flashcard') {
      return <Flashcard ref={flashcardRef} visualStyle={flashcardStyle} mode={flashcardMode} timerEnabled={timerEnabled} />;
    } else if (currentPage === 'mindmap') {
      return <Mindmap ref={mindmapRef} visualStyle={mindmapStyle} showNodeDetails={showNodeDetails} showConnectionLabels={showConnectionLabels} dynamicMapEnabled={dynamicMapEnabled} />;
    }
    return renderQuiz();
  };

  return (
    <div className="app">
      <div className="app-container">
        <div className="main-content">
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
          </div>
          <div className="content-container">
            {renderContent()}
          </div>
        </div>
        <SidePanel
          currentPage={currentPage}
          quizType={quizType}
          setQuizType={setQuizType}
          flashcardMode={flashcardMode}
          setFlashcardMode={setFlashcardMode}
          onShuffle={handleShuffle}
          quizStyle={quizStyle}
          setQuizStyle={setQuizStyle}
          flashcardStyle={flashcardStyle}
          setFlashcardStyle={setFlashcardStyle}
          mindmapStyle={mindmapStyle}
          setMindmapStyle={setMindmapStyle}
          visualStyles={visualStyles}
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
        />
      </div>
    </div>
  );
}

export default App;