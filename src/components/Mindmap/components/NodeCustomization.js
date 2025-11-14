import React from 'react';
import { Plus } from 'lucide-react';
import { availableColors, availableIcons } from '../utils/mindmapUtils';

/**
 * Component for node customization (colors and icons) and adding new nodes
 */
const NodeCustomization = ({ 
  visualStyle = 'playful',
  selectedNode, 
  nodes, 
  onColorChange, 
  onIconChange, 
  onAddNode 
}) => {
  const selectedNodeObj = nodes.find(n => n.id === selectedNode);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        zIndex: 1000
      }}
    >
      {/* Add node button - visible when no node selected */}
      {!selectedNode && (
        <>
          <style>
            {`
              @keyframes fadeInScale {
                from {
                  opacity: 0;
                  transform: scale(0.8);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}
          </style>
          <button
            onClick={onAddNode}
            className={`add-node-btn ${visualStyle}-add-node-btn`}
            style={{
              padding: '0.75rem 1.5rem',
              border: visualStyle === 'illustrated' || visualStyle === 'picasso' ? undefined : 'none',
              fontFamily: visualStyle === 'tech' ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' : "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'fadeInScale 0.3s ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-0.25rem) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0.5rem 1.5rem rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 0.25rem 0.75rem rgba(0, 0, 0, 0.15)';
            }}
          >
            <Plus size={18} />
            Aggiungi Nodo
          </button>
        </>
      )}

      {/* Color and Icon pickers - visible when node selected */}
      {selectedNode && (
        <div
          className={`${visualStyle}-customization-panel`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <style>
            {`
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>
          
          {/* Color picker */}
          <div
            style={{
              display: 'flex',
              gap: '0.25rem',
              padding: '0.5rem',
              cursor: 'pointer'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {availableColors.map(color => (
              <button
                key={color}
                onClick={(e) => {
                  e.stopPropagation();
                  onColorChange(selectedNode, color);
                }}
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  backgroundColor: color,
                  border: selectedNodeObj?.color === color ? '2px solid #333' : '1px solid #ddd',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.2)';
                  e.target.style.boxShadow = '0 0.25rem 0.5rem rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            ))}
          </div>

          {/* Icon picker */}
          <div
            style={{
              display: 'flex',
              gap: '0.25rem',
              padding: '0.5rem',
              cursor: 'pointer'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {availableIcons.map(icon => (
              <button
                key={icon}
                onClick={(e) => {
                  e.stopPropagation();
                  onIconChange(selectedNode, icon);
                }}
                style={{
                  width: '1.75rem',
                  height: '1.75rem',
                  fontSize: '1rem',
                  background: selectedNodeObj?.icon === icon ? '#e3f2fd' : 'transparent',
                  border: selectedNodeObj?.icon === icon ? '2px solid #2196f3' : '1px solid #ddd',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.2)';
                  e.target.style.boxShadow = '0 0.25rem 0.5rem rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeCustomization;
