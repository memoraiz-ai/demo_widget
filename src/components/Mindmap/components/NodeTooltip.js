import React from 'react';

/**
 * Calculate luminance to determine if color is light or dark
 */
const getLuminance = (color) => {
  // Convert hex to RGB
  let r, g, b;
  
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    [r, g, b] = match.map(Number);
  } else {
    return 0.5; // Default to medium
  }
  
  // Calculate relative luminance
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Tooltip component displaying node information
 */
const NodeTooltip = ({ nodeId, nodeInfo, nodeColor, isSelected }) => {
  if (!nodeInfo) return null;

  // Determine if background is light or dark
  const luminance = getLuminance(nodeColor);
  const isLight = luminance > 0.5;
  
  // Use high contrast colors based on background
  const titleColor = isLight ? '#1a1a1a' : '#ffffff';
  const textColor = isLight ? '#333333' : '#f0f0f0';
  const secondaryTextColor = isLight ? '#666666' : '#cccccc';

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
        color: textColor,
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
        color: titleColor, 
        fontSize: '1rem',
        borderBottom: `2px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}`,
        paddingBottom: '0.5rem'
      }}>
        {nodeInfo.title}
      </div>
      
      {nodeInfo.description && (
        <div style={{ 
          marginBottom: nodeInfo.extract ? '0.5rem' : '0',
          color: textColor,
          fontSize: '0.875rem',
          lineHeight: '1.6'
        }}>
          {nodeInfo.description}
        </div>
      )}
      
      {nodeInfo.extract && (
        <div style={{ 
          color: secondaryTextColor,
          lineHeight: '1.5',
          textAlign: 'justify',
          fontSize: '0.85rem'
        }}>
          {nodeInfo.extract}
        </div>
      )}
    </div>
  );
};

export default NodeTooltip;
