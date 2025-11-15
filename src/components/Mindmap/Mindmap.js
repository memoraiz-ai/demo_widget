import React, { forwardRef } from 'react';
import { useMindmapState } from './hooks/useMindmapState';
import { useMindmapHandlers } from './hooks/useMindmapHandlers';
import { getNodeCenter } from './utils/mindmapUtils';
import { nodeInfoData } from './data/nodeInfoData';
import MindmapControls from './components/MindmapControls';
import MindmapNode from './components/MindmapNode';
import ConnectionLabel from './components/ConnectionLabel';
import NodeCustomization from './components/NodeCustomization';
import MindmapMinimap from './components/MindmapMinimap';

/**
 * Main Mindmap Component
 * A visual interactive mindmap with draggable nodes, connections, and customization
 */
const MindMap = forwardRef(({ visualStyle = 'playful', showNodeDetails, showConnectionLabels, dynamicMapEnabled }, ref) => {
  // Initialize state
  const state = useMindmapState();
  
  // Initialize handlers
  const handlers = useMindmapHandlers(state);

  // Destructure state
  const {
    nodes,
    connections,
    draggedNode,
    editingNode,
    selectedNode,
    hoveredNode,
    editingConnection,
    selectedConnection,
    draggingConnection,
    connectionTarget,
    zoom,
    pan,
    canvasRef,
    svgRef,
    justDraggedRef
  } = state;

  /**
   * Helper to get canvas bounding rect
   */
  const getCanvasRect = () => {
    return canvasRef.current?.getBoundingClientRect();
  };

  /**
   * Get connection line color based on visual style
   */
  const getConnectionColor = () => {
    const colors = {
      playful: '#a855f7',
      corporate: '#94a3b8',
      tech: '#06b6d4',
      illustrated: '#111042',
      picasso: '#292524',
      schoolr: '#FF7B7B',
      plai: '#E63946',
      studenti: '#7CB342'
    };
    return colors[visualStyle] || colors.playful;
  };

  return (
    <div className={`${visualStyle}-mindmap-container-fullpage`}>
      <div className={`${visualStyle}-mindmap-wrapper-fullpage`}>
        {/* Controls */}
        <MindmapControls 
          visualStyle={visualStyle}
          onZoomIn={handlers.handleZoomIn}
          onZoomOut={handlers.handleZoomOut}
          onResetView={handlers.handleResetView}
        />

        {/* Instructions */}
        <div className={`${visualStyle}-mindmap-instructions`}>
          <p>Trascina per spostare • Doppio clic per modificare • Rotella per zoom</p>
        </div>

        {/* Main Canvas */}
        <div 
          ref={canvasRef}
          className={`${visualStyle}-mindmap-canvas-fullpage`}
          onMouseDown={handlers.handleCanvasMouseDown}
          style={{
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Background grid */}
          <div style={{ 
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `radial-gradient(circle, #d0d0d0 1px, transparent 1px)`,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x * zoom}px ${pan.y * zoom}px`,
            opacity: 0.6
          }} />
          
          {/* Content layer */}
          <div style={{ 
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`, 
            transformOrigin: '0 0',
            width: '100%', 
            height: '100%',
            position: 'relative'
          }}>
            {/* SVG Layer for connections */}
            <svg 
              ref={svgRef}
              className="mindmap-svg"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <marker
                  id={`arrowhead-${visualStyle}`}
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill={getConnectionColor()} />
                </marker>
              </defs>
              
              {/* Connection lines */}
              {connections.map((conn, idx) => {
                const from = getNodeCenter(conn.from, nodes, getCanvasRect());
                const to = getNodeCenter(conn.to, nodes, getCanvasRect());
                
                return (
                  <g key={idx}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={getConnectionColor()}
                      strokeWidth={visualStyle === 'illustrated' || visualStyle === 'picasso' ? '3' : '2'}
                      strokeDasharray={visualStyle === 'tech' ? '5,5' : visualStyle === 'illustrated' ? '10,5' : '5,5'}
                      markerEnd={`url(#arrowhead-${visualStyle})`}
                      opacity={visualStyle === 'tech' ? '0.6' : '0.5'}
                    />
                  </g>
                );
              })}
              
              {/* Temporary connection line while dragging */}
              {draggingConnection && canvasRef.current && (
                (() => {
                  const rect = getCanvasRect();
                  const from = getNodeCenter(draggingConnection.from, nodes, rect);
                  const toX = (draggingConnection.mouseX - rect.left) / zoom - pan.x;
                  const toY = (draggingConnection.mouseY - rect.top) / zoom - pan.y;
                  
                  return (
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={toX}
                      y2={toY}
                      stroke={getConnectionColor()}
                      strokeWidth="3"
                      strokeDasharray="10,5"
                      opacity="0.8"
                    />
                  );
                })()
              )}
            </svg>

            {/* Nodes Layer */}
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {nodes.map(node => (
                <MindmapNode
                  key={node.id}
                  node={node}
                  visualStyle={visualStyle}
                  isEditing={editingNode === node.id}
                  isSelected={selectedNode === node.id}
                  isHovered={hoveredNode === node.id}
                  isDragged={draggedNode === node.id}
                  isConnectionTarget={connectionTarget === node.id}
                  showNodeDetails={showNodeDetails}
                  nodeInfo={nodeInfoData[node.id]}
                  dynamicMapEnabled={dynamicMapEnabled}
                  justDraggedRef={justDraggedRef}
                  onMouseDown={(e) => dynamicMapEnabled && handlers.handleMouseDown(e, node.id)}
                  onMouseEnter={() => {
                    handlers.setHoveredNode(node.id);
                    if (draggingConnection && node.id !== draggingConnection.from) {
                      handlers.setConnectionTarget(node.id);
                    }
                  }}
                  onMouseLeave={() => {
                    handlers.setHoveredNode(null);
                    if (connectionTarget === node.id) {
                      handlers.setConnectionTarget(null);
                    }
                  }}
                  onClick={(e) => {
                    if (!dynamicMapEnabled) return;
                    if (!justDraggedRef.current && editingNode !== node.id) {
                      e.stopPropagation();
                      handlers.setSelectedNode(selectedNode === node.id ? null : node.id);
                    }
                  }}
                  onDoubleClick={(e) => {
                    if (!dynamicMapEnabled) return;
                    e.stopPropagation();
                    e.preventDefault();
                    delete e.currentTarget.dragData;
                    handlers.setEditingNode(node.id);
                  }}
                  onTextChange={handlers.handleNodeTextChange}
                  onStopEditing={() => handlers.setEditingNode(null)}
                  onDelete={() => handlers.deleteNode(node.id)}
                  onStartConnection={(e) => {
                    e.stopPropagation();
                    handlers.setDraggingConnection({
                      from: node.id,
                      mouseX: e.clientX,
                      mouseY: e.clientY
                    });
                  }}
                />
              ))}

              {/* Connection Labels */}
              {showConnectionLabels && connections.map((conn) => {
                if (!canvasRef.current) return null;
                const rect = getCanvasRect();
                const from = getNodeCenter(conn.from, nodes, rect);
                const to = getNodeCenter(conn.to, nodes, rect);
                const midXpx = (from.x + to.x) / 2;
                const midYpx = (from.y + to.y) / 2;
                
                const midXPercent = (midXpx / rect.width) * 100;
                const midYPercent = (midYpx / rect.height) * 100;
                
                const connKey = `${conn.from}-${conn.to}`;
                
                return (
                  <ConnectionLabel
                    key={connKey}
                    connection={conn}
                    visualStyle={visualStyle}
                    midXPercent={midXPercent}
                    midYPercent={midYPercent}
                    isEditing={editingConnection === connKey}
                    isSelected={selectedConnection === connKey}
                    dynamicMapEnabled={dynamicMapEnabled}
                    onLabelClick={() => handlers.setSelectedConnection(selectedConnection === connKey ? null : connKey)}
                    onLabelDoubleClick={() => handlers.setEditingConnection(connKey)}
                    onLabelChange={handlers.handleConnectionLabelChange}
                    onStopEditing={() => handlers.setEditingConnection(null)}
                    onDelete={(fromId, toId) => {
                      handlers.deleteConnection(fromId, toId);
                      handlers.setSelectedConnection(null);
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Minimap */}
          <MindmapMinimap 
            visualStyle={visualStyle}
            nodes={nodes}
            connections={connections}
            zoom={zoom}
            pan={pan}
            canvasRect={getCanvasRect()}
          />
          
          {/* Node Customization Bar */}
          {dynamicMapEnabled && (
            <NodeCustomization
              visualStyle={visualStyle}
              selectedNode={selectedNode}
              nodes={nodes}
              onColorChange={handlers.handleColorChange}
              onIconChange={handlers.handleIconChange}
              onAddNode={handlers.addNode}
            />
          )}
        </div> 
      </div>
    </div>
  );
});

MindMap.displayName = 'MindMap';

export default MindMap;
