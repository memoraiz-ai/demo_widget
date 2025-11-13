import React from 'react';
import { Plus, Minus, Crosshair } from 'lucide-react';

/**
 * Zoom and pan controls for the mindmap
 */
const MindmapControls = ({ onZoomIn, onZoomOut, onResetView }) => {
  return (
    <div className="mindmap-header">
      <h2 className="mindmap-title">Mindmap Sant'Antioco</h2>
      <div className="mindmap-controls">
        <button onClick={onZoomIn} className="control-button" title="Zoom In">
          <Plus size={18} />
        </button>
        <button onClick={onZoomOut} className="control-button" title="Zoom Out">
          <Minus size={18} />
        </button>
        <button onClick={onResetView} className="control-button" title="Reset Vista">
          <Crosshair size={18} />
        </button>
      </div>
    </div>
  );
};

export default MindmapControls;
