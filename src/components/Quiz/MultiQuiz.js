import React, { useState } from 'react';
import { CheckCircle2, XCircle, Terminal } from 'lucide-react';

const MultiQuiz = ({ visualStyle = 'playful', timerEnabled = true, immediateFeedbackEnabled = false }) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(125);
  const [currentQuestion, setCurrentQuestion] = useState(8);
  const [totalQuestions] = useState(10);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(8);

  const questionVariants = [
    "Quali dei seguenti sono giganti gassosi nel nostro sistema solare?",
    "Seleziona tutti i pianeti giganti gassosi del nostro sistema solare:",
    "Identifica quali di questi pianeti sono giganti gassosi nel nostro sistema solare:"
  ];
  const [currentQuestionIndex] = useState(0);
  const answers = [
    "Giove",
    "Saturno",
    "Marte",
    "Nettuno",
    "Terra"
  ];

  const correctAnswers = ["Giove", "Saturno", "Nettuno"];

  const toggleAnswer = (answer) => {
    const newSelected = selectedAnswers.includes(answer)
      ? selectedAnswers.filter(a => a !== answer)
      : [...selectedAnswers, answer];
    setSelectedAnswers(newSelected);
  };

  const checkAnswer = () => {
    if (selectedAnswers.length === 0) return;
    setShowFeedback(true);
    const correctCount = selectedAnswers.filter(answer => correctAnswers.includes(answer)).length;
    const isCorrect = selectedAnswers.length === correctAnswers.length && correctCount === correctAnswers.length;
    if (isCorrect && !pointsAwarded) {
      setScore(prev => prev + 50);
      setPointsAwarded(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion >= totalQuestions) {
      setQuizCompleted(true);
      return;
    }
    setSelectedAnswers([]);
    setShowFeedback(false);
    setPointsAwarded(false);
    setCurrentQuestion(prev => prev + 1);
  };

  const restartQuiz = () => {
    setSelectedAnswers([]);
    setShowFeedback(false);
    setScore(0);
    setCurrentQuestion(1);
    setPointsAwarded(false);
    setQuizCompleted(false);
    setCorrectAnswersCount(0);
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

  const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);

  // Render End Quiz Components (same as SingleQuiz)
  if (quizCompleted) {
    if (visualStyle === 'playful') {
      return (
        <div className="playful-quiz-result-container">
          <div className="playful-quiz-result-inner">
            <div className="playful-quiz-result-emoji">🎉</div>
            <h2 className="playful-quiz-result-title">Quiz Complete!</h2>
            <p className="playful-quiz-result-text">
              You scored <span className="playful-quiz-result-score">{correctAnswersCount}</span> out of <span className="playful-quiz-result-total">{totalQuestions}</span>
            </p>
            <button onClick={restartQuiz} className="playful-quiz-result-btn">
              Try Again! 🔄
            </button>
          </div>
        </div>
      );
    }

    if (visualStyle === 'tech') {
      return (
        <div className="tech-quiz-result-container">
          <div className="tech-quiz-result-header">
            <Terminal className="tech-quiz-result-icon" />
            <span>quiz_completed.log</span>
          </div>
          <div className="tech-quiz-result-border">
            <h2 className="tech-quiz-result-title">EXECUTION COMPLETE</h2>
            <div className="tech-quiz-result-box">
              <div className="tech-quiz-result-label">&gt; Results:</div>
              <div className="tech-quiz-result-row">
                Score: <span className="tech-quiz-result-value">{score}</span> / {totalQuestions}
              </div>
              <div className="tech-quiz-result-row">
                Accuracy: <span className="tech-quiz-result-value">{percentage}%</span>
              </div>
              <div className="tech-quiz-result-row">
                Status:{' '}
                <span className={percentage === 100 ? 'tech-quiz-result-status-perfect' : 'tech-quiz-result-status-complete'}>
                  {percentage === 100 ? 'PERFECT' : 'COMPLETE'}
                </span>
              </div>
            </div>
            <button onClick={restartQuiz} className="tech-quiz-result-btn">
              &gt; RESTART
            </button>
          </div>
        </div>
      );
    }

    if (visualStyle === 'corporate') {
      return (
        <div className="corporate-quiz-result-container">
          <div className="corporate-quiz-result-border">
            <h2 className="corporate-quiz-result-title">Assessment Complete</h2>
            <p className="corporate-quiz-result-text">
              Your score: <span className="corporate-quiz-result-score">{score}</span> / {totalQuestions}
            </p>
            <div className="corporate-quiz-result-performance">
              <div className="corporate-quiz-result-performance-row">
                <span>Performance</span>
                <span>{percentage}%</span>
              </div>
              <div className="corporate-quiz-result-progress-bar">
                <div className="corporate-quiz-result-progress-fill" style={{ width: `${percentage}%` }} />
              </div>
            </div>
            <button onClick={restartQuiz} className="corporate-quiz-result-btn">
              Retake Assessment
            </button>
          </div>
        </div>
      );
    }

    if (visualStyle === 'illustrated') {
      return (
        <div className="illustrated-quiz-result-container">
          <div className="illustrated-quiz-result-inner">
            <div className="illustrated-quiz-result-icon">💡</div>
            <h2 className="illustrated-quiz-result-title">Quiz Complete!</h2>
            <div className="illustrated-quiz-result-score-box">
              <p className="illustrated-quiz-result-score-text">
                Score: <span className="illustrated-quiz-result-score">{score}</span> / {totalQuestions}
              </p>
            </div>
            <button onClick={restartQuiz} className="illustrated-quiz-result-btn">
              Try Again!
            </button>
          </div>
        </div>
      );
    }

    if (visualStyle === 'picasso') {
      return (
        <div className="picasso-quiz-result-wrapper">
          <div className="picasso-quiz-result-deco-1"></div>
          <div className="picasso-quiz-result-deco-2"></div>
          <div className="picasso-quiz-result-container">
            <div className="picasso-quiz-result-header">
              <div className="picasso-quiz-result-title-wrapper">
                <div className="picasso-quiz-result-title-shadow"></div>
                <div className="picasso-quiz-result-title">Complete!</div>
              </div>
            </div>
            <div className="picasso-quiz-result-score-wrapper">
              <div className="picasso-quiz-result-score-shadow"></div>
              <div className="picasso-quiz-result-score-box">
                <div className="picasso-quiz-result-score-icon">{score}</div>
                <div>
                  <div className="picasso-quiz-result-score-label">Your Score</div>
                  <div className="picasso-quiz-result-score-value">{score} / {totalQuestions}</div>
                </div>
              </div>
            </div>
            <button onClick={restartQuiz} className="picasso-quiz-result-btn">
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (visualStyle === 'schoolr') {
      return (
        <div className="schoolr-quiz-result-container">
          <div className="schoolr-quiz-result-inner">
            <div className="schoolr-quiz-result-icon">
              <CheckCircle2 className="schoolr-quiz-result-icon-svg" />
            </div>
            <h2 className="schoolr-quiz-result-title">Ottimo lavoro!</h2>
            <p className="schoolr-quiz-result-text">
              Hai risposto correttamente a <span className="schoolr-quiz-result-score">{score}</span> su {totalQuestions} domande
            </p>
            <div className="schoolr-quiz-result-circle">
              <div className="schoolr-quiz-result-percentage">{percentage}%</div>
              <div className="schoolr-quiz-result-label">Punteggio</div>
            </div>
            <button onClick={restartQuiz} className="schoolr-quiz-result-btn">
              Riprova
            </button>
          </div>
        </div>
      );
    }

    if (visualStyle === 'plai') {
      return (
        <div className="plai-quiz-result-container">
          <div className="plai-quiz-result-inner">
            <h2 className="plai-quiz-result-title">Assessment Complete</h2>
            <p className="plai-quiz-result-subtitle">Your performance summary</p>
            <div className="plai-quiz-result-stats">
              <div className="plai-quiz-result-stat">
                <div className="plai-quiz-result-stat-value">{score}</div>
                <div className="plai-quiz-result-stat-label">Correct Answers</div>
                <div className="plai-quiz-result-stat-sub">Out of {totalQuestions} questions</div>
              </div>
              <div className="plai-quiz-result-stat">
                <div className="plai-quiz-result-stat-value">{percentage}%</div>
                <div className="plai-quiz-result-stat-label">Success Rate</div>
                <div className="plai-quiz-result-stat-sub">Performance measure</div>
              </div>
              <div className="plai-quiz-result-stat">
                <div className="plai-quiz-result-stat-value">{totalQuestions}</div>
                <div className="plai-quiz-result-stat-label">Total Questions</div>
                <div className="plai-quiz-result-stat-sub">Assessment completed</div>
              </div>
            </div>
            <button onClick={restartQuiz} className="plai-quiz-result-btn">
              Retake Assessment
            </button>
          </div>
        </div>
      );
    }

    if (visualStyle === 'studenti') {
      return (
        <div className="studenti-quiz-result-container">
          <div className="studenti-quiz-result-inner">
            <div className="studenti-quiz-result-icon">
              <CheckCircle2 className="studenti-quiz-result-icon-svg" />
            </div>
            <h2 className="studenti-quiz-result-title">Complimenti! Hai completato il quiz</h2>
            <p className="studenti-quiz-result-text">
              Hai dimostrato una buona preparazione rispondendo correttamente a <strong className="studenti-quiz-result-score">{score}</strong> domande su {totalQuestions}
            </p>
            <div className="studenti-quiz-result-score-box">
              <div className="studenti-quiz-result-stat">
                <div className="studenti-quiz-result-stat-value">{score}/{totalQuestions}</div>
                <div className="studenti-quiz-result-stat-label">Risposte corrette</div>
              </div>
              <div className="studenti-quiz-result-divider"></div>
              <div className="studenti-quiz-result-stat">
                <div className="studenti-quiz-result-stat-value">{percentage}%</div>
                <div className="studenti-quiz-result-stat-label">Percentuale</div>
              </div>
            </div>
            <button onClick={restartQuiz} className="studenti-quiz-result-btn">
              Ricomincia il quiz
            </button>
          </div>
        </div>
      );
    }
  }

  // Active Quiz Rendering - Similar to SingleQuiz but with multiple selection
  if (visualStyle === 'playful') {
    return (
      <div className="playful-quiz-container">
        <div className="playful-quiz-inner">
          <div className="playful-quiz-header">
            <div className="playful-quiz-badge">
              Question {currentQuestion}/{totalQuestions}
            </div>
            <div className="playful-quiz-score">
              Score: {score}
            </div>
          </div>
          
          <div className="playful-quiz-progress-bar">
            <div className="playful-quiz-progress-fill" style={{ width: `${((currentQuestion) / totalQuestions) * 100}%` }} />
          </div>

          <h3 className="playful-quiz-question">{questionVariants[currentQuestionIndex]}</h3>
          <p className="playful-quiz-instruction">Select all that apply</p>

          <div className="playful-quiz-options">
            {answers.map((answer, index) => {
              const isSelected = selectedAnswers.includes(answer);
              const isCorrect = correctAnswers.includes(answer);
              const showCorrect = showFeedback && isCorrect;
              const showIncorrect = showFeedback && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => !showFeedback && toggleAnswer(answer)}
                  disabled={showFeedback}
                  className={getOptionClass(answer)}
                >
                  <span>{answer}</span>
                  {showCorrect && <CheckCircle2 className="playful-quiz-icon" />}
                  {showIncorrect && <XCircle className="playful-quiz-icon" />}
                </button>
              );
            })}
          </div>

          {!showFeedback && selectedAnswers.length > 0 && (
            <button onClick={checkAnswer} className="playful-quiz-check-btn">
              Check Answers
            </button>
          )}

          {showFeedback && (
            <button onClick={nextQuestion} className="playful-quiz-next-btn">
              {currentQuestion < totalQuestions ? 'Next Question →' : 'See Results 🎯'}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (visualStyle === 'tech') {
    return (
      <div className="tech-quiz-container">
        <div className="tech-quiz-header-top">
          <Terminal className="tech-quiz-icon-terminal" />
          <span>quiz.execute()</span>
        </div>

        <div className="tech-quiz-header">
          <div className="tech-quiz-counter">
            [{currentQuestion}/{totalQuestions}]
          </div>
          <div className="tech-quiz-score-wrapper">
            <span>SCORE:</span>
            <span className="tech-quiz-score-badge">{score}</span>
          </div>
        </div>

        <div className="tech-quiz-progress-bar">
          <div className="tech-quiz-progress-fill" style={{ width: `${((currentQuestion) / totalQuestions) * 100}%` }} />
        </div>

        <h3 className="tech-quiz-question">{questionVariants[currentQuestionIndex]}</h3>
        <p className="tech-quiz-instruction">// select_all_correct()</p>

        <div className="tech-quiz-options">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswers.includes(answer);
            const isCorrect = correctAnswers.includes(answer);
            const showCorrect = showFeedback && isCorrect;
            const showIncorrect = showFeedback && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => !showFeedback && toggleAnswer(answer)}
                disabled={showFeedback}
                className={getOptionClass(answer)}
              >
                <span>&gt; {answer}</span>
                {showCorrect && <CheckCircle2 className="tech-quiz-icon" />}
                {showIncorrect && <XCircle className="tech-quiz-icon" />}
              </button>
            );
          })}
        </div>

        {!showFeedback && selectedAnswers.length > 0 && (
          <button onClick={checkAnswer} className="tech-quiz-check-btn">
            &gt; CHECK()
          </button>
        )}

        {showFeedback && (
          <button onClick={nextQuestion} className="tech-quiz-next-btn">
            {currentQuestion < totalQuestions ? '> NEXT_QUESTION()' : '> SHOW_RESULTS()'}
          </button>
        )}
      </div>
    );
  }

  if (visualStyle === 'corporate') {
    return (
      <div className="corporate-quiz-container">
        <div className="corporate-quiz-header">
          <div className="corporate-quiz-label">
            Question {currentQuestion} of {totalQuestions}
          </div>
          <div className="corporate-quiz-score-wrapper">
            <span>Score:</span>
            <span className="corporate-quiz-score-badge">{score}</span>
          </div>
        </div>

        <div className="corporate-quiz-progress-bar">
          <div className="corporate-quiz-progress-fill" style={{ width: `${((currentQuestion) / totalQuestions) * 100}%` }} />
        </div>

        <h3 className="corporate-quiz-question">{questionVariants[currentQuestionIndex]}</h3>
        <p className="corporate-quiz-instruction">Select all correct answers</p>

        <div className="corporate-quiz-options">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswers.includes(answer);
            const isCorrect = correctAnswers.includes(answer);
            const showCorrect = showFeedback && isCorrect;
            const showIncorrect = showFeedback && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => !showFeedback && toggleAnswer(answer)}
                disabled={showFeedback}
                className={getOptionClass(answer)}
              >
                <span>{answer}</span>
                {showCorrect && <CheckCircle2 className="corporate-quiz-icon" />}
                {showIncorrect && <XCircle className="corporate-quiz-icon" />}
              </button>
            );
          })}
        </div>

        {!showFeedback && selectedAnswers.length > 0 && (
          <button onClick={checkAnswer} className="corporate-quiz-check-btn">
            Submit Answers
          </button>
        )}

        {showFeedback && (
          <button onClick={nextQuestion} className="corporate-quiz-next-btn">
            {currentQuestion < totalQuestions ? 'Continue' : 'View Results'}
          </button>
        )}
      </div>
    );
  }

  if (visualStyle === 'illustrated') {
    return (
      <div className="illustrated-quiz-container">
        <div className="illustrated-quiz-header">
          <div className="illustrated-quiz-star">⭐</div>
          <div className="illustrated-quiz-badges">
            <div className="illustrated-quiz-badge">
              Q {currentQuestion}/{totalQuestions}
            </div>
            <div className="illustrated-quiz-score-badge">
              Score: {score}
            </div>
          </div>
        </div>

        <div className="illustrated-quiz-question-box">
          <h3 className="illustrated-quiz-question">{questionVariants[currentQuestionIndex]}</h3>
          <p className="illustrated-quiz-instruction">✨ Select all correct answers!</p>
        </div>

        <div className="illustrated-quiz-options">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswers.includes(answer);
            const isCorrect = correctAnswers.includes(answer);
            const showCorrect = showFeedback && isCorrect;
            const showIncorrect = showFeedback && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => !showFeedback && toggleAnswer(answer)}
                disabled={showFeedback}
                className={getOptionClass(answer)}
              >
                <span>{answer}</span>
                {showCorrect && <CheckCircle2 className="illustrated-quiz-icon" />}
                {showIncorrect && <XCircle className="illustrated-quiz-icon" />}
              </button>
            );
          })}
        </div>

        {!showFeedback && selectedAnswers.length > 0 && (
          <button onClick={checkAnswer} className="illustrated-quiz-check-btn">
            Check Answers
          </button>
        )}

        {showFeedback && (
          <button onClick={nextQuestion} className="illustrated-quiz-next-btn">
            {currentQuestion < totalQuestions ? (
              <>
                Next Question
                <span className="illustrated-quiz-star-running">⭐</span>
              </>
            ) : (
              'See Results'
            )}
          </button>
        )}
      </div>
    );
  }

  if (visualStyle === 'picasso') {
    return (
      <div className="picasso-quiz-wrapper">
        <div className="picasso-quiz-deco-1"></div>
        <div className="picasso-quiz-deco-2"></div>
        <div className="picasso-quiz-container">
          <div className="picasso-quiz-top-border"></div>
          
          <div className="picasso-quiz-header">
            <div className="picasso-quiz-badge-wrapper">
              <div className="picasso-quiz-badge-shadow"></div>
              <div className="picasso-quiz-badge">Q {currentQuestion}/{totalQuestions}</div>
            </div>
            <div className="picasso-quiz-badge-wrapper">
              <div className="picasso-quiz-badge-shadow"></div>
              <div className="picasso-quiz-badge picasso-quiz-score-badge">Score: {score}</div>
            </div>
          </div>

          <div className="picasso-quiz-question-wrapper">
            <div className="picasso-quiz-question-shadow"></div>
            <div className="picasso-quiz-question-box">
              <div className="picasso-quiz-question-border"></div>
              <h3 className="picasso-quiz-question">{questionVariants[currentQuestionIndex]}</h3>
              <p className="picasso-quiz-instruction">Select multiple</p>
            </div>
          </div>

          <div className="picasso-quiz-options">
            {answers.map((answer, index) => {
              const isSelected = selectedAnswers.includes(answer);
              const isCorrect = correctAnswers.includes(answer);
              const showCorrect = showFeedback && isCorrect;
              const showIncorrect = showFeedback && isSelected && !isCorrect;

              return (
                <div key={index} className="picasso-quiz-option-wrapper">
                  <div className="picasso-quiz-option-shadow"></div>
                  <button
                    onClick={() => !showFeedback && toggleAnswer(answer)}
                    disabled={showFeedback}
                    className={getOptionClass(answer)}
                  >
                    <span>{answer}</span>
                    {showCorrect && <CheckCircle2 className="picasso-quiz-icon" />}
                    {showIncorrect && <XCircle className="picasso-quiz-icon" />}
                  </button>
                </div>
              );
            })}
          </div>

          {!showFeedback && selectedAnswers.length > 0 && (
            <div className="picasso-quiz-btn-wrapper">
              <div className="picasso-quiz-btn-shadow"></div>
              <button onClick={checkAnswer} className="picasso-quiz-check-btn">
                Check Answers
              </button>
            </div>
          )}

          {showFeedback && (
            <div className="picasso-quiz-btn-wrapper">
              <div className="picasso-quiz-btn-shadow"></div>
              <button onClick={nextQuestion} className="picasso-quiz-next-btn">
                {currentQuestion < totalQuestions ? 'Next Question' : 'View Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (visualStyle === 'schoolr') {
    return (
      <div className="schoolr-quiz-container">
        <div className="schoolr-quiz-header">
          <div className="schoolr-quiz-badge">
            Domanda {currentQuestion} di {totalQuestions}
          </div>
          <div className="schoolr-quiz-score-badge">
            Punteggio: {score}
          </div>
        </div>

        <div className="schoolr-quiz-progress-bar">
          <div className="schoolr-quiz-progress-fill" style={{ width: `${((currentQuestion) / totalQuestions) * 100}%` }} />
        </div>

        <h3 className="schoolr-quiz-question">{questionVariants[currentQuestionIndex]}</h3>
        <p className="schoolr-quiz-instruction">Seleziona tutte le risposte corrette</p>

        <div className="schoolr-quiz-options">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswers.includes(answer);
            const isCorrect = correctAnswers.includes(answer);
            const showCorrect = showFeedback && isCorrect;
            const showIncorrect = showFeedback && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => !showFeedback && toggleAnswer(answer)}
                disabled={showFeedback}
                className={getOptionClass(answer)}
              >
                <span>{answer}</span>
                {showCorrect && <CheckCircle2 className="schoolr-quiz-icon" />}
                {showIncorrect && <XCircle className="schoolr-quiz-icon" />}
              </button>
            );
          })}
        </div>

        {!showFeedback && selectedAnswers.length > 0 && (
          <button onClick={checkAnswer} className="schoolr-quiz-check-btn">
            Verifica Risposte
          </button>
        )}

        {showFeedback && (
          <button onClick={nextQuestion} className="schoolr-quiz-next-btn">
            {currentQuestion < totalQuestions ? 'Prossima domanda →' : 'Vedi risultati'}
          </button>
        )}
      </div>
    );
  }

  if (visualStyle === 'plai') {
    return (
      <div className="plai-quiz-container">
        <div className="plai-quiz-header">
          <div>
            <div className="plai-quiz-label">
              Question {currentQuestion} of {totalQuestions}
            </div>
            <div className="plai-quiz-score-label">
              Current Score: <span className="plai-quiz-score">{score}</span>
            </div>
          </div>
        </div>

        <div className="plai-quiz-progress-bar">
          <div className="plai-quiz-progress-fill" style={{ width: `${((currentQuestion) / totalQuestions) * 100}%` }} />
        </div>

        <h3 className="plai-quiz-question">{questionVariants[currentQuestionIndex]}</h3>
        <p className="plai-quiz-instruction">Select all correct answers</p>

        <div className="plai-quiz-options">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswers.includes(answer);
            const isCorrect = correctAnswers.includes(answer);
            const showCorrect = showFeedback && isCorrect;
            const showIncorrect = showFeedback && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => !showFeedback && toggleAnswer(answer)}
                disabled={showFeedback}
                className={getOptionClass(answer)}
              >
                <span>{answer}</span>
                {showCorrect && <CheckCircle2 className="plai-quiz-icon" />}
                {showIncorrect && <XCircle className="plai-quiz-icon" />}
              </button>
            );
          })}
        </div>

        {!showFeedback && selectedAnswers.length > 0 && (
          <button onClick={checkAnswer} className="plai-quiz-check-btn">
            Submit Answers
          </button>
        )}

        {showFeedback && (
          <button onClick={nextQuestion} className="plai-quiz-next-btn">
            {currentQuestion < totalQuestions ? 'Continue to Next Question' : 'View Results'}
          </button>
        )}
      </div>
    );
  }

  if (visualStyle === 'studenti') {
    return (
      <div className="studenti-quiz-container">
        <div className="studenti-quiz-header">
          <div className="studenti-quiz-counter-wrapper">
            <div className="studenti-quiz-number">{currentQuestion}</div>
            <div>
              <div className="studenti-quiz-label">Domanda</div>
              <div className="studenti-quiz-count">{currentQuestion} di {totalQuestions}</div>
            </div>
          </div>
          <div className="studenti-quiz-score-badge">
            <span className="studenti-quiz-score-label">Punteggio:</span>
            <span className="studenti-quiz-score">{score}</span>
          </div>
        </div>

        <h3 className="studenti-quiz-question">{questionVariants[currentQuestionIndex]}</h3>
        <p className="studenti-quiz-instruction">Seleziona tutte le risposte corrette</p>

        <div className="studenti-quiz-options">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswers.includes(answer);
            const isCorrect = correctAnswers.includes(answer);
            const showCorrect = showFeedback && isCorrect;
            const showIncorrect = showFeedback && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => !showFeedback && toggleAnswer(answer)}
                disabled={showFeedback}
                className={getOptionClass(answer)}
              >
                <div className="studenti-quiz-option-content">
                  <div className="studenti-quiz-option-letter">{String.fromCharCode(65 + index)}</div>
                  <span>{answer}</span>
                </div>
                {showCorrect && <CheckCircle2 className="studenti-quiz-icon" />}
                {showIncorrect && <XCircle className="studenti-quiz-icon" />}
              </button>
            );
          })}
        </div>

        {!showFeedback && selectedAnswers.length > 0 && (
          <button onClick={checkAnswer} className="studenti-quiz-check-btn">
            Verifica Risposte
          </button>
        )}

        {showFeedback && (
          <button onClick={nextQuestion} className="studenti-quiz-next-btn">
            {currentQuestion < totalQuestions ? 'Prossima domanda →' : 'Vedi i risultati'}
          </button>
        )}
      </div>
    );
  }

  // Default fallback
  return <div>Unknown style</div>;
};

export default MultiQuiz;
