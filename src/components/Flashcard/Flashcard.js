import React, { useState, useEffect, useRef, useImperativeHandle, useCallback } from 'react';

// Sample flashcard data for different modes - defined outside component to avoid re-creation
const normalFlashcards = [
  {
    question: "Qual è il pianeta più grande del nostro sistema solare?",
    answer: "Giove"
  },
  {
    question: "Qual è la capitale della Francia?",
    answer: "Parigi"
  },
  {
    question: "Chi ha dipinto la Gioconda?",
    answer: "Leonardo da Vinci"
  },
  {
    question: "Qual è il simbolo chimico dell'oro?",
    answer: "Au"
  }
];

const fillBlankFlashcards = [
  {
    question: "Il pianeta più grande del nostro sistema solare è _______.",
    answer: "Giove",
    blankWord: "Giove"
  },
  {
    question: "La capitale della Francia è _______.",
    answer: "Parigi",
    blankWord: "Parigi"
  },
  {
    question: "La Gioconda è stata dipinta da _______.",
    answer: "Leonardo da Vinci",
    blankWord: "Leonardo da Vinci"
  },
  {
    question: "Il simbolo chimico dell'oro è _______.",
    answer: "Au",
    blankWord: "Au"
  }
];

const mixFlashcards = [
  // Normal questions
  {
    question: "Qual è l'oceano più grande della Terra?",
    answer: "Oceano Pacifico",
    type: 'normal'
  },
  {
    question: "In che anno è finita la Seconda Guerra Mondiale?",
    answer: "1945",
    type: 'normal'
  },
  {
    question: "Chi ha dipinto la Gioconda?",
    answer: "Leonardo da Vinci"
  },
  {
    question: "Qual è il simbolo chimico dell'oro?",
    answer: "Au"
  },
  // Fill in the blank questions
  {
    question: "Chi ha scritto 'Romeo e Giulietta'? È stato scritto da _______.",
    answer: "William Shakespeare",
    type: 'fillblank',
    blankWord: "William Shakespeare"
  },
  {
    question: "Qual è la capitale del Giappone? La capitale è _______.",
    answer: "Tokyo",
    type: 'fillblank',
    blankWord: "Tokyo"
  },
  // More normal questions
  {
    question: "Quanti continenti ci sono sulla Terra?",
    answer: "Sette",
    type: 'normal'
  },
  {
    question: "Qual è la montagna più alta del mondo?",
    answer: "Monte Everest",
    type: 'normal'
  }
];

const Flashcard = React.forwardRef(({ theme, mode = 'normal', timerEnabled = true }, ref) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(85); // 01:25 in seconds
  const [disableAnimation, setDisableAnimation] = useState(false);
  const [shuffledFlashcards, setShuffledFlashcards] = useState([]);
  const flashcardRef = useRef(null);

  // Function to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Get base flashcards based on mode
  const getBaseFlashcards = useCallback(() => {
    switch (mode) {
      case 'fillblank':
        return fillBlankFlashcards;
      case 'mix':
        return mixFlashcards;
      case 'normal':
      default:
        return normalFlashcards;
    }
  }, [mode]);

  // Update flashcards when mode changes
  useEffect(() => {
    const baseFlashcards = getBaseFlashcards();
    setShuffledFlashcards(baseFlashcards);
    setCurrentCard(0);
    setIsFlipped(false);
  }, [mode, getBaseFlashcards]);

  // Expose shuffleFlashcards method to parent component
  useImperativeHandle(ref, () => ({
    shuffleFlashcards: () => {
      const newShuffledCards = shuffleArray(flashcards);
      setShuffledFlashcards(newShuffledCards);
      setCurrentCard(0);
      setIsFlipped(false);
      setTimeLeft(85); // Reset timer when shuffling
    }
  }));

  // Initialize flashcards on component mount
  useEffect(() => {
    const baseFlashcards = getBaseFlashcards();
    setShuffledFlashcards(baseFlashcards);
  }, [getBaseFlashcards]);

  const flashcards = shuffledFlashcards;
  const totalCards = flashcards.length;
  const currentFlashcard = flashcards[currentCard];

  // Timer effect - same as quiz implementation
  useEffect(() => {
    if (!timerEnabled) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0; // Stop at 0, don't reset
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerEnabled]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      // Disable animation temporarily
      setDisableAnimation(true);
      setIsFlipped(false);

      // Change card
      setCurrentCard(currentCard - 1);

      // Reset timer when changing cards
      setTimeLeft(85);

      // Re-enable animation after a brief delay
      setTimeout(() => {
        setDisableAnimation(false);
      }, 50);
    }
  };

  const handleNext = () => {
    if (currentCard < totalCards - 1) {
      // Disable animation temporarily
      setDisableAnimation(true);
      setIsFlipped(false);

      // Change card
      setCurrentCard(currentCard + 1);

      // Reset timer when changing cards
      setTimeLeft(85);

      // Re-enable animation after a brief delay
      setTimeout(() => {
        setDisableAnimation(false);
      }, 50);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const progressPercentage = totalCards > 0 ? ((currentCard + 1) / totalCards) * 100 : 0;

  // Safety check: if no flashcards or current card is out of bounds
  if (!currentFlashcard || totalCards === 0) {
    return (
      <div className="flashcard-container">
        <div className="flashcard-wrapper">
          <div className="flashcard-header">
            <h2 className="flashcard-title">No Flashcards Available</h2>
          </div>
          <div className="flashcard-content">
            <p>Please select a different mode or add flashcards.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-container">
      <div className="flashcard-wrapper">
        {/* Header */}
        <div className="flashcard-header">
          <div className="header-top">
            <h2 className="flashcard-title">
            Flashcard - Cultura generale
          </h2>
            <div className="header-controls">
              {timerEnabled && (
                <div className="timer-widget">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="M10 6v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="timer-text">{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="progress-text">{currentCard + 1}/{totalCards}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flashcard-content">
          <p className="question-text">
            {currentFlashcard.question}
            {(mode === 'fillblank' || (mode === 'mix' && currentFlashcard.type === 'fillblank'))}
          </p>
          <div
            ref={flashcardRef}
            className={`flashcard ${isFlipped ? 'flipped' : ''}`}
            style={{ transition: disableAnimation ? 'none' : '' }}
            onClick={handleFlip}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <p className="card-text">?</p>
                <div className="flip-hint" onClick={handleFlip}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Mostra</span>
                </div>
              </div>
              <div className="flashcard-back">
                <p className="card-text">{currentFlashcard.answer}</p>
                <div className="flip-hint" onClick={handleFlip}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Nascondi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flashcard-navigation">
          <button
            className="nav-button prev-button"
            onClick={handlePrevious}
            disabled={currentCard === 0}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 10H5m5-5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Precedente</span>
          </button>
          <button
            className="nav-button next-button"
            onClick={handleNext}
            disabled={currentCard === totalCards - 1}
          >
            <span>Successivo</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 10h10m-5-5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

Flashcard.displayName = 'Flashcard';

export default Flashcard;