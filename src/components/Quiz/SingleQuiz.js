import React, { useState } from 'react';
import QuizBase from './QuizBase';

const SingleQuiz = ({ theme, timerEnabled = true, immediateFeedbackEnabled = true }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(85);
  const [score, setScore] = useState(125);
  const [currentQuestion, setCurrentQuestion] = useState(8);
  const [totalQuestions] = useState(10);
  const [pointsAwarded, setPointsAwarded] = useState(false);

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

    // Show feedback immediately if enabled, otherwise wait for user action
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

  const checkAnswer = () => {
    setShowFeedback(true);
    if (selectedAnswer === correctAnswer && !pointsAwarded) {
      setScore(prev => prev + 25);
      setPointsAwarded(true);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setPointsAwarded(false);
    setCurrentQuestion(prev => Math.min(prev + 1, totalQuestions));
  };

  const shuffleAnswers = () => {
    const shuffled = [...answers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setAnswers(shuffled);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setPointsAwarded(false);
  };

  const rephraseQuestion = () => {
    const nextIndex = (currentQuestionIndex + 1) % questionVariants.length;
    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setPointsAwarded(false);
  };

  const prevQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setPointsAwarded(false);
    setCurrentQuestion(prev => Math.max(prev - 1, 1));
  };

  // Actions content
  const actionsContent = (
    <>
      <button className="action-button" onClick={shuffleAnswers}>
        <span>Mescola</span>
        <svg className="action-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2 16.25a.75.75 0 0 0 0 1.5zm8.748-2.163l-.643-.386zm2.504-4.174l.643.386zM22 7l.53.53a.75.75 0 0 0 0-1.06zm-2.53 1.47a.75.75 0 0 0 1.06 1.06zm1.06-4a.75.75 0 1 0-1.06 1.06zm-5.31 2.92l-.369-.653zM2 17.75h3.603v-1.5H2zm9.39-3.277l2.505-4.174l-1.286-.772l-2.504 4.174zm7.007-6.723H22v-1.5h-3.603zm3.073-1.28l-2 2l1.06 1.06l2-2zm1.06 0l-2-2l-1.06 1.06l2 2zm-8.635 3.829c.434-.724.734-1.22 1.006-1.589c.263-.355.468-.543.689-.668l-.739-1.305c-.467.264-.82.627-1.155 1.08c-.326.44-.668 1.011-1.087 1.71zm4.502-4.049c-.815 0-1.48 0-2.025.052c-.562.055-1.054.17-1.521.435l.739 1.305c.22-.125.487-.204.927-.247c.456-.044 1.036-.045 1.88-.045zM5.603 17.75c.815 0 1.48 0 2.025-.052c.562-.055 1.054-.17 1.521-.435l-.739-1.305c-.22.125-.487.204-.927.247c-.456.044-1.036.045-1.88.045zm4.502-4.049c-.435.724-.734 1.22-1.006 1.589c-.263.355-.468.543-.689.668l.74 1.305c.466-.264.819-.627 1.154-1.08c.326-.44.668-1.011 1.087-1.71zM2 6.25a.75.75 0 0 0 0 1.5zM22 17l.53.53a.75.75 0 0 0 0-1.06zm-1.47-2.53a.75.75 0 1 0-1.06 1.06zm-1.06 4a.75.75 0 1 0 1.06 1.06zm-3.345-1.525l.144-.736zm-1.682-2.33a.75.75 0 1 0-1.286.77zm.025 1.391l.558-.501zm-6.593-8.95l.143-.737zm1.682 2.33a.75.75 0 0 0 1.286-.772zm-.025-1.393l-.558.502zM2 7.75h4.668v-1.5H2zm15.332 10H22v-1.5h-4.668zm5.198-1.28l-2-2l-1.06 1.06l2 2zm-1.06 0l-2 2l1.06 1.06l2-2zm-4.138-.22c-.645 0-.867-.003-1.063-.041l-.287 1.472c.372.072.765.069 1.35.069zm-4.175-.864c.3.502.5.84.754 1.122l1.115-1.003c-.134-.149-.25-.337-.583-.89zm3.112.823a2.25 2.25 0 0 1-1.243-.704l-1.115 1.003a3.75 3.75 0 0 0 2.071 1.173zM6.668 7.75c.645 0 .867.003 1.063.041l.287-1.472c-.372-.072-.765-.069-1.35-.069zm4.175.864c-.3-.502-.5-.84-.754-1.122L8.974 8.495c.134.149.25.337.583.89zm-3.112-.823c.48.094.916.34 1.243.704l1.115-1.003a3.75 3.75 0 0 0-2.071-1.173z"/></svg>
      </button>
      <button className="action-button" onClick={rephraseQuestion}>
        <span>Riformula</span>
        <svg className="action-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m6.85 19l.85.85q.3.3.288.7t-.288.7q-.3.3-.712.313t-.713-.288L3.7 18.7q-.15-.15-.213-.325T3.426 18t.063-.375t.212-.325l2.575-2.575q.3-.3.713-.287t.712.312q.275.3.288.7t-.288.7l-.85.85H17v-3q0-.425.288-.712T18 13t.713.288T19 14v3q0 .825-.587 1.413T17 19zm10.3-12H7v3q0 .425-.288.713T6 11t-.712-.288T5 10V7q0-.825.588-1.412T7 5h10.15l-.85-.85q-.3-.3-.288-.7t.288-.7q.3-.3.712-.312t.713.287L20.3 5.3q.15.15.213.325t.062.375t-.062.375t-.213.325l-2.575 2.575q-.3.3-.712.288T16.3 9.25q-.275-.3-.288-.7t.288-.7z"/></svg>
      </button>
    </>
  );

  // Main content
  const content = (
    <>
      <p className="question" style={{ color: theme.foreground }}>
        {questionVariants[currentQuestionIndex]}
      </p>

      <div className="answers">
        {answers.map((answer, index) => (
          <div
            key={index}
            className="answer-option"
            onClick={() => selectAnswer(answer)}
          >
            <div
              className={`radio-button ${selectedAnswer === answer ? 'selected' : ''}`}
              style={{
                borderColor: selectedAnswer === answer ? theme.primary : theme.mutedBorder
              }}
            >
              {selectedAnswer === answer && (
                <div
                  className="radio-dot"
                  style={{ backgroundColor: theme.primary }}
                />
              )}
            </div>
            <p className="answer-text" style={{ color: theme.foreground }}>
              {answer}
            </p>
          </div>
        ))}
      </div>
    </>
  );

  // Feedback content
  const feedbackContent = showFeedback && (
    <div
      className="feedback"
      style={{
        backgroundColor: selectedAnswer === correctAnswer ? '#a2b99c' : '#ff9359'
      }}
    >
      <svg className="feedback-icon" viewBox="0 0 20 20" fill="none">
        {selectedAnswer === correctAnswer ? (
          <path d="M10 2l2.39 4.84L18 7.46l-4 3.9.94 5.5L10 14.24 5.06 16.86l.94-5.5-4-3.9 5.61-.62L10 2z"
            fill="#121c12" stroke="#121c12" strokeWidth="2"/>
        ) : (
          <>
            <circle cx="10" cy="10" r="8" stroke="#440a06" strokeWidth="2"/>
            <path d="M10 6v4m0 4h.01" stroke="#440a06" strokeWidth="2" strokeLinecap="round"/>
          </>
        )}
      </svg>
      <div className="feedback-content">
        <div
          className="feedback-title"
          style={{
            color: selectedAnswer === correctAnswer ? '#121c12' : '#440a06'
          }}
        >
          {selectedAnswer === correctAnswer ? 'Fantastico!' : 'Risposta Sbagliata'}
        </div>
        <div
          className="feedback-message"
          style={{
            color: selectedAnswer === correctAnswer ? '#121c12' : '#440a06'
          }}
        >
          {selectedAnswer === correctAnswer
            ? 'Hai risposto correttamente! Giove è effettivamente il pianeta più grande del nostro sistema solare.'
            : 'Giove è in realtà il pianeta più grande del nostro sistema solare.'
          }
        </div>
      </div>
      <div
        className="feedback-score"
        style={{
          color: selectedAnswer === correctAnswer ? '#121c12' : '#440a06'
        }}
      >
        <div className="score-points">
          {selectedAnswer === correctAnswer ? '+25p' : '+0p'}
        </div>
        <div className="score-total">{score}/500</div>
      </div>
    </div>
  );

  // Navigation content
  const navigationContent = (
    <>
      <button
        className="nav-button prev-button"
        onClick={prevQuestion}
        style={{
          borderColor: theme.mutedBorder,
          color: theme.secondary
        }}
      >
        <svg className="nav-icon" viewBox="0 0 20 20" fill="none">
          <path d="M12 5l-5 5 5 5" stroke={theme.secondary} strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>Precedente</span>
      </button>

      {!immediateFeedbackEnabled && (
        <button
          className="nav-button check-button"
          onClick={checkAnswer}
          disabled={!selectedAnswer || showFeedback}
          style={{
            backgroundColor: selectedAnswer && !showFeedback ? theme.secondary : theme.muted,
            color: selectedAnswer && !showFeedback ? theme.primaryForeground : theme.mutedForeground,
            cursor: selectedAnswer && !showFeedback ? 'pointer' : 'not-allowed',
            opacity: selectedAnswer && !showFeedback ? 1 : 0.6
          }}
        >
          <span>Controlla</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.03 10.03a.75.75 0 1 0-1.06-1.06l-4.47 4.47l-1.47-1.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0z"/><path fill="currentColor" fillRule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75S22.75 17.937 22.75 12S17.937 1.25 12 1.25M2.75 12a9.25 9.25 0 1 1 18.5 0a9.25 9.25 0 0 1-18.5 0" clipRule="evenodd"/></svg>
        </button>
      )}

      <button
        className="nav-button next-button"
        onClick={nextQuestion}
        style={{
          backgroundColor: theme.primary,
          color: theme.primaryForeground,
          cursor: 'pointer'
        }}
      >
        <span>Successivo</span>
        <svg className="nav-icon" viewBox="0 0 20 20" fill="none">
            <path d="M8 5l5 5-5 5" stroke={theme.primaryForeground} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </>
  );

  return (
    <QuizBase
      theme={theme}
      timerEnabled={timerEnabled}
      timeLeft={timeLeft}
      setTimeLeft={setTimeLeft}
      currentQuestion={currentQuestion}
      totalQuestions={totalQuestions}
      actionsContent={actionsContent}
    >
      {content}
      {feedbackContent}
      <div className="navigation">
        {navigationContent}
      </div>
    </QuizBase>
  );
};

export default SingleQuiz;