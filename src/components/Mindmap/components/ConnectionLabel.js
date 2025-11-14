import React from 'react';

/**
 * Component for connection labels between nodes
 */
const ConnectionLabel = ({
  connection,
  visualStyle = 'playful',
  midXPercent,
  midYPercent,
  isEditing,
  isSelected,
  dynamicMapEnabled,
  onLabelClick,
  onLabelDoubleClick,
  onLabelChange,
  onStopEditing,
  onDelete
}) => {
  return (
    <div
      className={`connection-label ${visualStyle}-connection-label`}
      style={{
        position: 'absolute',
        left: `${midXPercent}%`,
        top: `${midYPercent}%`,
        transform: 'translate(-50%, -50%)',
        cursor: dynamicMapEnabled ? 'pointer' : 'default',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        zIndex: 0
      }}
      onClick={(e) => {
        if (!dynamicMapEnabled) return;
        e.stopPropagation();
        onLabelClick();
      }}
      onDoubleClick={(e) => {
        if (!dynamicMapEnabled) return;
        e.stopPropagation();
        onLabelDoubleClick();
      }}
    >
      {isEditing ? (
        <input
          autoFocus
          value={connection.label}
          onChange={(e) => onLabelChange(connection.from, connection.to, e.target.value)}
          onBlur={onStopEditing}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onStopEditing();
            }
          }}
          style={{
            width: `${Math.max(4, connection.label.length)}ch`,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '0.75rem',
            textAlign: 'center',
            fontFamily: visualStyle === 'tech' ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' : 'inherit',
            fontWeight: visualStyle === 'illustrated' || visualStyle === 'picasso' ? '600' : 'inherit'
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{connection.label}</span>
          {dynamicMapEnabled && isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(connection.from, connection.to);
              }}
              style={{
                width: '1rem',
                height: '1rem',
                padding: 0,
                border: 'none',
                background: '#ff4444',
                color: 'white',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              title="Elimina connessione"
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionLabel;
