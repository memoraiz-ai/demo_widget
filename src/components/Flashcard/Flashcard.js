import React, { useState, useImperativeHandle } from 'react';

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

const Flashcard = React.forwardRef(({ visualStyle = 'playful', mode = 'normal', timerEnabled = true }, ref) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState(normalFlashcards);

  useImperativeHandle(ref, () => ({
    shuffleFlashcards: () => {
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled);
      setCurrentCard(0);
      setIsFlipped(false);
    }
  }));

  const totalCards = flashcards.length;
  const currentFlashcard = flashcards[currentCard];

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

  if (!currentFlashcard || totalCards === 0) {
    return (
      <div className={`${visualStyle}-flashcard-wrapper`}>
        <div className={`${visualStyle}-flashcard-container`}>
          <p>No Flashcards Available</p>
        </div>
      </div>
    );
  }

  // Render for Picasso style with complex structure
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
              <div className="picasso-flashcard-counter-box-wrapper">
                <div className="picasso-flashcard-counter-shadow"></div>
                <div className="picasso-flashcard-counter-box">
                  <div className="picasso-flashcard-counter-dot"></div>
                  <span className="picasso-flashcard-counter-text">
                    {currentCard + 1} / {totalCards}
                  </span>
                </div>
              </div>
            </div>
            <div className="picasso-flashcard-flip-btn-wrapper">
              <div className="picasso-flashcard-flip-btn-shadow"></div>
              <button className="picasso-flashcard-flip-btn" onClick={handleFlip}>
                <span className="picasso-flashcard-flip-icon">⟲</span>
              </button>
            </div>
          </div>

          <div className="picasso-flashcard-card-area" onClick={handleFlip}>
            <div 
              className="picasso-flashcard-card"
              style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              <div className="picasso-flashcard-front-wrapper">
                <div className="picasso-flashcard-front-inner">
                  <div className="picasso-flashcard-front-shadow"></div>
                  <div className="picasso-flashcard-front">
                    <div className="picasso-flashcard-front-deco-1"></div>
                    <div className="picasso-flashcard-front-deco-2"></div>
                    <div className="picasso-flashcard-front-content">
                      <div className="picasso-flashcard-front-icon-wrapper">
                        <div className="picasso-flashcard-front-icon-inner">
                          <div className="picasso-flashcard-front-icon-bg"></div>
                          <div className="picasso-flashcard-front-icon">
                            <span className="picasso-flashcard-front-icon-text">?</span>
                          </div>
                        </div>
                      </div>
                      <div className="picasso-flashcard-front-question">{currentFlashcard.question}</div>
                      <div className="picasso-flashcard-front-hint">Click to reveal</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="picasso-flashcard-back-wrapper">
                <div className="picasso-flashcard-back-inner">
                  <div className="picasso-flashcard-back-shadow"></div>
                  <div className="picasso-flashcard-back">
                    <div className="picasso-flashcard-back-deco-1"></div>
                    <div className="picasso-flashcard-back-deco-2"></div>
                    <div className="picasso-flashcard-back-content">
                      <div className="picasso-flashcard-back-icon">
                        <span className="picasso-flashcard-back-icon-text">!</span>
                      </div>
                      <div className="picasso-flashcard-back-answer-wrapper">
                        <div className="picasso-flashcard-back-answer-bg"></div>
                        <div className="picasso-flashcard-back-answer">{currentFlashcard.answer}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="picasso-flashcard-nav">
            <div className="picasso-flashcard-nav-btn-wrapper">
              <div className="picasso-flashcard-nav-btn-shadow"></div>
              <button
                className="picasso-flashcard-nav-btn picasso-flashcard-nav-btn-prev"
                onClick={handlePrevious}
                disabled={currentCard === 0}
              >
                <span>←</span>
                <span>Previous</span>
              </button>
            </div>
            <div className="picasso-flashcard-nav-btn-wrapper">
              <div className="picasso-flashcard-nav-btn-shadow"></div>
              <button
                className="picasso-flashcard-nav-btn picasso-flashcard-nav-btn-next"
                onClick={handleNext}
                disabled={currentCard === totalCards - 1}
              >
                <span>Next</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="picasso-flashcard-dots">
            {flashcards.map((_, index) => (
              <div key={index} className="picasso-flashcard-dot-wrapper">
                <div className="picasso-flashcard-dot-shadow"></div>
                <button
                  className={`picasso-flashcard-dot ${
                    index === currentCard ? 'picasso-flashcard-dot-active' : 'picasso-flashcard-dot-inactive'
                  }`}
                  onClick={() => {
                    setCurrentCard(index);
                    setIsFlipped(false);
                  }}
                />
              </div>
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
              <div className="illustrated-flashcard-star-icon">⭐</div>
              <div className="illustrated-flashcard-counter">
                {currentCard + 1} / {totalCards}
              </div>
            </div>
            <button className="illustrated-flashcard-flip-btn" onClick={handleFlip}>
              ⟲
            </button>
          </div>

          <div className="illustrated-flashcard-card-area" onClick={handleFlip}>
            <div 
              className="illustrated-flashcard-card"
              style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              <div className="illustrated-flashcard-front">
                <div style={{ textAlign: 'center' }}>
                  <div className="illustrated-flashcard-content-star">⭐</div>
                  <div className="illustrated-flashcard-text-front">{currentFlashcard.question}</div>
                  <div className="illustrated-flashcard-hint">Click to reveal</div>
                </div>
              </div>
              <div className="illustrated-flashcard-back">
                <div style={{ textAlign: 'center' }}>
                  <div className="illustrated-flashcard-text-back">{currentFlashcard.answer}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="illustrated-flashcard-nav">
            <button
              className="illustrated-flashcard-nav-btn illustrated-flashcard-nav-btn-prev"
              onClick={handlePrevious}
              disabled={currentCard === 0}
            >
              <span>←</span>
              <span>Previous</span>
            </button>
            <button
              className="illustrated-flashcard-nav-btn illustrated-flashcard-nav-btn-next"
              onClick={handleNext}
              disabled={currentCard === totalCards - 1}
            >
              <span>Next</span>
              <span>→</span>
              <span className="illustrated-flashcard-star-running">⭐</span>
            </button>
          </div>

          <div className="illustrated-flashcard-dots">
            {flashcards.map((_, index) => (
              <button
                key={index}
                className={`illustrated-flashcard-dot ${
                  index === currentCard ? 'illustrated-flashcard-dot-active' : 'illustrated-flashcard-dot-inactive'
                }`}
                onClick={() => {
                  setCurrentCard(index);
                  setIsFlipped(false);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default render for simpler styles (playful, tech, corporate)
  return (
    <div className={`${visualStyle}-flashcard-wrapper`}>
      <div className={`${visualStyle}-flashcard-container`}>
        <div className={`${visualStyle}-flashcard-header`}>
          <div className={`${visualStyle}-flashcard-counter`}>
            {currentCard + 1} / {totalCards}
          </div>
          <button 
            className={`${visualStyle}-flashcard-flip-btn`}
            onClick={handleFlip}
          >
            ⟲
          </button>
        </div>

        <div className={`${visualStyle}-flashcard-card-area`} onClick={handleFlip}>
          <div 
            className={`${visualStyle}-flashcard-card`}
            style={{
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            <div className={`${visualStyle}-flashcard-front`}>
              <div style={{ textAlign: 'center' }}>
                <div className={`${visualStyle}-flashcard-text-front`}>
                  {currentFlashcard.question}
                </div>
                <div className={`${visualStyle}-flashcard-hint`}>
                  Click to reveal
                </div>
              </div>
            </div>
            <div className={`${visualStyle}-flashcard-back`}>
              <div style={{ textAlign: 'center' }}>
                <div className={`${visualStyle}-flashcard-text-back`}>
                  {currentFlashcard.answer}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${visualStyle}-flashcard-nav`}>
          <button
            className={`${visualStyle}-flashcard-nav-btn ${visualStyle}-flashcard-nav-btn-prev`}
            onClick={handlePrevious}
            disabled={currentCard === 0}
          >
            <span>←</span>
            <span>Previous</span>
          </button>
          <button
            className={`${visualStyle}-flashcard-nav-btn ${visualStyle}-flashcard-nav-btn-next`}
            onClick={handleNext}
            disabled={currentCard === totalCards - 1}
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>

        <div className={`${visualStyle}-flashcard-dots`}>
          {flashcards.map((_, index) => (
            <button
              key={index}
              className={
                index === currentCard
                  ? `${visualStyle}-flashcard-dot ${visualStyle}-flashcard-dot-active`
                  : `${visualStyle}-flashcard-dot ${visualStyle}-flashcard-dot-inactive`
              }
              onClick={() => {
                setCurrentCard(index);
                setIsFlipped(false);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

Flashcard.displayName = 'Flashcard';

export default Flashcard;
