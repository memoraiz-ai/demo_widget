/**
 * Crossword Component
 * Interactive crossword puzzle with multiple visual styles
 * Supports difficulty levels (easy, medium, hard) and customizable timer
 *
 * @component
 * @param {Object} props
 * @param {string} [props.visualStyle="playful"] - Visual theme style
 * @param {string} [props.crosswordDifficulty="easy"] - Puzzle difficulty level
 * @param {boolean} [props.showHints=true] - Show hint reveal button
 * @param {boolean} [props.timerEnabled=true] - Enable countdown timer
 * @param {number} [props.timerDuration=300] - Timer duration in seconds
 * @param {React.Ref} ref - Imperative handle for external control
 * @returns {JSX.Element} Rendered crossword component
 */

import React, {
  useState,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import {
  Clock,
  RotateCw,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../../styles/Crossword.css";
import crosswordData from "../../data/crossword.json";

// ============================================================================
// CONSTANTS
// ============================================================================

const TIMER_WARNING_THRESHOLD = 60; // seconds

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format seconds into MM:SS display format
 * @param {number} seconds - Total seconds to format
 * @returns {string} Formatted time string (e.g., "5:30")
 */
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Check if a cell is in the black cells array
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {array} blackCells - Array of [row, col] pairs for black cells
 * @returns {boolean} True if cell is black
 */
const checkBlackCell = (row, col, blackCells) => {
  if (!blackCells || !Array.isArray(blackCells)) return false;
  return blackCells.some((cell) => cell[0] === row && cell[1] === col);
};

/**
 * Get all clue numbers that start at a given cell
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {array} allClues - Combined array of across and down clues
 * @returns {array|null} Array of clue numbers or null if none
 */
const getClueNumbersForCell = (row, col, allClues) => {
  if (!allClues || !Array.isArray(allClues)) return null;
  const numbers = allClues
    .filter((clue) => clue.startRow === row && clue.startCol === col)
    .map((clue) => clue.number);
  return numbers.length > 0 ? numbers : null;
};

/**
 * Build answers grid from clues and user inputs
 * @param {object} puzzle - Current puzzle object
 * @returns {object} Correctly formatted answers object with cell answers
 */
const buildAnswersGrid = (puzzle) => {
  const answers = {};
  if (!puzzle) return answers;

  // Process across clues
  if (puzzle.across && Array.isArray(puzzle.across)) {
    puzzle.across.forEach((clue) => {
      for (let i = 0; i < clue.length; i++) {
        const key = `${clue.startRow}-${clue.startCol + i}`;
        answers[key] = clue.answer[i];
      }
    });
  }

  // Process down clues
  if (puzzle.down && Array.isArray(puzzle.down)) {
    puzzle.down.forEach((clue) => {
      for (let i = 0; i < clue.length; i++) {
        const key = `${clue.startRow + i}-${clue.startCol}`;
        answers[key] = clue.answer[i];
      }
    });
  }

  return answers;
};

/**
 * Check if puzzle is completely and correctly solved
 * @param {object} puzzle - Current puzzle object
 * @param {object} userAnswers - User-entered answers
 * @returns {boolean} True if all clues are correct
 */
const isPuzzleComplete = (puzzle, userAnswers) => {
  if (!puzzle || !userAnswers) return false;

  const allClues = [...(puzzle.across || []), ...(puzzle.down || [])];

  return allClues.every((clue) => {
    for (let i = 0; i < clue.length; i++) {
      const isAcross = (puzzle.across || []).includes(clue);
      const cellRow = clue.startRow + (isAcross ? 0 : i);
      const cellCol = clue.startCol + (isAcross ? i : 0);
      const key = `${cellRow}-${cellCol}`;

      if (!userAnswers[key] || userAnswers[key] !== clue.answer[i]) {
        return false;
      }
    }
    return true;
  });
};

/**
 * Process cell input with validation
 * @param {string} value - Input value
 * @param {boolean} isFinished - Whether puzzle is finished
 * @returns {string|null} Processed character or null if invalid
 */
const processCellInput = (value, isFinished) => {
  if (isFinished) return null;
  if (value.length > 1) {
    return value.charAt(0).toUpperCase();
  }
  if (value === "") {
    return "";
  }
  return value.toUpperCase();
};

/**
 * Create empty answers object for a puzzle
 * @returns {object} Empty answers object
 */
const createEmptyAnswers = () => ({});

const Crossword = forwardRef(
  (
    {
      visualStyle = "playful",
      crosswordDifficulty = "easy",
      showHints = true,
      timerEnabled = true,
      timerDuration = 300,
    },
    ref,
  ) => {
    // Get the current puzzle based on difficulty
    const currentPuzzle = useMemo(() => {
      const puzzle = crosswordData.puzzles.find(
        (p) => p.difficulty === crosswordDifficulty,
      );
      return puzzle || crosswordData.puzzles[0];
    }, [crosswordDifficulty]);

    // Initialize state
    const [answers, setAnswers] = useState(createEmptyAnswers());
    const [selectedCell, setSelectedCell] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(timerDuration);
    const [isFinished, setIsFinished] = useState(false);
    const [currentClueIndex, setCurrentClueIndex] = useState(0);
    const timerDurationRef = useRef(timerDuration);

    // Track timer duration changes
    useEffect(() => {
      timerDurationRef.current = timerDuration;
    }, [timerDuration]);

    // Prepare all clues (both across and down) for navigation - memoized once
    const allClues = useMemo(
      () => [...(currentPuzzle.across || []), ...(currentPuzzle.down || [])],
      [currentPuzzle],
    );

    // Expose imperative handle for external controls
    useImperativeHandle(
      ref,
      () => ({
        shuffleCrossword: () => {
          setAnswers(createEmptyAnswers());
          setSelectedCell(null);
          setTimeRemaining(timerDuration);
          setIsFinished(false);
          setCurrentClueIndex(0);
        },
        revealAnswers: () => {
          setAnswers(buildAnswersGrid(currentPuzzle));
        },
      }),
      [currentPuzzle, timerDuration],
    );

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

    // Reset when puzzle changes
    useEffect(() => {
      setAnswers(createEmptyAnswers());
      setSelectedCell(null);
      setTimeRemaining(timerDurationRef.current);
      setIsFinished(false);
      setCurrentClueIndex(0);
    }, [currentPuzzle]);

    // Handle cell input with utility function
    const handleCellInput = useCallback(
      (row, col, value) => {
        const processedValue = processCellInput(value, isFinished);
        if (processedValue === null) return;

        const key = `${row}-${col}`;
        setAnswers((prev) => {
          const newAnswers = { ...prev };
          if (processedValue === "") {
            delete newAnswers[key];
          } else {
            newAnswers[key] = processedValue;
          }
          return newAnswers;
        });
      },
      [isFinished],
    );

    // Check if puzzle is complete - memoized
    const isComplete = useMemo(
      () => isPuzzleComplete(currentPuzzle, answers),
      [answers, currentPuzzle],
    );

    // Reset puzzle
    const handleRestart = useCallback(() => {
      setAnswers(createEmptyAnswers());
      setSelectedCell(null);
      setTimeRemaining(timerDuration);
      setIsFinished(false);
    }, [timerDuration]);

    // Navigation handlers
    const handlePreviousClue = useCallback(() => {
      setCurrentClueIndex((prev) =>
        prev > 0 ? prev - 1 : allClues.length - 1,
      );
    }, [allClues.length]);

    const handleNextClue = useCallback(() => {
      setCurrentClueIndex((prev) =>
        prev < allClues.length - 1 ? prev + 1 : 0,
      );
    }, [allClues.length]);

    // Reveal all answers
    const handleRevealAnswers = useCallback(() => {
      setAnswers(buildAnswersGrid(currentPuzzle));
    }, [currentPuzzle]);

    // Wrapper for utility function with current puzzle context
    const isBlackCell = useCallback(
      (row, col) => checkBlackCell(row, col, currentPuzzle.blackCells),
      [currentPuzzle.blackCells],
    );

    // Wrapper for utility function with clues context
    const getClueNumberForCell = useCallback(
      (row, col) => getClueNumbersForCell(row, col, allClues),
      [allClues],
    );

    // Render finished screen
    if (isFinished) {
      const totalAnswers = [...currentPuzzle.across, ...currentPuzzle.down]
        .length;

      return (
        <div className={`${visualStyle}-crossword-wrapper`}>
          <div className={`${visualStyle}-crossword-container`}>
            <div className={`${visualStyle}-crossword-result-container`}>
              <div className={`${visualStyle}-crossword-result-inner`}>
                {visualStyle === "playful" && (
                  <div className={`${visualStyle}-crossword-result-emoji`}>
                    🎉
                  </div>
                )}
                <h2 className={`${visualStyle}-crossword-result-title`}>
                  Puzzle Completato!
                </h2>
                <p className={`${visualStyle}-crossword-result-text`}>
                  Risposte corrette:{" "}
                  <span className={`${visualStyle}-crossword-result-score`}>
                    {isComplete ? totalAnswers : 0}
                  </span>{" "}
                  su{" "}
                  <span className={`${visualStyle}-crossword-result-total`}>
                    {totalAnswers}
                  </span>
                </p>
                <button
                  onClick={handleRestart}
                  className={`${visualStyle}-crossword-nav-btn ${visualStyle}-crossword-restart-btn`}
                >
                  Riprova 🔄
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!currentPuzzle) {
      return (
        <div className={`${visualStyle}-crossword-wrapper`}>
          <div className={`${visualStyle}-crossword-container`}>
            <p>No Crosswords Available</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`${visualStyle}-crossword-wrapper`}>
        <div className={`${visualStyle}-crossword-container`}>
          {/* Header */}
          <div className={`${visualStyle}-crossword-header`}>
            <div className={`${visualStyle}-crossword-counter`}>
              {currentPuzzle.difficulty.charAt(0).toUpperCase() +
                currentPuzzle.difficulty.slice(1)}
            </div>
            {timerEnabled && (
              <div
                className={`${visualStyle}-timer ${timeRemaining < TIMER_WARNING_THRESHOLD ? "warning" : ""}`}
              >
                <Clock size={20} />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <div className={`${visualStyle}-header-controls`}>
              <button
                className={`${visualStyle}-crossword-nav-btn`}
                onClick={() => {
                  setAnswers({});
                  setSelectedCell(null);
                  setTimeRemaining(timerDuration);
                }}
              >
                <RotateCw size={20} />
              </button>
              {showHints && (
                <button
                  className={`${visualStyle}-crossword-nav-btn`}
                  onClick={handleRevealAnswers}
                >
                  <Lightbulb size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Grid Card Area */}
          <div className={`${visualStyle}-crossword-card-area`}>
            <div
              className={`${visualStyle}-crossword-grid`}
              style={{
                gridTemplateColumns: `repeat(${currentPuzzle.grid.length}, 1fr)`,
              }}
            >
              {currentPuzzle.grid.map((row, rowIdx) =>
                row.split("").map((cell, colIdx) => {
                  const clueNumber = getClueNumberForCell(rowIdx, colIdx);
                  const isBlack = isBlackCell(rowIdx, colIdx);
                  return (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className={`${visualStyle}-crossword-cell ${
                        isBlack ? "blocked" : "active"
                      } ${selectedCell === `${rowIdx}-${colIdx}` ? "selected" : ""}`}
                      onClick={() =>
                        !isBlack && setSelectedCell(`${rowIdx}-${colIdx}`)
                      }
                    >
                      {!isBlack && (
                        <>
                          {clueNumber && (
                            <div className={`${visualStyle}-cell-numbers`}>
                              {clueNumber.map((num, idx) => (
                                <span
                                  key={idx}
                                  className={`${visualStyle}-cell-number`}
                                >
                                  {num}
                                </span>
                              ))}
                            </div>
                          )}
                          <input
                            type="text"
                            maxLength="1"
                            value={answers[`${rowIdx}-${colIdx}`] || ""}
                            onChange={(e) =>
                              handleCellInput(rowIdx, colIdx, e.target.value)
                            }
                            disabled={isFinished}
                            className={`${visualStyle}-cell-input`}
                          />
                        </>
                      )}
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          {/* Clues - Card Navigation */}
          <div className={`${visualStyle}-crossword-clues-card`}>
            <div className={`${visualStyle}-crossword-clues-header`}>
              <button
                className={`${visualStyle}-clues-nav-btn`}
                onClick={handlePreviousClue}
              >
                <ChevronLeft size={20} />
              </button>
              <div className={`${visualStyle}-clues-info`}>
                <span className={`${visualStyle}-clues-number`}>
                  {currentClueIndex + 1} / {allClues.length}
                </span>
              </div>
              <button
                className={`${visualStyle}-clues-nav-btn`}
                onClick={handleNextClue}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            {allClues.length > 0 && (
              <div className={`${visualStyle}-crossword-clue-display`}>
                <div className={`${visualStyle}-clue-display-header`}>
                  <div className={`${visualStyle}-clue-display-meta`}>
                    <div className={`${visualStyle}-clue-display-number`}>
                      {allClues[currentClueIndex].number}
                    </div>
                    <div className={`${visualStyle}-clue-display-direction`}>
                      {currentPuzzle.across.includes(allClues[currentClueIndex])
                        ? "Orizzontale"
                        : "Verticale"}
                    </div>
                  </div>
                  {showHints && (
                    <div className={`${visualStyle}-clue-display-length`}>
                      {allClues[currentClueIndex].length}
                    </div>
                  )}
                </div>
                <div className={`${visualStyle}-clue-display-text`}>
                  {allClues[currentClueIndex].clue}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

Crossword.displayName = "Crossword";

export default Crossword;
