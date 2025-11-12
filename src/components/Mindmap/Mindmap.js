import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Plus, Minus, Crosshair } from 'lucide-react';

const MindMap = forwardRef(({ theme }, ref) => {
  const [nodes, setNodes] = useState([
    { id: 1, text: 'Museo e area archeologica di Sant\'Antioco', x: 50, y: 50, color: '#e8f5e9' },
    { id: 2, text: 'Isola di Sant\'Antioco', x: 20, y: 45, color: '#e0f7fa' },
    { id: 3, text: 'Via Sabatino Moscati', x: 20, y: 65, color: '#e0f7fa' },
    { id: 4, text: 'Ubicazione e siti', x: 45, y: 45, color: '#e0f7fa' },
    { id: 5, text: 'Storia e cronologia', x: 65, y: 45, color: '#e8eaf6' },
    { id: 6, text: 'Sulky / Sulci', x: 80, y: 45, color: '#e8eaf6' },
    { id: 7, text: 'Percorso e fruizione', x: 50, y: 70, color: '#fff3e0' },
    { id: 8, text: 'Significato e dibattiti', x: 65, y: 70, color: '#ffebee' },
    { id: 9, text: 'Valore didattico', x: 80, y: 65, color: '#ffebee' },
    { id: 10, text: 'Reperti e decorazioni', x: 45, y: 30, color: '#fce4ec' },
    { id: 11, text: 'Strutture e siti', x: 65, y: 30, color: '#e8eaf6' },
    { id: 12, text: 'Plastico e ricostruzioni', x: 20, y: 35, color: '#fce4ec' },
    { id: 13, text: 'Inaugurazione museo 2006', x: 80, y: 35, color: '#e8eaf6' }
  ]);

  const [connections, setConnections] = useState([
    { from: 1, to: 2, label: 'ubicazione' },
    { from: 1, to: 3, label: 'resti' },
    { from: 1, to: 4, label: 'ubicazione' },
    { from: 1, to: 5, label: 'contesto' },
    { from: 1, to: 6, label: 'nome storico' },
    { from: 1, to: 7, label: 'fruizione' },
    { from: 1, to: 8, label: 'importanza' },
    { from: 1, to: 10, label: 'reperti' },
    { from: 1, to: 11, label: 'struttura' },
    { from: 2, to: 3, label: 'indirizzo' },
    { from: 5, to: 6, label: 'periodo' },
    { from: 8, to: 9, label: 'valore' },
    { from: 10, to: 12, label: 'allestimento' },
    { from: 11, to: 13, label: 'apertura' }
  ]);

  const [draggedNode, setDraggedNode] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  const handleMouseDown = (e, nodeId) => {
    if (e.detail === 2) {
      setEditingNode(nodeId);
      return;
    }
    
    const node = nodes.find(n => n.id === nodeId);
    const rect = canvasRef.current.getBoundingClientRect();
    setDraggedNode(nodeId);
    const nodeXpx = (node.x / 100) * rect.width;
    const nodeYpx = (node.y / 100) * rect.height;
    setOffset({
      x: (e.clientX - rect.left) / zoom - pan.x - nodeXpx,
      y: (e.clientY - rect.top) / zoom - pan.y - nodeYpx
    });
  };

  const handleMouseMove = (e) => {
    if (draggedNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newXpx = (e.clientX - rect.left) / zoom - pan.x - offset.x;
      const newYpx = (e.clientY - rect.top) / zoom - pan.y - offset.y;
      const newXpercent = (newXpx / rect.width) * 100;
      const newYpercent = (newYpx / rect.height) * 100;
      
      setNodes(nodes.map(node => 
        node.id === draggedNode 
          ? { ...node, x: Math.max(0, Math.min(100, newXpercent)), y: Math.max(0, Math.min(100, newYpercent)) }
          : node
      ));
    } else if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPan({ x: pan.x + dx / zoom, y: pan.y + dy / zoom });
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setIsPanning(false);
  };

  const handleCanvasMouseDown = (e) => {
    // Permetti panning solo se non si clicca su un nodo o pulsante
    const isNodeOrButton = e.target.closest('.mindmap-node') || 
                          e.target.closest('button') || 
                          e.target.closest('input');
    
    if (!isNodeOrButton) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleNodeTextChange = (nodeId, newText) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, text: newText } : node
    ));
  };

  const addNode = () => {
    const newNode = {
      id: Math.max(...nodes.map(n => n.id)) + 1,
      text: 'Nuovo nodo',
      x: 50,
      y: 50,
      color: '#f5f5f5'
    };
    setNodes([...nodes, newNode]);
  };

  const deleteNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
  };

  const handleZoomIn = () => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newZoom = Math.min(zoom * 1.2, 3);
    const zoomRatio = newZoom / zoom;
    
    // Aggiusta il pan per mantenere il centro
    setPan({
      x: pan.x + (centerX / zoom) * (1 - zoomRatio),
      y: pan.y + (centerY / zoom) * (1 - zoomRatio)
    });
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newZoom = Math.max(zoom / 1.2, 0.3);
    const zoomRatio = newZoom / zoom;
    
    // Aggiusta il pan per mantenere il centro
    setPan({
      x: pan.x + (centerX / zoom) * (1 - zoomRatio),
      y: pan.y + (centerY / zoom) * (1 - zoomRatio)
    });
    setZoom(newZoom);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedNode, isPanning, offset, pan, panStart, zoom]);

  // Forza re-render per calcolare le posizioni iniziali
  useEffect(() => {
    if (canvasRef.current) {
      // Trigger un piccolo aggiornamento per forzare il calcolo delle linee
      const timer = setTimeout(() => {
        setNodes([...nodes]);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const getNodeCenter = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return { 
      x: (node.x / 100) * rect.width, 
      y: (node.y / 100) * rect.height 
    };
  };

  return (
    <div className="mindmap-container-fullpage">
      <div className="mindmap-wrapper-fullpage">
        <div className="mindmap-header">
          <h2 className="mindmap-title">Mappa Mentale</h2>
          <div className="mindmap-controls">
            <button onClick={handleZoomIn} className="control-button" title="Zoom In">
              <Plus size={18} />
            </button>
            <button onClick={handleZoomOut} className="control-button" title="Zoom Out">
              <Minus size={18} />
            </button>
            <button onClick={handleResetView} className="control-button" title="Reset Vista">
              <Crosshair size={18} />
            </button>
          </div>
        </div>

        <div className="mindmap-instructions">
          <p>Trascina per spostare • Doppio clic per modificare • Zoom con i pulsanti</p>
        </div>

        <div 
          ref={canvasRef}
          className="mindmap-canvas-fullpage"
          onMouseDown={handleCanvasMouseDown}
          style={{
            backgroundImage: `radial-gradient(circle, ${theme === 'dark' ? '#ccccccff' : '#8f8f8fff'} 1px, transparent 1px)`,
            backgroundSize: '25px 25px',
            backgroundPosition: '0 0'
          }}
        >
          <div style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`, transformOrigin: '0 0', width: '100%', height: '100%' }}>
            <svg 
              ref={svgRef}
              className="mindmap-svg"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#999" />
                </marker>
              </defs>
              
              {connections.map((conn, idx) => {
                const from = getNodeCenter(conn.from);
                const to = getNodeCenter(conn.to);
                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;
                
                return (
                  <g key={idx}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#ddd"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x={midX}
                      y={midY - 5}
                      fill="#999"
                      fontSize="11"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                    >
                      {conn.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {nodes.map(node => (
                <div
                  key={node.id}
                  className="mindmap-node"
                  style={{
                    position: 'absolute',
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    backgroundColor: node.color,
                    transform: 'translate(-50%, -50%)',
                    minWidth: '120px',
                    maxWidth: '180px',
                    borderRadius: '1rem',
                    padding: '0.75rem 1rem',
                    boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
                    cursor: 'move',
                    userSelect: 'none',
                    transition: 'box-shadow 0.2s ease'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                >
                  {editingNode === node.id ? (
                    <input
                      type="text"
                      value={node.text}
                      onChange={(e) => handleNodeTextChange(node.id, e.target.value)}
                      onBlur={() => setEditingNode(null)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingNode(null)}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.875rem',
                        color: '#1f2937',
                        textAlign: 'center',
                        fontFamily: "'Poppins', sans-serif"
                      }}
                      autoFocus
                    />
                  ) : (
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#1f2937', 
                      textAlign: 'center',
                      fontFamily: "'Poppins', sans-serif"
                    }}>
                      {node.text}
                    </div>
                  )}
                  
                  <button
                    onClick={() => deleteNode(node.id)}
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '1'}
                    onMouseLeave={(e) => e.target.style.opacity = '0'}
                    className="delete-node-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mindmap-actions">
          <button
            onClick={addNode}
            style={{
              padding: '0.75rem 1.5rem',
              border: '0.125rem solid var(--primary)',
              borderRadius: '1.5rem',
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Plus size={18} />
            Aggiungi Nodo
          </button>
        </div>
      </div>
    </div>
  );
});

MindMap.displayName = 'MindMap';

export default MindMap;