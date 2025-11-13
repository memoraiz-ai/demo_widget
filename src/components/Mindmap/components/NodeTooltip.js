import React from 'react';

/**
 * Tooltip component displaying node information
 */
const NodeTooltip = ({ nodeId, nodeInfo, nodeColor, isSelected }) => {
  if (!nodeInfo) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '100%',
        transform: 'translateX(-50%)',
        marginTop: isSelected ? '1.5rem' : '0.5rem',
        minWidth: '18rem',
        maxWidth: '25rem',
        padding: '1rem',
        background: nodeColor,
        borderRadius: '0.75rem',
        boxShadow: '0 0.5rem 1.5rem rgba(0, 0, 0, 0.2)',
        zIndex: 10000,
        fontSize: '0.8rem',
        color: '#333',
        pointerEvents: 'none',
        border: `2px solid ${nodeColor}`,
        animation: 'tooltipFadeIn 0.3s ease-out',
        opacity: 1
      }}
    >
      <style>
        {`
          @keyframes tooltipFadeIn {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        `}
      </style>
      
      <div style={{ 
        fontWeight: 'bold', 
        marginBottom: '0.75rem', 
        color: '#1976d2', 
        fontSize: '1rem',
        borderBottom: '2px solid rgba(0,0,0,0.1)',
        paddingBottom: '0.5rem'
      }}>
        {nodeInfo.title}
      </div>
      
      {nodeInfo.description && (
        <div style={{ 
          marginBottom: '0.5rem',
          fontStyle: 'italic',
          color: '#555',
          fontSize: '0.85rem'
        }}>
          {nodeInfo.description}
        </div>
      )}
      
      <div style={{ 
        color: '#666',
        lineHeight: '1.5',
        textAlign: 'justify'
      }}>
        {nodeInfo.extract}
      </div>
    </div>
  );
};

export default NodeTooltip;
