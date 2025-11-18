import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, XCircle, Terminal, Clock } from 'lucide-react';
import quizData from '../../data/quiz.json';

const SingleQuiz = ({
  visualStyle = 'playful',
  timerEnabled = true,
  timerDuration = 300,
  immediateFeedbackEnabled = true,
  answersCount = 4,
  correctPoints = 1,
  incorrectPoints = -1
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const questions = quizData.quiz || [];
  const [totalQuestions] = useState(questions.length || 0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);

  // Timer countdown effect
  useEffect(() => {
    if (timerEnabled && timeRemaining > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setQuizCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timerEnabled, timeRemaining, quizCompleted]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeRemaining(timerDuration);
  }, [timerDuration]);

  const [currentQuestionIndex] = useState(0);

  const currentQuestionData = useMemo(() => {
    if (!questions.length) return null;
    const index = (currentQuestion - 1) % questions.length;
    return questions[index];
  }, [questions, currentQuestion]);

  const { questionVariants, answers, correctAnswer, answerExplanations } = useMemo(() => {
    if (!currentQuestionData) {
      return {
        questionVariants: ['Nessuna domanda disponibile.'],
        answers: [],
        correctAnswer: null,
        answerExplanations: {}
      };
    }

    const baseQuestion = currentQuestionData.question;
    const variants = [
      baseQuestion,
      baseQuestion,
      baseQuestion
    ];

    const allOptions = currentQuestionData.options || [];
    const correctOptions = allOptions.filter((o) => o.is_correct);
    const incorrectOptions = allOptions.filter((o) => !o.is_correct);

    // Fallback: if no explicit correct option is marked, treat first as correct
    const effectiveCorrectOptions = correctOptions.length ? correctOptions : (allOptions[0] ? [allOptions[0]] : []);

    const maxAnswers = Math.max(Math.min(answersCount, allOptions.length), 2);

    const pickedAnswers = [];

    if (effectiveCorrectOptions.length) {
      const correctOpt = effectiveCorrectOptions[Math.floor(Math.random() * effectiveCorrectOptions.length)];
      pickedAnswers.push(correctOpt);
    }

    const remainingIncorrect = incorrectOptions.filter(
      (opt) => !pickedAnswers.some((p) => p.id === opt.id)
    );

    while (pickedAnswers.length < maxAnswers && remainingIncorrect.length) {
      const idx = Math.floor(Math.random() * remainingIncorrect.length);
      pickedAnswers.push(remainingIncorrect[idx]);
      remainingIncorrect.splice(idx, 1);
    }

    while (pickedAnswers.length < maxAnswers) {
      const allPool = allOptions.filter(
        (opt) => !pickedAnswers.some((p) => p.id === opt.id)
      );
      if (!allPool.length) break;
      const idx = Math.floor(Math.random() * allPool.length);
      pickedAnswers.push(allPool[idx]);
    }

    // Shuffle so the correct answer index is random
    for (let i = pickedAnswers.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pickedAnswers[i], pickedAnswers[j]] = [pickedAnswers[j], pickedAnswers[i]];
    }

    const correct = pickedAnswers.find((opt) => opt.is_correct) || pickedAnswers[0] || null;

    const explanationMap = pickedAnswers.reduce((acc, opt) => {
      acc[opt.text] = opt.explanation || '';
      return acc;
    }, {});

    return {
      questionVariants: variants,
      answers: pickedAnswers.map((opt) => opt.text),
      correctAnswer: correct ? correct.text : null,
      answerExplanations: explanationMap
    };
  }, [currentQuestionData, answersCount]);
  const selectAnswer = (answer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);

    const isCorrect = answer === correctAnswer;
    const delta = isCorrect ? correctPoints : incorrectPoints;

    setScore(prev => prev + delta);
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }

    if (immediateFeedbackEnabled) {
      setTimeout(() => {
        setShowFeedback(true);
      }, 300);
    } else {
      setTimeout(() => {
        nextQuestion();
      }, 500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion >= totalQuestions) {
      setQuizCompleted(true);
      return;
    }
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCurrentQuestion(prev => prev + 1);
  };

  const restartQuiz = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setCurrentQuestion(1);
    setQuizCompleted(false);
    setCorrectAnswersCount(0);
    setTimeRemaining(timerDuration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const explanationText =
    selectedAnswer !== null && answerExplanations[selectedAnswer]
      ? answerExplanations[selectedAnswer]
      : '';
  const shouldShowExplanation =
    immediateFeedbackEnabled && selectedAnswer !== null && explanationText;

  const ExplanationBlock = () => {
    if (!shouldShowExplanation) return null;
    return (
      <div className={`quiz-explanation quiz-explanation-${visualStyle}`}>
        <div className="quiz-explanation-title">
          <span>💡</span>
          Spiegazione
        </div>
        <p className="quiz-explanation-text">{explanationText}</p>
      </div>
    );
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

  // Render End Quiz Components for each style
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
            <div className="illustrated-quiz-result-icon">
              <img src="/super.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
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
      // Picasso result screen - match Figma / Design Variations layout
      return (
        <div style={{ maxWidth: '42rem', position: 'relative' }}>
          {/* Decorative geometric shapes */}
          <div
            style={{
              position: 'absolute',
              top: '-2rem',
              left: '-2rem',
              width: '6rem',
              height: '6rem',
              background: '#d97706',
              transform: 'rotate(45deg)',
              opacity: 0.3
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-1.5rem',
              right: '-1.5rem',
              width: '8rem',
              height: '8rem',
              background: '#0284c7',
              borderRadius: '9999px',
              opacity: 0.2
            }}
          />

          <div
            style={{
              background:
                'linear-gradient(to bottom right, rgb(255, 251, 235), rgb(255, 241, 242))',
              border: '4px solid rgb(41, 37, 36)',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Abstract background shapes */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '10rem',
                height: '10rem',
                background: 'rgba(56, 189, 248, 0.2)',
                transform: 'rotate(-12deg)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '8rem',
                height: '8rem',
                background: 'rgba(251, 191, 36, 0.2)',
                borderRadius: '9999px'
              }}
            />

            <div style={{ position: 'relative', zIndex: 10 }}>
              {/* Geometric header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgb(251, 113, 133)',
                      transform: 'rotate(3deg)'
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      background: 'rgb(14, 165, 233)',
                      padding: '0.75rem 2rem',
                      transform: 'rotate(-2deg)',
                      border: '3px solid rgb(41, 37, 36)'
                    }}
                  >
                    <h2
                      style={{
                        fontSize: '1.875rem',
                        color: 'rgb(28, 25, 23)'
                      }}
                    >
                      Complete!
                    </h2>
                  </div>
                </div>
              </div>

              {/* Score display with cubist style */}
              <div
                style={{
                  marginBottom: '2rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgb(245, 158, 11)',
                      transform: 'translateX(0.5rem) translateY(0.5rem)'
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      background: 'white',
                      border: '4px solid rgb(41, 37, 36)',
                      padding: '1.5rem',
                      transform: 'rotate(-1deg)'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div
                        style={{
                          width: '4rem',
                          height: '4rem',
                          background:
                            'linear-gradient(to bottom right, rgb(56, 189, 248), rgb(14, 116, 144))',
                          border: '3px solid rgb(41, 37, 36)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: 'rotate(45deg)'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '1.5rem',
                            color: 'white',
                            transform: 'rotate(-45deg)'
                          }}
                        >
                          {score}
                        </span>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ color: 'rgb(87, 83, 78)' }}>
                          Your Score
                        </div>
                        <div
                          style={{
                            fontSize: '1.5rem',
                            color: 'rgb(28, 25, 23)'
                          }}
                        >
                          {score} / {totalQuestions}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Restart button with offset shadow */}
              <button
                type="button"
                onClick={restartQuiz}
                style={{
                  width: '100%',
                  position: 'relative',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgb(41, 37, 36)',
                    transform: 'translateX(0.25rem) translateY(0.25rem)'
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    background:
                      'linear-gradient(to right, rgb(245, 158, 11), rgb(244, 63, 94))',
                    border: '4px solid rgb(41, 37, 36)',
                    padding: '1rem 2rem',
                    color: 'rgb(28, 25, 23)'
                  }}
                >
                  Try Again
                </div>
              </button>
            </div>
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

  // Active Quiz Rendering for each style
  if (visualStyle === 'playful') {
    return (
      <div className="playful-quiz-container">
        <div className="playful-quiz-inner">
          <div className="playful-quiz-header">
            <div className="playful-quiz-badge">
              Question {currentQuestion}/{totalQuestions}
            </div>
            {timerEnabled && (
              <div className={`playful-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                <Clock size={20} />
                {formatTime(timeRemaining)}
              </div>
            )}
            {immediateFeedbackEnabled && (
              <div className="playful-quiz-score">
                Score: {score}
              </div>
            )}
          </div>
          
          <div className="playful-quiz-progress-bar">
            <div className="playful-quiz-progress-fill" style={{ width: `${((currentQuestion) / totalQuestions) * 100}%` }} />
          </div>

          <h3 className="playful-quiz-question">{questionVariants[currentQuestionIndex]}</h3>

          <div className="playful-quiz-options">
            {answers.map((answer, index) => {
              const isSelected = selectedAnswer === answer;
              const isCorrect = answer === correctAnswer;
              const showCorrect = immediateFeedbackEnabled && selectedAnswer !== null && isCorrect;
              const showIncorrect = immediateFeedbackEnabled && selectedAnswer !== null && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => selectedAnswer === null && selectAnswer(answer)}
                  disabled={selectedAnswer !== null}
                  className={getOptionClass(answer)}
                >
                  <span>{answer}</span>
                  {showCorrect && <CheckCircle2 className="playful-quiz-icon" />}
                  {showIncorrect && <XCircle className="playful-quiz-icon" />}
                </button>
              );
            })}
          </div>

          <ExplanationBlock />

          {immediateFeedbackEnabled && selectedAnswer !== null && (
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
          {timerEnabled && (
            <div className={`tech-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
              <Clock />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          )}
          {immediateFeedbackEnabled && (
            <div className="tech-quiz-score-wrapper">
              <span>SCORE:</span>
              <span className="tech-quiz-score-badge">{score}</span>
            </div>
          )}
        </div>

        <div className="tech-quiz-progress-bar">
          <div className="tech-quiz-progress-fill" style={{ width: `${((currentQuestion) / totalQuestions) * 100}%` }} />
        </div>

        <h3 className="tech-quiz-question">{questionVariants[currentQuestionIndex]}</h3>

        <div className="tech-quiz-options">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isCorrect = answer === correctAnswer;
            const showCorrect = immediateFeedbackEnabled && selectedAnswer !== null && isCorrect;
            const showIncorrect = immediateFeedbackEnabled && selectedAnswer !== null && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => selectedAnswer === null && selectAnswer(answer)}
                disabled={selectedAnswer !== null}
                className={getOptionClass(answer)}
              >
                <span>&gt; {answer}</span>
                {showCorrect && <CheckCircle2 className="tech-quiz-icon" />}
                {showIncorrect && <XCircle className="tech-quiz-icon" />}
              </button>
            );
          })}
        </div>

        <ExplanationBlock />

        {immediateFeedbackEnabled && selectedAnswer !== null && (
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
          {timerEnabled && (
            <div className={`corporate-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
              <Clock />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          )}
          {immediateFeedbackEnabled && (
            <div className="corporate-quiz-score-wrapper">
              <span>Score:</span>
              <span className="corporate-quiz-score-badge">{score}</span>
            </div>
          )}
        </div>

        <div className="corporate-quiz-progress-bar">
          <div className="corporate-quiz-progress-fill" style={{ width: `${((currentQuestion) / totalQuestions) * 100}%` }} />
        </div>

        <h3 className="corporate-quiz-question">{questionVariants[currentQuestionIndex]}</h3>

        <div className="corporate-quiz-options">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isCorrect = answer === correctAnswer;
            const showCorrect = immediateFeedbackEnabled && selectedAnswer !== null && isCorrect;
            const showIncorrect = immediateFeedbackEnabled && selectedAnswer !== null && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => selectedAnswer === null && selectAnswer(answer)}
                disabled={selectedAnswer !== null}
                className={getOptionClass(answer)}
              >
                <span>{answer}</span>
                {showCorrect && <CheckCircle2 className="corporate-quiz-icon" />}
                {showIncorrect && <XCircle className="corporate-quiz-icon" />}
              </button>
            );
          })}
        </div>

        <ExplanationBlock />

        {immediateFeedbackEnabled && selectedAnswer !== null && (
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
          <div className="illustrated-quiz-star">
            <img src="/dubbioso_pensieroso.png" alt="" className="illustrated-quiz-star-icon" />
          </div>
          <div className="illustrated-quiz-badges">
            <div className="illustrated-quiz-badge">
              {currentQuestion}/{totalQuestions}
            </div>
            {timerEnabled && (
              <div className={`illustrated-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                <Clock />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            {immediateFeedbackEnabled && (
              <div className="illustrated-quiz-score-badge">
                Score: {score}
              </div>
            )}
          </div>
        </div>

        <div className="illustrated-quiz-question-box">
          <h3 className="illustrated-quiz-question">{questionVariants[currentQuestionIndex]}</h3>
        </div>

        <div className="illustrated-quiz-options">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isCorrect = answer === correctAnswer;
            const showCorrect = immediateFeedbackEnabled && selectedAnswer !== null && isCorrect;
            const showIncorrect = immediateFeedbackEnabled && selectedAnswer !== null && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => selectedAnswer === null && selectAnswer(answer)}
                disabled={selectedAnswer !== null}
                className={getOptionClass(answer)}
              >
                <span>{answer}</span>
                {showCorrect && <CheckCircle2 className="illustrated-quiz-icon" />}
                {showIncorrect && <XCircle className="illustrated-quiz-icon" />}
              </button>
            );
          })}
        </div>

        <ExplanationBlock />

          {immediateFeedbackEnabled && selectedAnswer !== null && (
            <button onClick={nextQuestion} className="illustrated-quiz-next-btn">
              {currentQuestion < totalQuestions ? (
                <>
                  Next Question
                  <img src="/corre.png" alt="" className="illustrated-quiz-star-running" />
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
    // Picasso active quiz layout - match Figma / Design Variations
    return (
      <div style={{ maxWidth: '42rem', position: 'relative' }}>
        {/* Decorative geometric shapes */}
        <div
          style={{
            position: 'absolute',
            top: '-2rem',
            left: '-2rem',
            width: '6rem',
            height: '6rem',
            background: 'rgb(217, 119, 6)',
            transform: 'rotate(45deg)',
            opacity: 0.3
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-1.5rem',
            right: '-1.5rem',
            width: '8rem',
            height: '8rem',
            background: 'rgb(2, 132, 199)',
            borderRadius: '9999px',
            opacity: 0.2
          }}
        />

        <div
          style={{
            background:
              'linear-gradient(to bottom right, rgb(255, 251, 235), rgb(255, 241, 242))',
            border: '4px solid rgb(41, 37, 36)',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Abstract background blocks */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '10rem',
              height: '10rem',
              background: 'rgba(56, 189, 248, 0.2)',
              transform: 'rotate(-12deg)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '8rem',
              height: '8rem',
              background: 'rgba(251, 191, 36, 0.2)',
              borderRadius: '9999px'
            }}
          />

          <div style={{ position: 'relative', zIndex: 10 }}>
            {/* Header badges */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgb(2, 132, 199)',
                    transform: 'translateX(0.25rem) translateY(0.25rem)'
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    border: '3px solid rgb(41, 37, 36)',
                    padding: '0.5rem 1rem',
                    background: 'rgb(56, 189, 248)'
                  }}
                >
                  <span>{currentQuestion}/{totalQuestions}</span>
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

              {immediateFeedbackEnabled && (
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgb(217, 119, 6)',
                      transform: 'translateX(-0.25rem) translateY(0.25rem)'
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      border: '3px solid rgb(41, 37, 36)',
                      padding: '0.5rem 1rem',
                      background: 'rgb(251, 191, 36)'
                    }}
                  >
                    <span>Score: {score}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Question box with colored edge */}
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '-0.75rem',
                  top: '0.75rem',
                  width: '100%',
                  height: '100%',
                  background: 'rgba(251, 113, 133, 0.4)',
                  transform: 'rotate(-1deg)'
                }}
              />
              <div
                style={{
                  position: 'relative',
                  background: 'white',
                  border: '4px solid rgb(41, 37, 36)',
                  padding: '1.5rem',
                  transform: 'rotate(1deg)'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '0.75rem',
                    height: '100%',
                    background: 'rgb(14, 165, 233)'
                  }}
                />
                <h3
                  style={{
                    fontSize: '1.25rem',
                    color: 'rgb(28, 25, 23)',
                    paddingLeft: '1rem'
                  }}
                >
                  {questionVariants[currentQuestionIndex]}
                </h3>
              </div>
            </div>

            {/* Options with shadow wrappers */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}
            >
              {answers.map((answer, index) => {
                const isSelected = selectedAnswer === answer;
                const isCorrect = answer === correctAnswer;
                const showCorrect = immediateFeedbackEnabled && selectedAnswer !== null && isCorrect;
                const showIncorrect =
                  immediateFeedbackEnabled && selectedAnswer !== null && isSelected && !isCorrect;

                return (
                  <div
                    key={index}
                    style={{
                      width: '100%',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgb(41, 37, 36)',
                        transform: 'translateX(0.25rem) translateY(0.25rem)'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        selectedAnswer === null && selectAnswer(answer)
                      }
                      disabled={selectedAnswer !== null}
                      className={getOptionClass(answer)}
                      style={{
                        position: 'relative',
                        borderWidth: '3px'
                      }}
                    >
                      <span>{answer}</span>
                      {showCorrect && (
                        <CheckCircle2 className="picasso-quiz-icon" />
                      )}
                      {showIncorrect && (
                        <XCircle className="picasso-quiz-icon" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <ExplanationBlock />

            {/* Next button with shadow */}
            {immediateFeedbackEnabled && selectedAnswer !== null && (
              <div className="picasso-quiz-next-btn-wrapper">
                <div className="picasso-quiz-next-btn-shadow" />
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="picasso-quiz-next-btn"
                >
                  {currentQuestion < totalQuestions
                    ? 'Next Question'
                    : 'View Results'}
                </button>
              </div>
            )}
          </div>
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
          {timerEnabled && (
            <div className={`schoolr-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
              <Clock />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          )}
          {immediateFeedbackEnabled && (
            <div className="schoolr-quiz-score-badge">
              Punteggio: {score}
            </div>
          )}
        </div>

        <div className="schoolr-quiz-progress-bar">
          <div className="schoolr-quiz-progress-fill" style={{ width: `${((currentQuestion) / totalQuestions) * 100}%` }} />
        </div>

        <h3 className="schoolr-quiz-question">{questionVariants[currentQuestionIndex]}</h3>

        <div className="schoolr-quiz-options">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isCorrect = answer === correctAnswer;
            const showCorrect = immediateFeedbackEnabled && selectedAnswer !== null && isCorrect;
            const showIncorrect = immediateFeedbackEnabled && selectedAnswer !== null && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => selectedAnswer === null && selectAnswer(answer)}
                disabled={selectedAnswer !== null}
                className={getOptionClass(answer)}
              >
                <span>{answer}</span>
                {showCorrect && <CheckCircle2 className="schoolr-quiz-icon" />}
                {showIncorrect && <XCircle className="schoolr-quiz-icon" />}
              </button>
            );
          })}
        </div>

        <ExplanationBlock />

        {immediateFeedbackEnabled && selectedAnswer !== null && (
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
            {immediateFeedbackEnabled && (
              <div className="plai-quiz-score-label">
                Current Score: <span className="plai-quiz-score">{score}</span>
              </div>
            )}
          </div>
          {timerEnabled && (
            <div className={`plai-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
              <span className="plai-timer-label">Time</span>
              <Clock />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>

        <div className="plai-quiz-progress-bar">
          <div className="plai-quiz-progress-fill" style={{ width: `${((currentQuestion) / totalQuestions) * 100}%` }} />
        </div>

        <h3 className="plai-quiz-question">{questionVariants[currentQuestionIndex]}</h3>

        <div className="plai-quiz-options">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isCorrect = answer === correctAnswer;
            const showCorrect = immediateFeedbackEnabled && selectedAnswer !== null && isCorrect;
            const showIncorrect = immediateFeedbackEnabled && selectedAnswer !== null && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => selectedAnswer === null && selectAnswer(answer)}
                disabled={selectedAnswer !== null}
                className={getOptionClass(answer)}
              >
                <span>{answer}</span>
                {showCorrect && <CheckCircle2 className="plai-quiz-icon" />}
                {showIncorrect && <XCircle className="plai-quiz-icon" />}
              </button>
            );
          })}
        </div>

        <ExplanationBlock />

        {immediateFeedbackEnabled && selectedAnswer !== null && (
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
          {timerEnabled && (
            <div className={`studenti-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
              <Clock />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          )}
          {immediateFeedbackEnabled && (
            <div className="studenti-quiz-score-badge">
              <span className="studenti-quiz-score-label">Punteggio:</span>
              <span className="studenti-quiz-score">{score}</span>
            </div>
          )}
        </div>

        <h3 className="studenti-quiz-question">{questionVariants[currentQuestionIndex]}</h3>

        <div className="studenti-quiz-options">
          {answers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isCorrect = answer === correctAnswer;
            const showCorrect = immediateFeedbackEnabled && selectedAnswer !== null && isCorrect;
            const showIncorrect = immediateFeedbackEnabled && selectedAnswer !== null && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => selectedAnswer === null && selectAnswer(answer)}
                disabled={selectedAnswer !== null}
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

        <ExplanationBlock />

        {immediateFeedbackEnabled && selectedAnswer !== null && (
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

export default SingleQuiz;
