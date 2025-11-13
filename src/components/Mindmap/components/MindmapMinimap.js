import React from 'react';

/**
 * Minimap component showing overview of all nodes and current viewport
 */
const MindmapMinimap = ({ nodes, connections, zoom, pan, canvasRect }) => {
  if (!canvasRect) return null;

  const padding = 50;
  const allX = nodes.map(n => n.x);
  const allY = nodes.map(n => n.y);
  const minX = Math.min(...allX) - padding;
  const maxX = Math.max(...allX) + padding;
  const minY = Math.min(...allY) - padding;
  const maxY = Math.max(...allY) + padding;
  const width = maxX - minX;
  const height = maxY - minY;
  
  const scaleX = 192 / width;
  const scaleY = 128 / height;
  const scale = Math.min(scaleX, scaleY);
  
  // Center offset for minimap
  const offsetX = (192 - width * scale) / 2;
  const offsetY = (128 - height * scale) / 2;
  
  // Viewport rectangle
  const canvasAspect = canvasRect.width / canvasRect.height;
  const viewportSize = 100 / zoom;
  
  let viewportWidthPercent = viewportSize;
  let viewportHeightPercent = viewportSize;
  
  // Adjust for aspect ratio
  if (canvasAspect > 1) {
    viewportHeightPercent = viewportSize / canvasAspect;
  } else {
    viewportWidthPercent = viewportSize * canvasAspect;
  }
  
  // Viewport center based on pan
  const viewportCenterX = 50 - (pan.x / (canvasRect.width / 100));
  const viewportCenterY = 50 - (pan.y / (canvasRect.height / 100));
  
  // Viewport top-left
  const viewportLeft = viewportCenterX - viewportWidthPercent / 2;
  const viewportTop = viewportCenterY - viewportHeightPercent / 2;

  return (
    <div style={{
      position: 'absolute',
      bottom: '1rem',
      right: '1rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.15)',
      padding: '0.5rem',
      zIndex: 10
    }}>
      <div style={{
        position: 'relative',
        width: '12rem',
        height: '8rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.25rem',
        overflow: 'hidden'
      }}>
        <svg style={{ width: '100%', height: '100%' }}>
          {/* Connection lines */}
          {connections.map((conn, idx) => {
            const from = nodes.find(n => n.id === conn.from);
            const to = nodes.find(n => n.id === conn.to);
            if (!from || !to) return null;
            
            return (
              <line
                key={idx}
                x1={offsetX + (from.x - minX) * scale}
                y1={offsetY + (from.y - minY) * scale}
                x2={offsetX + (to.x - minX) * scale}
                y2={offsetY + (to.y - minY) * scale}
                stroke="#ddd"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Nodes */}
          {nodes.map(node => (
            <rect
              key={node.id}
              x={offsetX + (node.x - minX) * scale - 4}
              y={offsetY + (node.y - minY) * scale - 3}
              width="10"
              height="6"
              fill={node.color}
              stroke="#666"
              strokeWidth="0.5"
              rx="3"
              ry="3"
            />
          ))}
          
          {/* Viewport indicator */}
          <rect
            x={offsetX + (viewportLeft - minX) * scale}
            y={offsetY + (viewportTop - minY) * scale}
            width={viewportWidthPercent * scale}
            height={viewportHeightPercent * scale}
            fill="rgba(33, 150, 243, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};

export default MindmapMinimap;
