import React from 'react';
import { Plus, Minus, Crosshair } from 'lucide-react';

/**
 * Zoom and pan controls for the mindmap
 */
const MindmapControls = ({ visualStyle = 'playful', onZoomIn, onZoomOut, onResetView, hideHeader }) => {
  return (
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
  );
};

export default MindmapControls;
