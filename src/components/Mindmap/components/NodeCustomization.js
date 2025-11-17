import React from 'react';
import { Plus, History, Map, User, Church, Building2, LayoutDashboard, Flag, Lightbulb } from 'lucide-react';
import { availableColors, availableIcons } from '../utils/mindmapUtils';

/**
 * Component for node customization (colors and icons) and adding new nodes
 */
const iconComponentMap = {
  History,
  Map,
  User,
  Church,
  Building2,
  LayoutDashboard,
  Flag,
  Lightbulb
};

const addButtonStyles = {
  playful: {
    background: '#7c3aed',
    color: '#fff',
    borderRadius: '9999px',
    border: 'none',
    fontFamily: "'Poppins', sans-serif"
  },
  tech: {
    background: '#0f172a',
    color: '#67e8f9',
    borderRadius: '0.5rem',
    border: '1px solid #67e8f9',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  },
  corporate: {
    background: '#fff',
    color: '#2563eb',
    borderRadius: '0.75rem',
    border: '1px solid #cbd5f5',
    fontFamily: "'Inter', sans-serif"
  },
  illustrated: {
    background: '#ff8c00',
    color: '#111042',
    borderRadius: '1rem',
    border: '3px solid #111042',
    fontFamily: "'Fredoka', sans-serif"
  },
  picasso: {
    background: '#fef3c7',
    color: '#111',
    borderRadius: '0.25rem',
    border: '3px solid #111',
    fontFamily: "'Kalam', cursive"
  },
  schoolr: {
    background: '#ff7b7b',
    color: '#fff',
    borderRadius: '0.85rem',
    border: 'none',
    fontFamily: "'Nunito', sans-serif"
  },
  plai: {
    background: '#111042',
    color: '#fefce8',
    borderRadius: '0.5rem',
    border: 'none',
    fontFamily: "'Space Grotesk', sans-serif"
  },
  studenti: {
    background: '#7cb342',
    color: '#fff',
    borderRadius: '0.5rem',
    border: 'none',
    fontFamily: "'Montserrat', sans-serif"
  }
};

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
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              animation: 'fadeInScale 0.3s ease-out',
              ...(addButtonStyles[visualStyle] || addButtonStyles.playful)
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
            gap: '0.25rem',
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
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '0.75rem',
              boxShadow: '0 0.5rem 1.5rem rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.08)'
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
                  border: selectedNodeObj?.color === color ? '2px solid #111' : '1px solid rgba(0,0,0,0.15)',
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
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '0.75rem',
              boxShadow: '0 0.5rem 1.5rem rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.08)'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {availableIcons.map(iconKey => {
              const IconComponent = iconComponentMap[iconKey];
              return (
              <button
                key={iconKey}
                onClick={(e) => {
                  e.stopPropagation();
                  onIconChange(selectedNode, iconKey);
                }}
                style={{
                  width: '1.75rem',
                  height: '1.75rem',
                  fontSize: '1rem',
                  background: selectedNodeObj?.icon === iconKey ? '#e3f2fd' : 'transparent',
                  border: selectedNodeObj?.icon === iconKey ? '2px solid #2196f3' : '1px solid #ddd',
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
                {IconComponent ? <IconComponent size={16} /> : iconKey}
              </button>
            );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeCustomization;
