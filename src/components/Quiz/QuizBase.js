import React, { useEffect } from 'react';
import '../../styles/QuizBase.css';

const QuizBase = ({
  theme,
  children,
  actionsContent,
  timerEnabled = true,
  timeLeft = 0,
  setTimeLeft,
  currentQuestion = 1,
  totalQuestions = 10
}) => {
  useEffect(() => {
    if (!timerEnabled) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerEnabled, setTimeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="quiz-container-card" style={{
      backgroundColor: theme.background,
      borderColor: theme.cardBorder
    }}>
      <div className="header">
        <h1 className="headline" style={{ color: theme.popoverForeground }}>
          Quiz astronomia
        </h1>

        <div className="progress-section">
          <div className="progress-counter" style={{ color: theme.popoverForeground }}>
            {currentQuestion}/{totalQuestions}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                backgroundColor: theme.primary,
                width: `${(currentQuestion / totalQuestions) * 100}%`
              }}
            />
          </div>
          {timerEnabled && (
            <div className="timer">
              <svg className="timer-icon" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke={theme.foreground} strokeWidth="2"/>
                <path d="M10 6V10L13 13" stroke={theme.foreground} strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div className="timer-text" style={{ color: theme.foreground }}>
                {formatTime(timeLeft)}
              </div>
            </div>
          )}
        </div>

        <div className="actions">
          {actionsContent}
        </div>
      </div>

      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default QuizBase;