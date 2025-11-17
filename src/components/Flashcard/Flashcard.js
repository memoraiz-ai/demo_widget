import React, { useState, useImperativeHandle, useEffect, useMemo, useRef } from 'react';
import { RotateCw, ChevronLeft, ChevronRight, Code2, Clock } from 'lucide-react';
import flashcardData from '../../data/flashcard.json';

const Flashcard = React.forwardRef(({ visualStyle = 'playful', mode = 'normal', timerEnabled = true, timerDuration = 300 }, ref) => {
  const mappedFlashcards = useMemo(
    () =>
      (flashcardData.flashcards || []).map((card) => ({
        ...card,
        question: card.front || card.question || '',
        answer: card.back || card.answer || ''
      })),
    []
  );

  const filteredFlashcards = useMemo(() => {
    switch (mode) {
      case 'classic':
        return mappedFlashcards.filter((card) => card.type === 'classic');
      case 'cloze':
        return mappedFlashcards.filter((card) => card.type === 'cloze');
      case 'mix':
        return mappedFlashcards.filter((card) => card.type === 'classic' || card.type === 'cloze');
      default:
        return mappedFlashcards;
    }
  }, [mappedFlashcards, mode]);

  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState(filteredFlashcards);
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const [isFinished, setIsFinished] = useState(false);
  const timerDurationRef = useRef(timerDuration);

  useEffect(() => {
    timerDurationRef.current = timerDuration;
  }, [timerDuration]);

  useImperativeHandle(ref, () => ({
    shuffleFlashcards: () => {
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled);
      setCurrentCard(0);
      setIsFlipped(false);
      setTimeRemaining(timerDuration);
      setIsFinished(false);
    }
  }));

  // Timer countdown effect
  useEffect(() => {
    if (timerEnabled && timeRemaining > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timerEnabled, timeRemaining, isFinished]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeRemaining(timerDuration);
    setIsFinished(false);
  }, [timerDuration]);

  const totalCards = flashcards.length;
  const currentFlashcard = useMemo(() => {
    if (!flashcards.length) return null;
    return flashcards[currentCard] || flashcards[0];
  }, [flashcards, currentCard]);

  const handlePrevious = () => {
    if (currentCard > 0) {
      setIsFlipped(false);
      setCurrentCard(currentCard - 1);
    }
  };

  const handleNext = () => {
    if (currentCard < totalCards - 1) {
      setIsFlipped(false);
      setCurrentCard(currentCard + 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setTimeRemaining(timerDuration);
    setIsFinished(false);
  };

  useEffect(() => {
    setFlashcards(filteredFlashcards);
    setCurrentCard(0);
    setIsFlipped(false);
    setTimeRemaining(timerDurationRef.current);
    setIsFinished(false);
  }, [filteredFlashcards]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render finished screen
  if (isFinished) {
    return (
      <div className={`${visualStyle}-flashcard-wrapper`}>
        <div className={`${visualStyle}-flashcard-container`}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Time's Up! ⏰</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              You reviewed {currentCard + 1} out of {totalCards} flashcards
            </p>
            <button 
              onClick={handleRestart}
              className={`${visualStyle}-flashcard-nav-btn`}
              style={{ margin: '0 auto' }}
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentFlashcard || totalCards === 0) {
    return (
      <div className={`${visualStyle}-flashcard-wrapper`}>
        <div className={`${visualStyle}-flashcard-container`}>
          <p>No Flashcards Available</p>
        </div>
      </div>
    );
  }

  // Render for Playful style
  if (visualStyle === 'playful') {
    return (
      <div className="playful-flashcard-wrapper">
        <div className="playful-flashcard-container">
          <div className="playful-flashcard-header">
            <div className="playful-flashcard-counter">
              Card {currentCard + 1} / {totalCards}
            </div>
            {timerEnabled && (
              <div className={`playful-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                <Clock />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <button onClick={handleFlip} className="playful-flashcard-flip-btn">
              <RotateCw className="playful-flashcard-icon" />
            </button>
          </div>

          <div className="playful-flashcard-card-area" onClick={handleFlip} style={{ perspective: '1000px' }}>
            <div 
              className="playful-flashcard-card"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              <div className="playful-flashcard-front" style={{ backfaceVisibility: 'hidden' }}>
                <div className="playful-flashcard-front-content">
                  <div className="playful-flashcard-emoji">🤔</div>
                  <p className="playful-flashcard-text-front">{currentFlashcard.question}</p>
                  <p className="playful-flashcard-hint">Click to flip!</p>
                </div>
              </div>

              <div className="playful-flashcard-back" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="playful-flashcard-back-content">
                  <div className="playful-flashcard-emoji">💡</div>
                  <p className="playful-flashcard-text-back">{currentFlashcard.answer}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="playful-flashcard-nav">
            <button onClick={handlePrevious} className="playful-flashcard-nav-btn playful-flashcard-nav-btn-prev">
              <ChevronLeft className="playful-flashcard-icon" />
              Previous
            </button>
            <button onClick={handleNext} className="playful-flashcard-nav-btn playful-flashcard-nav-btn-next">
              Next
              <ChevronRight className="playful-flashcard-icon" />
            </button>
          </div>

          <div className="playful-flashcard-dots">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCard(index);
                  setIsFlipped(false);
                }}
                className={`playful-flashcard-dot ${index === currentCard ? 'playful-flashcard-dot-active' : 'playful-flashcard-dot-inactive'}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render for Tech style
  if (visualStyle === 'tech') {
    return (
      <div className="tech-flashcard-wrapper">
        <div className="tech-flashcard-container">
          <div className="tech-flashcard-header">
            <div className="tech-flashcard-counter">
              <Code2 className="tech-flashcard-icon-code" />
              <span>[{currentCard + 1}/{totalCards}]</span>
            </div>
            {timerEnabled && (
              <div className={`tech-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                <Clock />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <button onClick={handleFlip} className="tech-flashcard-flip-btn">
              <RotateCw className="tech-flashcard-icon" />
            </button>
          </div>

          <div className="tech-flashcard-card-area" onClick={handleFlip} style={{ perspective: '1000px' }}>
            <div 
              className="tech-flashcard-card"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              <div className="tech-flashcard-front" style={{ backfaceVisibility: 'hidden' }}>
                <div className="tech-flashcard-front-content">
                  <div className="tech-flashcard-label">{'> '} QUERY</div>
                  <p className="tech-flashcard-text-front">{currentFlashcard.question}</p>
                  <p className="tech-flashcard-hint">{'// click to execute'}</p>
                </div>
              </div>

              <div className="tech-flashcard-back" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="tech-flashcard-back-content">
                  <div className="tech-flashcard-label">{'> '} RESPONSE</div>
                  <p className="tech-flashcard-text-back">{currentFlashcard.answer}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="tech-flashcard-nav">
            <button onClick={handlePrevious} className="tech-flashcard-nav-btn tech-flashcard-nav-btn-prev">
              <ChevronLeft className="tech-flashcard-icon" />
              PREV
            </button>
            <button onClick={handleNext} className="tech-flashcard-nav-btn tech-flashcard-nav-btn-next">
              NEXT
              <ChevronRight className="tech-flashcard-icon" />
            </button>
          </div>

          <div className="tech-flashcard-dots">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCard(index);
                  setIsFlipped(false);
                }}
                className={`tech-flashcard-dot ${index === currentCard ? 'tech-flashcard-dot-active' : 'tech-flashcard-dot-inactive'}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render for Corporate style
  if (visualStyle === 'corporate') {
    return (
      <div className="corporate-flashcard-wrapper">
        <div className="corporate-flashcard-container">
          <div className="corporate-flashcard-header">
            <div className="corporate-flashcard-counter">
              Card {currentCard + 1} of {totalCards}
            </div>
            {timerEnabled && (
              <div className={`corporate-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                <Clock />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <button onClick={handleFlip} className="corporate-flashcard-flip-btn">
              <RotateCw className="corporate-flashcard-icon" />
            </button>
          </div>

          <div className="corporate-flashcard-card-area" onClick={handleFlip} style={{ perspective: '1000px' }}>
            <div 
              className="corporate-flashcard-card"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              <div className="corporate-flashcard-front" style={{ backfaceVisibility: 'hidden' }}>
                <div className="corporate-flashcard-front-content">
                  <div className="corporate-flashcard-label">Question</div>
                  <p className="corporate-flashcard-text-front">{currentFlashcard.question}</p>
                  <p className="corporate-flashcard-hint">Click to reveal answer</p>
                </div>
              </div>

              <div className="corporate-flashcard-back" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="corporate-flashcard-back-content">
                  <div className="corporate-flashcard-label-back">Answer</div>
                  <p className="corporate-flashcard-text-back">{currentFlashcard.answer}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="corporate-flashcard-nav">
            <button onClick={handlePrevious} className="corporate-flashcard-nav-btn corporate-flashcard-nav-btn-prev">
              <ChevronLeft className="corporate-flashcard-icon" />
              Previous
            </button>
            <button onClick={handleNext} className="corporate-flashcard-nav-btn corporate-flashcard-nav-btn-next">
              Next
              <ChevronRight className="corporate-flashcard-icon" />
            </button>
          </div>

          <div className="corporate-flashcard-dots">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCard(index);
                  setIsFlipped(false);
                }}
                className={`corporate-flashcard-dot ${index === currentCard ? 'corporate-flashcard-dot-active' : 'corporate-flashcard-dot-inactive'}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render for Illustrated style
  if (visualStyle === 'illustrated') {
    return (
      <div className="illustrated-flashcard-wrapper">
        <div className="illustrated-flashcard-container">
          <div className="illustrated-flashcard-header">
            <div className="illustrated-flashcard-counter-wrapper">
              <div className="illustrated-flashcard-star-icon">
                <img src="/dubbioso_pensieroso.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="illustrated-flashcard-counter">
                Card {currentCard + 1} / {totalCards}
              </div>
            </div>
            {timerEnabled && (
              <div className={`illustrated-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                <Clock />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <button onClick={handleFlip} className="illustrated-flashcard-flip-btn">
              <RotateCw className="illustrated-flashcard-icon" />
            </button>
          </div>

          <div className="illustrated-flashcard-card-area" onClick={handleFlip} style={{ perspective: '1000px' }}>
            <div 
              className="illustrated-flashcard-card"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              <div className="illustrated-flashcard-front" style={{ backfaceVisibility: 'hidden' }}>
                <div className="illustrated-flashcard-front-content">
                  <p className="illustrated-flashcard-text-front">{currentFlashcard.question}</p>
                  <div className="illustrated-flashcard-hint">Click to flip!</div>
                </div>
              </div>

              <div className="illustrated-flashcard-back" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="illustrated-flashcard-back-content">
                  <div className="illustrated-flashcard-emoji">
                    <img src="/controllo.png" alt="" style={{ width: '6rem', height: '6rem', objectFit: 'contain' }} />
                  </div>
                  <p className="illustrated-flashcard-text-back">{currentFlashcard.answer}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="illustrated-flashcard-nav">
            <button onClick={handlePrevious} className="illustrated-flashcard-nav-btn illustrated-flashcard-nav-btn-prev">
              <ChevronLeft className="illustrated-flashcard-icon" />
              Previous
            </button>
            <button onClick={handleNext} className="illustrated-flashcard-nav-btn illustrated-flashcard-nav-btn-next">
              Next
              <ChevronRight className="illustrated-flashcard-icon" />
            </button>
          </div>

          <div className="illustrated-flashcard-dots">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCard(index);
                  setIsFlipped(false);
                }}
                className={`illustrated-flashcard-dot ${index === currentCard ? 'illustrated-flashcard-dot-active' : 'illustrated-flashcard-dot-inactive'}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render for Picasso style
  if (visualStyle === 'picasso') {
    return (
      <div className="picasso-flashcard-wrapper">
        <div className="picasso-flashcard-deco-1"></div>
        <div className="picasso-flashcard-deco-2"></div>
        <div className="picasso-flashcard-deco-3"></div>
        
        <div className="picasso-flashcard-container">
          <div className="picasso-flashcard-top-border"></div>
          
          <div className="picasso-flashcard-header">
            <div className="picasso-flashcard-counter-wrapper">
              <div className="picasso-flashcard-counter-shadow"></div>
              <div className="picasso-flashcard-counter">
                <div className="picasso-flashcard-counter-dot"></div>
                <span>{currentCard + 1} / {totalCards}</span>
              </div>
            </div>
            {timerEnabled && (
              <div className={`picasso-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                <div className="picasso-timer-shadow"></div>
                <div className="picasso-timer-content">
                  <Clock />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
              </div>
            )}
            <button onClick={handleFlip} className="picasso-flashcard-flip-btn-wrapper">
              <div className="picasso-flashcard-flip-btn-shadow"></div>
              <div className="picasso-flashcard-flip-btn">
                <RotateCw className="picasso-flashcard-icon" />
              </div>
            </button>
          </div>

          <div className="picasso-flashcard-card-area" onClick={handleFlip} style={{ perspective: '1000px' }}>
            <div 
              className="picasso-flashcard-card"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              <div className="picasso-flashcard-front-wrapper" style={{ backfaceVisibility: 'hidden' }}>
                <div className="picasso-flashcard-front-shadow"></div>
                <div className="picasso-flashcard-front">
                  <div className="picasso-flashcard-front-deco-1"></div>
                  <div className="picasso-flashcard-front-deco-2"></div>
                  <div className="picasso-flashcard-front-content">
                    <div className="picasso-flashcard-front-icon-wrapper">
                      <div className="picasso-flashcard-front-icon-shadow"></div>
                      <div className="picasso-flashcard-front-icon">?</div>
                    </div>
                    <p className="picasso-flashcard-front-text">{currentFlashcard.question}</p>
                    <div className="picasso-flashcard-front-hint">Click to reveal</div>
                  </div>
                </div>
              </div>

              <div className="picasso-flashcard-back-wrapper" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="picasso-flashcard-back-shadow"></div>
                <div className="picasso-flashcard-back">
                  <div className="picasso-flashcard-back-deco-1"></div>
                  <div className="picasso-flashcard-back-deco-2"></div>
                  <div className="picasso-flashcard-back-content">
                    <div className="picasso-flashcard-back-icon">!</div>
                    <div className="picasso-flashcard-back-answer-wrapper">
                      <div className="picasso-flashcard-back-answer-bg"></div>
                      <p className="picasso-flashcard-back-answer">{currentFlashcard.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="picasso-flashcard-nav">
            <div className="picasso-flashcard-nav-btn-wrapper">
              <div className="picasso-flashcard-nav-btn-shadow"></div>
              <button onClick={handlePrevious} className="picasso-flashcard-nav-btn picasso-flashcard-nav-btn-prev">
                <ChevronLeft className="picasso-flashcard-icon" />
                <span>Previous</span>
              </button>
            </div>
            <div className="picasso-flashcard-nav-btn-wrapper">
              <div className="picasso-flashcard-nav-btn-shadow"></div>
              <button onClick={handleNext} className="picasso-flashcard-nav-btn picasso-flashcard-nav-btn-next">
                <span>Next</span>
                <ChevronRight className="picasso-flashcard-icon" />
              </button>
            </div>
          </div>

          <div className="picasso-flashcard-dots">
            {flashcards.map((_, index) => (
              <div key={index} className="picasso-flashcard-dot-wrapper">
                <div className="picasso-flashcard-dot-shadow"></div>
                <button
                  onClick={() => {
                    setCurrentCard(index);
                    setIsFlipped(false);
                  }}
                  className={`picasso-flashcard-dot ${index === currentCard ? 'picasso-flashcard-dot-active' : 'picasso-flashcard-dot-inactive'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render for Schoolr style
  if (visualStyle === 'schoolr') {
    return (
      <div className="schoolr-flashcard-wrapper">
        <div className="schoolr-flashcard-container">
          <div className="schoolr-flashcard-header">
            <div className="schoolr-flashcard-counter">
              Scheda {currentCard + 1} di {totalCards}
            </div>
            {timerEnabled && (
              <div className={`schoolr-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                <Clock />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <button onClick={handleFlip} className="schoolr-flashcard-flip-btn">
              <RotateCw className="schoolr-flashcard-icon" />
            </button>
          </div>

          <div className="schoolr-flashcard-card-area" onClick={handleFlip} style={{ perspective: '1000px' }}>
            <div 
              className="schoolr-flashcard-card"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              <div className="schoolr-flashcard-front" style={{ backfaceVisibility: 'hidden' }}>
                <div className="schoolr-flashcard-front-content">
                  <div className="schoolr-flashcard-question-icon">?</div>
                  <p className="schoolr-flashcard-text-front">{currentFlashcard.question}</p>
                  <div className="schoolr-flashcard-hint">Clicca per scoprire la risposta</div>
                </div>
              </div>

              <div className="schoolr-flashcard-back" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="schoolr-flashcard-back-content">
                  <div className="schoolr-flashcard-answer-icon">💡</div>
                  <p className="schoolr-flashcard-text-back">{currentFlashcard.answer}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="schoolr-flashcard-nav">
            <button onClick={handlePrevious} className="schoolr-flashcard-nav-btn schoolr-flashcard-nav-btn-prev">
              <ChevronLeft className="schoolr-flashcard-icon" />
              Precedente
            </button>
            <button onClick={handleNext} className="schoolr-flashcard-nav-btn schoolr-flashcard-nav-btn-next">
              Successivo
              <ChevronRight className="schoolr-flashcard-icon" />
            </button>
          </div>

          <div className="schoolr-flashcard-dots">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCard(index);
                  setIsFlipped(false);
                }}
                className={`schoolr-flashcard-dot ${index === currentCard ? 'schoolr-flashcard-dot-active' : 'schoolr-flashcard-dot-inactive'}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render for PLAI style
  if (visualStyle === 'plai') {
    return (
      <div className="plai-flashcard-wrapper">
        <div className="plai-flashcard-container">
          <div className="plai-flashcard-header">
            <div className="plai-flashcard-counter-wrapper">
              <div className="plai-flashcard-counter-label">Flashcard Study</div>
              <div className="plai-flashcard-counter">Card {currentCard + 1} of {totalCards}</div>
            </div>
            {timerEnabled && (
              <div className={`plai-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                <span className="plai-timer-label">Time</span>
                <Clock />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <button onClick={handleFlip} className="plai-flashcard-flip-btn">
              <RotateCw className="plai-flashcard-icon" />
            </button>
          </div>

          <div className="plai-flashcard-card-area" onClick={handleFlip} style={{ perspective: '1000px' }}>
            <div 
              className="plai-flashcard-card"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              <div className="plai-flashcard-front" style={{ backfaceVisibility: 'hidden' }}>
                <div className="plai-flashcard-front-content">
                  <div className="plai-flashcard-label">Question</div>
                  <p className="plai-flashcard-text-front">{currentFlashcard.question}</p>
                  <div className="plai-flashcard-hint">Click to reveal answer</div>
                </div>
              </div>

              <div className="plai-flashcard-back" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="plai-flashcard-back-content">
                  <div className="plai-flashcard-label-back">Answer</div>
                  <p className="plai-flashcard-text-back">{currentFlashcard.answer}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="plai-flashcard-nav">
            <button onClick={handlePrevious} className="plai-flashcard-nav-btn plai-flashcard-nav-btn-prev">
              <ChevronLeft className="plai-flashcard-icon" />
              Previous
            </button>
            <button onClick={handleNext} className="plai-flashcard-nav-btn plai-flashcard-nav-btn-next">
              Next
              <ChevronRight className="plai-flashcard-icon" />
            </button>
          </div>

          <div className="plai-flashcard-dots">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCard(index);
                  setIsFlipped(false);
                }}
                className={`plai-flashcard-dot ${index === currentCard ? 'plai-flashcard-dot-active' : 'plai-flashcard-dot-inactive'}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render for Studenti style
  if (visualStyle === 'studenti') {
    return (
      <div className="studenti-flashcard-wrapper">
        <div className="studenti-flashcard-container">
          <div className="studenti-flashcard-header">
            <div className="studenti-flashcard-counter-wrapper">
              <div className="studenti-flashcard-number">{currentCard + 1}</div>
              <div className="studenti-flashcard-counter-text">
                <div className="studenti-flashcard-label">Scheda di studio</div>
                <div className="studenti-flashcard-counter">{currentCard + 1} di {totalCards}</div>
              </div>
            </div>
            {timerEnabled && (
              <div className={`studenti-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                <Clock />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <button onClick={handleFlip} className="studenti-flashcard-flip-btn">
              <RotateCw className="studenti-flashcard-icon" />
            </button>
          </div>

          <div className="studenti-flashcard-card-area" onClick={handleFlip} style={{ perspective: '1000px' }}>
            <div 
              className="studenti-flashcard-card"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              <div className="studenti-flashcard-front" style={{ backfaceVisibility: 'hidden' }}>
                <div className="studenti-flashcard-front-content">
                  <div className="studenti-flashcard-question-label">Domanda</div>
                  <h3 className="studenti-flashcard-text-front">{currentFlashcard.question}</h3>
                  <div className="studenti-flashcard-hint">Clicca per vedere la risposta</div>
                </div>
              </div>

              <div className="studenti-flashcard-back" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="studenti-flashcard-back-content">
                  <div className="studenti-flashcard-answer-label">Risposta</div>
                  <p className="studenti-flashcard-text-back">{currentFlashcard.answer}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="studenti-flashcard-nav">
            <button onClick={handlePrevious} className="studenti-flashcard-nav-btn studenti-flashcard-nav-btn-prev">
              <ChevronLeft className="studenti-flashcard-icon" />
              Precedente
            </button>
            <button onClick={handleNext} className="studenti-flashcard-nav-btn studenti-flashcard-nav-btn-next">
              Successiva
              <ChevronRight className="studenti-flashcard-icon" />
            </button>
          </div>

          <div className="studenti-flashcard-dots">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCard(index);
                  setIsFlipped(false);
                }}
                className={`studenti-flashcard-dot ${index === currentCard ? 'studenti-flashcard-dot-active' : 'studenti-flashcard-dot-inactive'}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default fallback (should not reach here)
  return (
    <div className="playful-flashcard-wrapper">
      <div className="playful-flashcard-container">
        <p>Unknown visual style</p>
      </div>
    </div>
  );
});

Flashcard.displayName = 'Flashcard';

export default Flashcard;