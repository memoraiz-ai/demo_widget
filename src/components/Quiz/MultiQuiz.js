import React, { useState } from 'react';

const MultiQuiz = ({ visualStyle = 'playful', timerEnabled = true, immediateFeedbackEnabled = true }) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(125);
  const [currentQuestion, setCurrentQuestion] = useState(8);
  const [totalQuestions] = useState(10);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  const questionVariants = [
    "Quali dei seguenti sono giganti gassosi nel nostro sistema solare?",
    "Seleziona tutti i pianeti giganti gassosi del nostro sistema solare:",
    "Identifica quali di questi pianeti sono giganti gassosi nel nostro sistema solare:"
  ];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([
    "Giove",
    "Saturno",
    "Marte",
    "Nettuno",
    "Terra"
  ]);

  const correctAnswers = ["Giove", "Saturno", "Nettuno"];

  const toggleAnswer = (answer) => {
    const newSelected = selectedAnswers.includes(answer)
      ? selectedAnswers.filter(a => a !== answer)
      : [...selectedAnswers, answer];

    setSelectedAnswers(newSelected);

    if (immediateFeedbackEnabled && newSelected.length > 0) {
      checkAnswer(newSelected);
    } else {
      setShowFeedback(false);
      setPointsAwarded(false);
    }
  };

  const checkAnswer = (answersToCheck = selectedAnswers) => {
    if (answersToCheck.length === 0) return;

    const correctCount = answersToCheck.filter(answer => correctAnswers.includes(answer)).length;
    const isCorrect = answersToCheck.length === correctAnswers.length && correctCount === correctAnswers.length;

    setShowFeedback(true);

    if (isCorrect && !pointsAwarded) {
      setScore(prev => prev + 50);
      setPointsAwarded(true);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswers([]);
    setShowFeedback(false);
    setPointsAwarded(false);
    setCurrentQuestion(prev => Math.min(prev + 1, totalQuestions));
  };

  const getOptionClass = (answer) => {
    const prefix = visualStyle;
    if (!showFeedback) {
      return selectedAnswers.includes(answer)
        ? `${prefix}-quiz-option ${prefix}-quiz-option-selected`
        : `${prefix}-quiz-option ${prefix}-quiz-option-default`;
    }
    if (correctAnswers.includes(answer)) {
      return `${prefix}-quiz-option ${prefix}-quiz-option-correct`;
    }
    if (selectedAnswers.includes(answer)) {
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
              {answers.map((answer, index) => {
                const isCorrect = showFeedback && correctAnswers.includes(answer);
                const isIncorrect = showFeedback && selectedAnswers.includes(answer) && !correctAnswers.includes(answer);
                return (
                  <div key={index} className="picasso-quiz-option-wrapper">
                    <div className={`picasso-quiz-option-shadow ${
                      isCorrect ? 'picasso-quiz-option-shadow-correct' :
                      isIncorrect ? 'picasso-quiz-option-shadow-incorrect' :
                      'picasso-quiz-option-shadow-default'
                    }`}></div>
                    <button
                      className={getOptionClass(answer)}
                      onClick={() => !showFeedback && toggleAnswer(answer)}
                    >
                      <span>{answer}</span>
                      {showFeedback && correctAnswers.includes(answer) && <span>✓</span>}
                      {showFeedback && selectedAnswers.includes(answer) && !correctAnswers.includes(answer) && <span>✗</span>}
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
            {answers.map((answer, index) => (
              <button
                key={index}
                className={getOptionClass(answer)}
                onClick={() => !showFeedback && toggleAnswer(answer)}
              >
                <span>{answer}</span>
                {showFeedback && correctAnswers.includes(answer) && <span>✓</span>}
                {showFeedback && selectedAnswers.includes(answer) && !correctAnswers.includes(answer) && <span>✗</span>}
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
          {answers.map((answer, index) => (
            <button
              key={index}
              className={getOptionClass(answer)}
              onClick={() => !showFeedback && toggleAnswer(answer)}
            >
              <span>{answer}</span>
              {showFeedback && correctAnswers.includes(answer) && <span>✓</span>}
              {showFeedback && selectedAnswers.includes(answer) && !correctAnswers.includes(answer) && <span>✗</span>}
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

export default MultiQuiz;
