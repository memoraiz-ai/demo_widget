import React from 'react';

const QuizBase = ({ children }) => {
  // QuizBase is now just a simple wrapper
  // Each quiz component handles its own styling based on visualStyle
  return <>{children}</>;
};

export default QuizBase;