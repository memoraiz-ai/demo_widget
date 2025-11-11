import React from 'react';

const Mindmap = React.forwardRef(({ theme }, ref) => {
  return (
    <div className="mindmap-container">
      <div className="mindmap-placeholder">
        <h2 className="mindmap-title">Mindmap</h2>
        <div className="mindmap-content">
          <p>Mindmap functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
});

Mindmap.displayName = 'Mindmap';

export default Mindmap;