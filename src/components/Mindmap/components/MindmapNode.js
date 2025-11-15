import React from 'react';
import NodeTooltip from './NodeTooltip';
import { darkenColor } from '../utils/mindmapUtils';
import {
  History,
  Map,
  User,
  Church,
  Building2,
  LayoutDashboard,
  Flag,
  Lightbulb,
  Network,
  BarChart,
  Users,
  FlaskConical,
  Star,
  BookOpen,
  Leaf,
  Landmark,
  Drama,
  Castle,
  Mountain,
  Home,
  File,
  Backpack,
  TreePine,
  Circle,
  Ship,
  Ambulance,
  Shield,
  Bell,
  Camera,
  Brain,
  Sparkles
} from 'lucide-react';

// Icon mapping from string names to lucide-react components
const iconMap = {
  'History': History,
  'Map': Map,
  'Person': User,
  'User': User,
  'Church': Church,
  'Building2': Building2,
  'LayoutDashboard': LayoutDashboard,
  'Flag': Flag,
  'Lightbulb': Lightbulb,
  'Network': Network,
  'BarChart': BarChart,
  'Users': Users,
  'Science': FlaskConical,
  'Concept': Sparkles,
  'Star': Star,
  'BookOpen': BookOpen,
  'Nature': Leaf,
  'Museum': Landmark,
  'Drama': Drama,
  'Palace': Castle,
  'Castle': Castle,
  'Mountain': Mountain,
  'Home': Home,
  'File': File,
  'Backpack': Backpack,
  'TreePine': TreePine,
  'Circle': Circle,
  'Ship': Ship,
  'Ambulance': Ambulance,
  'Shield': Shield,
  'Bell': Bell,
  'Camera': Camera,
  'Brain': Brain
};

/**
 * Individual node component in the mindmap
 */
const MindmapNode = ({
  node,
  visualStyle = 'playful',
  isEditing,
  isSelected,
  isHovered,
  isDragged,
  isConnectionTarget,
  showNodeDetails,
  nodeInfo,
  dynamicMapEnabled,
  justDraggedRef,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onDoubleClick,
  onTextChange,
  onStopEditing,
  onDelete,
  onStartConnection
}) => {
  return (
    <div
      className={`mindmap-node ${visualStyle}-mindmap-node`}
      style={{
        position: 'absolute',
        left: `${node.x}%`,
        top: `${node.y}%`,
        backgroundColor: node.color,
        transform: isSelected ? 'translate(-50%, -50%) scale(1.05)' : 'translate(-50%, -50%)',
        minWidth: isEditing ? 'auto' : '7.5rem',
        maxWidth: isEditing ? '25rem' : '11.25rem',
        width: isEditing ? 'fit-content' : 'auto',
        padding: '0.75rem 1rem',
        boxShadow: isSelected 
          ? `0 0 0 0.1875rem ${darkenColor(node.color)}` 
          : (isConnectionTarget 
            ? `0 0 0 0.25rem #2196f3`
            : undefined),
        cursor: 'pointer',
        userSelect: 'none',
        transition: isDragged ? 'box-shadow 0.2s ease' : undefined,
        zIndex: isSelected ? 20000 : (isHovered ? 10000 : 1)
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      {/* Node text or textarea for editing */}
      {isEditing ? (
        <textarea
          ref={(el) => {
            if (el) {
              el.focus();
              el.setSelectionRange(el.value.length, el.value.length);
              el.style.minHeight = 'auto';
              el.style.height = 'auto';
              el.style.height = el.scrollHeight + 'px';
            }
          }}
          value={node.text}
          onChange={(e) => onTextChange(node.id, e.target.value)}
          onBlur={onStopEditing}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onStopEditing();
            }
          }}
          className={`${visualStyle}-mindmap-node-text`}
          style={{
            width: '100%',
            minHeight: '1rem',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '0.875rem',
            color: '#1f2937',
            textAlign: 'center',
            fontFamily: "'Poppins', sans-serif",
            resize: 'none',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}
          rows={1}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
        />
      ) : (
        <div 
          className={`${visualStyle}-mindmap-node-text`}
          style={{ 
            fontSize: '0.875rem', 
            color: '#1f2937', 
            textAlign: 'center',
            fontFamily: "'Poppins', sans-serif",
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {node.text}
        </div>
      )}

      {/* Icon badge */}
      {node.icon && (() => {
        const IconComponent = iconMap[node.icon];
        return IconComponent ? (
          <div 
            className={`${visualStyle}-mindmap-node-icon`}
            style={{
              position: 'absolute',
              top: '-0.75rem',
              left: '-0.75rem',
              fontSize: '1.1rem',
              lineHeight: 1,
              background: 'white',
              borderRadius: '50%',
              width: '1.7rem',
              height: '1.7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0.125rem 0.375rem rgba(0, 0, 0, 0.15)',
              border: '2px solid white',
              zIndex: 10
            }}
          >
            <IconComponent size={16} strokeWidth={2} />
          </div>
        ) : null;
      })()}

      {/* Tooltip */}
      {showNodeDetails && isHovered && nodeInfo && (
        <NodeTooltip 
          nodeId={node.id}
          nodeInfo={nodeInfo}
          nodeColor={node.color}
          isSelected={isSelected}
        />
      )}

      {/* Delete button */}
      {dynamicMapEnabled && (
        <button
          onClick={onDelete}
          className={`delete-node-btn ${visualStyle}-mindmap-delete-btn`}
          style={{
            position: 'absolute',
            top: '-0.5rem',
            right: '-0.5rem',
            width: '1.5rem',
            height: '1.5rem',
            background: '#dc3545',
            color: 'white',
            borderRadius: '50%',
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
            display: isSelected ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.2s ease'
          }}
        >
          ×
        </button>
      )}

      {/* Connection handle */}
      {dynamicMapEnabled && isSelected && (
        <div
          className={`${visualStyle}-mindmap-connection-handle`}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '-1rem',
            transform: 'translateX(-50%)',
            width: '1.5rem',
            height: '1.5rem',
            backgroundColor: '#2196f3',
            border: '3px solid white',
            borderRadius: '50%',
            cursor: 'crosshair',
            boxShadow: '0 0.125rem 0.5rem rgba(33, 150, 243, 0.5)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            lineHeight: '1'
          }}
          onMouseDown={onStartConnection}
          title="Trascina per creare una connessione"
        >
          +
        </div>
      )}
    </div>
  );
};

export default MindmapNode;
