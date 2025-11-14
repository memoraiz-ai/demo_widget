import React, { useState, useEffect } from 'react';

const OutlinedQuiz = ({ visualStyle = 'playful', timerEnabled = true, immediateFeedbackEnabled = true }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(125);
  const [currentQuestion, setCurrentQuestion] = useState(8);
  const [totalQuestions] = useState(10);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [timer, setTimer] = useState(45);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(8);

  useEffect(() => {
    if (!timerEnabled || quizCompleted) return;
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setQuizCompleted(true);
          setEndTime(Date.now());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerEnabled, currentQuestion, quizCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatElapsedTime = () => {
    const elapsed = Math.floor(((endTime || Date.now()) - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const questionVariants = [
    "Il pianeta più grande del nostro sistema solare è _______.",
    "Quale pianeta detiene il titolo di più grande nel nostro sistema solare?",
    "Identifica il pianeta più grande che orbita nel nostro sistema solare."
  ];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([
    "Terra",
    "Giove",
    "Saturno",
    "Marte",
    "Nettuno"
  ]);

  const correctAnswer = "Giove";

  const selectAnswer = (answer) => {
    setSelectedAnswer(answer);

    if (immediateFeedbackEnabled) {
      setTimeout(() => {
        setShowFeedback(true);
        if (answer === correctAnswer && !pointsAwarded) {
          setScore(prev => prev + 25);
          setPointsAwarded(true);
        }
      }, 300);
    } else {
      setShowFeedback(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion >= totalQuestions) {
      setQuizCompleted(true);
      setEndTime(Date.now());
      return;
    }
    setSelectedAnswer(null);
    setShowFeedback(false);
    setPointsAwarded(false);
    setCurrentQuestion(prev => prev + 1);
    setTimer(45);
  };

  const restartQuiz = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setCurrentQuestion(1);
    setPointsAwarded(false);
    setTimer(45);
    setQuizCompleted(false);
    setEndTime(null);
    setCorrectAnswersCount(0);
  };

  const getOptionClass = (answer) => {
    const prefix = visualStyle;
    if (!showFeedback) {
      return selectedAnswer === answer
        ? `${prefix}-quiz-option ${prefix}-quiz-option-selected`
        : `${prefix}-quiz-option ${prefix}-quiz-option-default`;
    }
    if (answer === correctAnswer) {
      return `${prefix}-quiz-option ${prefix}-quiz-option-correct`;
    }
    if (answer === selectedAnswer) {
      return `${prefix}-quiz-option ${prefix}-quiz-option-incorrect`;
    }
    return `${prefix}-quiz-option ${prefix}-quiz-option-default`;
  };

  const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);

  // Render End Quiz Component for Corporate Style
  if (quizCompleted && visualStyle === 'corporate') {
    return (
      <div className="corporate-quiz-result-container">
        <div className="corporate-quiz-result-inner">
          <div className="corporate-quiz-result-title">Assessment Complete</div>
          <div className="corporate-quiz-result-text">
            Your score: <span className="corporate-quiz-result-score">{correctAnswersCount} / {totalQuestions}</span>
          </div>
          <div className="corporate-quiz-performance-box">
            <div className="corporate-quiz-performance-row">
              <span className="corporate-quiz-performance-label">Performance</span>
              <span className="corporate-quiz-performance-value">{percentage}%</span>
            </div>
            <div className="corporate-quiz-performance-bar">
              <div className="corporate-quiz-performance-fill" style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="corporate-quiz-performance-row" style={{ marginTop: '0.5rem' }}>
              <span className="corporate-quiz-performance-label">Time Used</span>
              <span className="corporate-quiz-performance-value">{formatElapsedTime()}</span>
            </div>
          </div>
          <button className="corporate-quiz-restart-btn" onClick={restartQuiz}>
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  // Render End Quiz Component for Tech Style
  if (quizCompleted && visualStyle === 'tech') {
    return (
      <div className="tech-quiz-result-container">
        <div className="tech-quiz-result-header">
          <span>&gt;_</span>
          <span className="tech-quiz-result-header-text">quiz_completed.log</span>
        </div>
        <div className="tech-quiz-result-inner">
          <div className="tech-quiz-result-title">EXECUTION COMPLETE</div>
          <div className="tech-quiz-result-box">
            <div className="tech-quiz-result-label">&gt; Results:</div>
            <div className="tech-quiz-result-row">
              Score: <span className="tech-quiz-result-value">{correctAnswersCount} / {totalQuestions}</span>
            </div>
            <div className="tech-quiz-result-row">
              Accuracy: <span className="tech-quiz-result-value">{percentage}%</span>
            </div>
            <div className="tech-quiz-result-row">
              Time: <span className="tech-quiz-result-value">{formatElapsedTime()}</span>
            </div>
            <div className="tech-quiz-result-row">
              Status: <span className={percentage === 100 ? "tech-quiz-result-status-perfect" : "tech-quiz-result-status-complete"}>
                {percentage === 100 ? 'PERFECT' : 'COMPLETE'}
              </span>
            </div>
          </div>
          <button className="tech-quiz-restart-btn" onClick={restartQuiz}>
            &gt; RESTART
          </button>
        </div>
      </div>
    );
  }

  // Render End Quiz Component for Illustrated Style
  if (quizCompleted && visualStyle === 'illustrated') {
    return (
      <div className="illustrated-quiz-result-container">
        <div className="illustrated-quiz-result-bg"></div>
        <div className="illustrated-quiz-result-inner">
          <div className="illustrated-quiz-result-star">💡</div>
          <div className="illustrated-quiz-result-title">Quiz Complete!</div>
          <div className="illustrated-quiz-result-score-box">
            <div className="illustrated-quiz-result-score-text">
              Score: {correctAnswersCount} / {totalQuestions}
            </div>
          </div>
          <div style={{ marginBottom: '1rem', color: '#111042', fontSize: '1.125rem' }}>
            <div>Accuracy: <strong>{percentage}%</strong></div>
            <div>Time Used: <strong>{formatElapsedTime()}</strong></div>
          </div>
        </div>
        <button className="illustrated-quiz-restart-btn" onClick={restartQuiz}>
          Try Again!
        </button>
      </div>
    );
  }

  // Render End Quiz Component for Picasso Style
  if (quizCompleted && visualStyle === 'picasso') {
    return (
      <div className="picasso-quiz-result-wrapper">
        <div className="picasso-quiz-result-deco-1"></div>
        <div className="picasso-quiz-result-deco-2"></div>
        <div className="picasso-quiz-result-container">
          <div className="picasso-quiz-result-bg-1"></div>
          <div className="picasso-quiz-result-bg-2"></div>
          <div className="picasso-quiz-result-inner">
            <div className="picasso-quiz-result-header">
              <div className="picasso-quiz-result-title-wrapper">
                <div className="picasso-quiz-result-title-bg"></div>
                <div className="picasso-quiz-result-title-box">
                  <div className="picasso-quiz-result-title">Complete!</div>
                </div>
              </div>
            </div>
            <div className="picasso-quiz-result-score-wrapper">
              <div className="picasso-quiz-result-score-outer">
                <div className="picasso-quiz-result-score-shadow"></div>
                <div className="picasso-quiz-result-score-box">
                  <div className="picasso-quiz-result-score-content">
                    <div className="picasso-quiz-result-score-icon">
                      <div className="picasso-quiz-result-score-number">{correctAnswersCount}</div>
                    </div>
                    <div>
                      <div className="picasso-quiz-result-score-label">Your Score</div>
                      <div className="picasso-quiz-result-score-value">{correctAnswersCount} / {totalQuestions}</div>
                      <div className="picasso-quiz-result-score-label">Accuracy: {percentage}%</div>
                      <div className="picasso-quiz-result-score-label">Time: {formatElapsedTime()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="picasso-quiz-result-restart-wrapper">
              <div className="picasso-quiz-result-restart-shadow"></div>
              <button className="picasso-quiz-result-restart-btn" onClick={restartQuiz}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render End Quiz Component for Playful Style (default)
  if (quizCompleted) {
    return (
      <div className="playful-quiz-container">
        <div className="playful-quiz-inner" style={{ textAlign: 'center' }}>
          <div className="playful-quiz-result-emoji">🎉</div>
          <div className="playful-quiz-result-title">Quiz Complete!</div>
          <div className="playful-quiz-result-text">
            Score: <span className="playful-quiz-result-score">{correctAnswersCount}</span> / <span className="playful-quiz-result-total">{totalQuestions}</span>
          </div>
          <div className="playful-quiz-result-text">
            Accuracy: <span className="playful-quiz-result-score">{percentage}%</span>
          </div>
          <div className="playful-quiz-result-text">
            Time Used: <span className="playful-quiz-result-score">{formatElapsedTime()}</span>
          </div>
          <button className="playful-quiz-restart-btn" onClick={restartQuiz}>
            Try Again!
          </button>
        </div>
      </div>
    );
  }

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
              {timerEnabled && (
                <div className="picasso-quiz-timer-wrapper">
                  <div className="picasso-quiz-timer-shadow"></div>
                  <div className="picasso-quiz-timer">
                    <svg className="picasso-quiz-timer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span className="picasso-quiz-timer-text">{formatTime(timer)}</span>
                  </div>
                </div>
              )}
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
                const isCorrect = showFeedback && answer === correctAnswer;
                const isIncorrect = showFeedback && answer === selectedAnswer && answer !== correctAnswer;
                return (
                  <div key={index} className="picasso-quiz-option-wrapper">
                    <div className={`picasso-quiz-option-shadow ${
                      isCorrect ? 'picasso-quiz-option-shadow-correct' :
                      isIncorrect ? 'picasso-quiz-option-shadow-incorrect' :
                      'picasso-quiz-option-shadow-default'
                    }`}></div>
                    <button
                      className={getOptionClass(answer)}
                      onClick={() => !showFeedback && selectAnswer(answer)}
                    >
                      <span>{answer}</span>
                      {showFeedback && answer === correctAnswer && <span>✓</span>}
                      {showFeedback && answer === selectedAnswer && answer !== correctAnswer && <span>✗</span>}
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
              {timerEnabled && (
                <div className="illustrated-quiz-timer">
                  <svg className="illustrated-quiz-timer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span className="illustrated-quiz-timer-text">{formatTime(timer)}</span>
                </div>
              )}
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
                onClick={() => !showFeedback && selectAnswer(answer)}
              >
                <span>{answer}</span>
                {showFeedback && answer === correctAnswer && <span>✓</span>}
                {showFeedback && answer === selectedAnswer && answer !== correctAnswer && <span>✗</span>}
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
          {timerEnabled && (
            <div className={`${visualStyle}-quiz-timer`}>
              <svg className={`${visualStyle}-quiz-timer-icon`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className={`${visualStyle}-quiz-timer-text`}>{formatTime(timer)}</span>
            </div>
          )}
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
              onClick={() => !showFeedback && selectAnswer(answer)}
            >
              <span>{answer}</span>
              {showFeedback && answer === correctAnswer && <span>✓</span>}
              {showFeedback && answer === selectedAnswer && answer !== correctAnswer && <span>✗</span>}
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

export default OutlinedQuiz;

