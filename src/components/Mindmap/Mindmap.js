import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Plus, Minus, Crosshair } from 'lucide-react';

const MindMap = forwardRef(({ theme }, ref) => {
  const [nodes, setNodes] = useState([
    { id: 1, text: 'Museo e area archeologica di Sant\'Antioco', x: 50, y: 50, color: '#e8f5e9' },
    { id: 2, text: 'Isola di Sant\'Antioco', x: 20, y: 45, color: '#e0f7fa' },
    { id: 3, text: 'Via Sabatino Moscati', x: 20, y: 65, color: '#e0f7fa' },
    { id: 4, text: 'Ubicazione e siti', x: 35, y: 80, color: '#e0f7fa' },
    { id: 5, text: 'Storia e cronologia', x: 80, y: 55, color: '#e8eaf6' },
    { id: 6, text: 'Sulky / Sulci', x: 80, y: 30, color: '#e8eaf6' },
    { id: 7, text: 'Percorso e fruizione', x: 50, y: 70, color: '#fff3e0' },
    { id: 8, text: 'Significato e dibattiti', x: 65, y: 70, color: '#ffebee' },
    { id: 9, text: 'Valore didattico', x: 76, y: 85, color: '#ffebee' },
    { id: 10, text: 'Reperti e decorazioni', x: 40, y: 30, color: '#fce4ec' },
    { id: 11, text: 'Strutture e siti', x: 60, y: 30, color: '#e8eaf6' },
    { id: 12, text: 'Plastico e ricostruzioni', x: 30, y: 15, color: '#fce4ec' },
    { id: 13, text: 'Inaugurazione museo 2006', x: 70, y: 10, color: '#e8eaf6' }
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
  const [selectedNode, setSelectedNode] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  const handleMouseDown = (e, nodeId) => {
    // Previeni drag se è un doppio click
    if (e.detail === 2) {
      return;
    }
    
    // Salva la posizione iniziale del mouse e il nodo premuto
    const node = nodes.find(n => n.id === nodeId);
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    const nodeXpx = (node.x / 100) * rect.width;
    const nodeYpx = (node.y / 100) * rect.height;
    
    const startPos = {
      x: e.clientX,
      y: e.clientY
    };
    
    const offset = {
      x: (e.clientX - rect.left) / zoom - pan.x - nodeXpx,
      y: (e.clientY - rect.top) / zoom - pan.y - nodeYpx
    };
    
    // Salva queste info per l'handleMouseMove
    e.currentTarget.dragData = {
      nodeId,
      startPos,
      offset,
      hasMoved: false
    };
  };

  const handleMouseMove = (e) => {
    // Gestisci il panning
    if (isPanning && !draggedNode) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      setPan({ 
        x: pan.x + deltaX / zoom,
        y: pan.y + deltaY / zoom
      });
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }
    
    // Controlla se c'è un potenziale drag in corso
    const nodeElements = document.querySelectorAll('.mindmap-node');
    let dragData = null;
    
    nodeElements.forEach(el => {
      if (el.dragData) {
        dragData = el.dragData;
      }
    });
    
    if (dragData && !draggedNode) {
      // Calcola la distanza dal punto iniziale
      const distance = Math.sqrt(
        Math.pow(e.clientX - dragData.startPos.x, 2) +
        Math.pow(e.clientY - dragData.startPos.y, 2)
      );
      
      // Se il mouse si è mosso di almeno 5px, inizia il drag
      if (distance > 5) {
        setDraggedNode(dragData.nodeId);
        setOffset(dragData.offset);
        dragData.hasMoved = true;
      }
    }
    
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
    // Pulisci i dati di drag da tutti i nodi
    const nodeElements = document.querySelectorAll('.mindmap-node');
    nodeElements.forEach(el => {
      delete el.dragData;
    });
    
    setDraggedNode(null);
    setIsPanning(false);
  };

  const handleCanvasMouseDown = (e) => {
    // Permetti panning solo se non si clicca su un nodo o pulsante
    const isNodeOrButton = e.target.closest('.mindmap-node') || 
                          e.target.closest('button') || 
                          e.target.closest('input') ||
                          e.target.closest('textarea');
    
    if (!isNodeOrButton) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setSelectedNode(null); // Deseleziona il nodo quando clicchi sul canvas
      e.preventDefault();
    }
  };

  const handleNodeTextChange = (nodeId, newText) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, text: newText } : node
    ));
  };

  const handleColorChange = (nodeId, newColor) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, color: newColor } : node
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

  const handleWheel = (e) => {
    e.preventDefault();
    
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Posizione del mouse relativa al canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calcola il nuovo zoom (scroll up = zoom in, scroll down = zoom out)
    const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.3, Math.min(3, zoom * zoomDelta));
    const zoomRatio = newZoom / zoom;
    
    // Aggiusta il pan per mantenere il punto sotto il mouse fisso
    setPan({
      x: pan.x + (mouseX / zoom) * (1 - zoomRatio),
      y: pan.y + (mouseY / zoom) * (1 - zoomRatio)
    });
    setZoom(newZoom);
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

  // Listener per il resize della finestra per aggiornare le linee SVG
  useEffect(() => {
    const handleResize = () => {
      // Forza il re-render degli archi aggiornando lo stato dei nodi
      setNodes(prevNodes => [...prevNodes]);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
          <h2 className="mindmap-title">Mindmap Sant'Antioco</h2>
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
          <p>Trascina per spostare • Doppio clic per modificare • Rotella per zoom</p>
        </div>

        <div 
          ref={canvasRef}
          className="mindmap-canvas-fullpage"
          onMouseDown={handleCanvasMouseDown}
          onWheel={handleWheel}
          style={{
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Layer sfondo infinito con puntini */}
          <div style={{ 
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `radial-gradient(circle, ${theme === 'dark' ? '#ccccccff' : '#8f8f8fff'} 1px, transparent 1px)`,
            backgroundSize: `${25 * zoom}px ${25 * zoom}px`,
            backgroundPosition: `${pan.x * zoom}px ${pan.y * zoom}px`
          }} />
          
          {/* Layer contenuto (nodi e linee) */}
          <div style={{ 
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`, 
            transformOrigin: '0 0',
            width: '100%', 
            height: '100%',
            position: 'relative'
          }}>
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
              {nodes.map(node => {
                // Funzione per scurire il colore per il bordo
                const darkenColor = (color) => {
                  const hex = color.replace('#', '');
                  const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - 40);
                  const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - 40);
                  const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - 40);
                  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                };

                return (
                <div
                  key={node.id}
                  className="mindmap-node"
                  style={{
                    position: 'absolute',
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    backgroundColor: node.color,
                    transform: 'translate(-50%, -50%)',
                    minWidth: editingNode === node.id ? 'auto' : '7.5rem',
                    maxWidth: editingNode === node.id ? '25rem' : '11.25rem',
                    width: editingNode === node.id ? 'fit-content' : 'auto',
                    borderRadius: '1rem',
                    padding: '0.75rem 1rem',
                    boxShadow: selectedNode === node.id 
                      ? `0 0 0 0.1875rem ${darkenColor(node.color)}` 
                      : '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
                    cursor: 'move',
                    userSelect: 'none',
                    transition: 'box-shadow 0.2s ease'
                  }}
                  onClick={(e) => {
                    if (!draggedNode && editingNode !== node.id) {
                      e.stopPropagation();
                      setSelectedNode(selectedNode === node.id ? null : node.id);
                    }
                  }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // Pulisci i dati di drag
                    delete e.currentTarget.dragData;
                    setDraggedNode(null);
                    setEditingNode(node.id);
                  }}
                >
                  {editingNode === node.id ? (
                    <textarea
                      ref={(el) => {
                        if (el) {
                          // Posiziona il cursore alla fine del testo
                          el.focus();
                          el.setSelectionRange(el.value.length, el.value.length);
                          // Auto-resize textarea
                          el.style.minHeight = 'auto';
                          el.style.height = 'auto';
                          el.style.height = el.scrollHeight + 'px';
                        }
                      }}
                      value={node.text}
                      onChange={(e) => handleNodeTextChange(node.id, e.target.value)}
                      onBlur={() => setEditingNode(null)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          setEditingNode(null);
                        }
                      }}
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
                        // Auto-resize textarea
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                    />
                  ) : (
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#1f2937', 
                      textAlign: 'center',
                      fontFamily: "'Poppins', sans-serif",
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word'
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
                      display: selectedNode === node.id ? 'flex' : 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'opacity 0.2s ease'
                    }}
                    className="delete-node-btn"
                  >
                    ×
                  </button>

                  {/* Color picker */}
                  {selectedNode === node.id && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '0.5rem',
                        display: 'flex',
                        gap: '0.25rem',
                        padding: '0.5rem',
                        background: 'white',
                        borderRadius: '0.5rem',
                        boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.15)',
                        zIndex: 1000
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {['#e8f5e9', '#e0f7fa', '#e8eaf6', '#fff3e0', '#ffebee', '#fce4ec', '#f3e5f5', '#e1f5fe'].map(color => (
                        <button
                          key={color}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleColorChange(node.id, color);
                          }}
                          style={{
                            width: '1.5rem',
                            height: '1.5rem',
                            backgroundColor: color,
                            border: node.color === color ? '2px solid #333' : '1px solid #ddd',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        />
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
{/* 
          {/* Minimappa }
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
                {(() => {
                  if (!canvasRef.current) return null;
                  
                  const rect = canvasRef.current.getBoundingClientRect();
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
                  
                  // Offset per centrare la mappa nella minimappa (statico)
                  const offsetX = (192 - width * scale) / 2;
                  const offsetY = (128 - height * scale) / 2;
                  
                  // Viewport rectangle che si muove con proporzioni canvas
                  const canvasAspect = rect.width / rect.height;
                  const viewportSize = 100 / zoom; // Dimensione base del viewport
                  
                  let viewportWidthPercent = viewportSize;
                  let viewportHeightPercent = viewportSize;
                  
                  // Aggiusta per aspect ratio
                  if (canvasAspect > 1) {
                    viewportHeightPercent = viewportSize / canvasAspect;
                  } else {
                    viewportWidthPercent = viewportSize * canvasAspect;
                  }
                  
                  // Centro del viewport basato sul pan (NON sullo zoom per evitare spostamenti)
                  const viewportCenterX = 50 - (pan.x / (rect.width / 100));
                  const viewportCenterY = 50 - (pan.y / (rect.height / 100));
                  
                  // Top-left del viewport - il rettangolo si rimpicciolisce centrato sul viewportCenter
                  const viewportLeft = viewportCenterX - viewportWidthPercent / 2;
                  const viewportTop = viewportCenterY - viewportHeightPercent / 2;
                  
                  return (
                    <>
                      {/* Connessioni }
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
                      
                      {/* Nodi come rettangoli }
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
                      
                      {/* Viewport }
                      <rect
                        x={offsetX + (viewportLeft - minX) * scale}
                        y={offsetY + (viewportTop - minY) * scale}
                        width={viewportWidthPercent * scale}
                        height={viewportHeightPercent * scale}
                        fill="rgba(33, 150, 243, 0.2)"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        
                      />
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
          */}
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