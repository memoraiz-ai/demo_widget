import React, { useState } from 'react';

const TrueFalseQuiz = ({ visualStyle = 'playful', timerEnabled = true, immediateFeedbackEnabled = true }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(125);
  const [currentQuestion, setCurrentQuestion] = useState(8);
  const [totalQuestions] = useState(10);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  const questionVariants = [
    "Giove è il pianeta più grande del nostro sistema solare.",
    "Giove è il pianeta più grande del nostro sistema solare?",
    "Giove detiene il primato di essere il pianeta più grande del nostro sistema solare."
  ];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const correctAnswer = true;

  const selectAnswer = (isTrue) => {
    setSelectedAnswer(isTrue);

    if (immediateFeedbackEnabled) {
      setTimeout(() => {
        setShowFeedback(true);
        if (isTrue === correctAnswer && !pointsAwarded) {
          setScore(prev => prev + 25);
          setPointsAwarded(true);
        }
      }, 300);
    } else {
      setShowFeedback(false);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setPointsAwarded(false);
    setCurrentQuestion(prev => Math.min(prev + 1, totalQuestions));
  };

  const getOptionClass = (answerValue) => {
    const prefix = visualStyle;
    if (!showFeedback) {
      return selectedAnswer === answerValue
        ? `${prefix}-quiz-option ${prefix}-quiz-option-selected`
        : `${prefix}-quiz-option ${prefix}-quiz-option-default`;
    }
    if (answerValue === correctAnswer) {
      return `${prefix}-quiz-option ${prefix}-quiz-option-correct`;
    }
    if (answerValue === selectedAnswer) {
      return `${prefix}-quiz-option ${prefix}-quiz-option-incorrect`;
    }
    return `${prefix}-quiz-option ${prefix}-quiz-option-default`;
  };

  // Render for Picasso style
  if (visualStyle === 'picasso') {
    return (
      <div className="picasso-quiz-wrapper">
        <div className="picasso-quiz-deco-1"></div>
        <div className="picasso-quiz-deco-2"></div>
        <div className="picasso-quiz-container">
          <div className="picasso-quiz-bg-1"></div>
          <div className="picasso-quiz-bg-2"></div>
          <div className="picasso-quiz-top-border"></div>
          <div className="picasso-quiz-inner">
            <div className="picasso-quiz-header">
              <div className="picasso-quiz-badge-wrapper">
                <div className="picasso-quiz-badge-shadow"></div>
                <div className="picasso-quiz-badge picasso-quiz-question-badge">
                  Question {currentQuestion}/{totalQuestions}
                </div>
              </div>
              <div className="picasso-quiz-badge-wrapper">
                <div className="picasso-quiz-score-shadow"></div>
                <div className="picasso-quiz-badge picasso-quiz-score-badge">
                  Score: {score}
                </div>
              </div>
            </div>

            <div className="picasso-quiz-question-wrapper">
              <div className="picasso-quiz-question-bg"></div>
              <div className="picasso-quiz-question-box">
                <div className="picasso-quiz-question-line"></div>
                <div className="picasso-quiz-question">
                  {questionVariants[currentQuestionIndex]}
                </div>
              </div>
            </div>

            <div className="picasso-quiz-options">
              {[true, false].map((answerValue) => {
                const isCorrect = showFeedback && answerValue === correctAnswer;
                const isIncorrect = showFeedback && answerValue === selectedAnswer && answerValue !== correctAnswer;
                return (
                  <div key={String(answerValue)} className="picasso-quiz-option-wrapper">
                    <div className={`picasso-quiz-option-shadow ${
                      isCorrect ? 'picasso-quiz-option-shadow-correct' :
                      isIncorrect ? 'picasso-quiz-option-shadow-incorrect' :
                      'picasso-quiz-option-shadow-default'
                    }`}></div>
                    <button
                      className={getOptionClass(answerValue)}
                      onClick={() => !showFeedback && selectAnswer(answerValue)}
                    >
                      <span>{answerValue ? 'VERO' : 'FALSO'}</span>
                      {showFeedback && answerValue === correctAnswer && <span>✓</span>}
                      {showFeedback && answerValue === selectedAnswer && answerValue !== correctAnswer && <span>✗</span>}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="picasso-quiz-next-btn-wrapper">
              <div className="picasso-quiz-next-btn-shadow"></div>
              <button
                className="picasso-quiz-next-btn"
                onClick={nextQuestion}
              >
                Next Question
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render for Illustrated style
  if (visualStyle === 'illustrated') {
    return (
      <div className="illustrated-quiz-container">
        <div className="illustrated-quiz-bg-image"></div>
        <div className="illustrated-quiz-inner">
          <div className="illustrated-quiz-header">
            <div className="illustrated-quiz-star-icon">⭐</div>
            <div className="illustrated-quiz-badges">
              <div className="illustrated-quiz-question-badge">
                Question {currentQuestion}/{totalQuestions}
              </div>
              <div className="illustrated-quiz-score-badge">
                Score: {score}
              </div>
            </div>
          </div>

          <div className="illustrated-quiz-question-wrapper">
            <div className="illustrated-quiz-question-box">
              <div className="illustrated-quiz-question">
                {questionVariants[currentQuestionIndex]}
              </div>
            </div>
          </div>

          <div className="illustrated-quiz-options">
            {[true, false].map((answerValue) => (
              <button
                key={String(answerValue)}
                className={getOptionClass(answerValue)}
                onClick={() => !showFeedback && selectAnswer(answerValue)}
              >
                <span>{answerValue ? 'VERO' : 'FALSO'}</span>
                {showFeedback && answerValue === correctAnswer && <span>✓</span>}
                {showFeedback && answerValue === selectedAnswer && answerValue !== correctAnswer && <span>✗</span>}
              </button>
            ))}
          </div>

          <button
            className="illustrated-quiz-next-btn"
            onClick={nextQuestion}
          >
            <span>Next Question</span>
            <span className="illustrated-quiz-star-running">⭐</span>
          </button>
        </div>
      </div>
    );
  }

  // Default render for simpler styles
  return (
    <div className={`${visualStyle}-quiz-container`}>
      <div className={`${visualStyle}-quiz-inner`}>
        <div className={`${visualStyle}-quiz-header`}>
          <div className={`${visualStyle}-quiz-question-badge`}>
            Question {currentQuestion}/{totalQuestions}
          </div>
          <div className={`${visualStyle}-quiz-score-badge`}>
            Score: {score}
          </div>
        </div>

        <div className={`${visualStyle}-quiz-question`}>
          {questionVariants[currentQuestionIndex]}
        </div>

        <div className={`${visualStyle}-quiz-options`}>
          {[true, false].map((answerValue) => (
            <button
              key={String(answerValue)}
              className={getOptionClass(answerValue)}
              onClick={() => !showFeedback && selectAnswer(answerValue)}
            >
              <span>{answerValue ? 'VERO' : 'FALSO'}</span>
              {showFeedback && answerValue === correctAnswer && <span>✓</span>}
              {showFeedback && answerValue === selectedAnswer && answerValue !== correctAnswer && <span>✗</span>}
            </button>
          ))}
        </div>

        <button
          className={`${visualStyle}-quiz-next-btn`}
          onClick={nextQuestion}
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default TrueFalseQuiz;
