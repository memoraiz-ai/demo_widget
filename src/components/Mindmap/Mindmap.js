import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Plus, Minus, Crosshair } from 'lucide-react';

// Informazioni locali per ogni nodo
const nodeInfoData = {
  1: {
    title: 'Museo e area archeologica di Sant\'Antioco',
    description: 'Complesso museale e archeologico',
    extract: 'Principale sito culturale della Sardegna sud-occidentale che valorizza i reperti dell\'antica città fenicio-punica di Sulky.',
  },
  2: {
    title: 'Isola di Sant\'Antioco',
    description: 'Isola del sud-ovest della Sardegna',
    extract: 'Quarta isola italiana per estensione, collegata alla Sardegna da un istmo. Ricca di testimonianze fenicie, puniche e romane.',
  },
  3: {
    title: 'Via Sabatino Moscati',
    description: 'Indirizzo del museo',
    extract: 'Via dedicata a Sabatino Moscati, esperto di civiltà fenicia e punica. Ospita l\'ingresso principale del complesso.',
  },
  4: {
    title: 'Ubicazione e siti',
    description: 'Posizione geografica e siti archeologici',
    extract: 'Il complesso si trova nel centro storico e include necropoli punica e tophet, uno dei più importanti del Mediterraneo.',
  },
  5: {
    title: 'Storia e cronologia',
    description: 'Sviluppo storico del sito',
    extract: 'La storia copre oltre 2500 anni, dalla fondazione fenicia di Sulky (VIII sec. a.C.) all\'epoca bizantina e medievale.',
  },
  6: {
    title: 'Sulky / Sulci',
    description: 'Antica città fenicio-punica',
    extract: 'Una delle più importanti città fenicie in Sardegna (VIII sec. a.C.), divenne centro punico e poi città romana.',
  },
  7: {
    title: 'Percorso e fruizione',
    description: 'Modalità di visita del museo',
    extract: 'Percorso cronologico e tematico con spazi espositivi al chiuso e aree archeologiche all\'aperto con pannelli didattici.',
  },
  8: {
    title: 'Significato e dibattiti',
    description: 'Rilevanza culturale e scientifica',
    extract: 'Sito di grande importanza per lo studio delle civiltà fenicio-puniche, con scoperte sui rituali religiosi e pratiche funerarie.',
  },
  9: {
    title: 'Valore didattico',
    description: 'Importanza educativa del museo',
    extract: 'Eccellente risorsa didattica con laboratori e visite guidate per comprendere la storia antica della Sardegna.',
  },
  10: {
    title: 'Reperti e decorazioni',
    description: 'Collezione archeologica',
    extract: 'Collezione di ceramiche, gioielli, amuleti e stele funerarie che documentano la vita quotidiana e religiosa antica.',
  },
  11: {
    title: 'Strutture e siti',
    description: 'Architettura e complessi archeologici',
    extract: 'Include museo, necropoli ipogea nel tufo, tophet e resti della città romana. Ogni area offre una prospettiva diversa.',
  },
  12: {
    title: 'Plastico e ricostruzioni',
    description: 'Modelli e rappresentazioni',
    extract: 'Plastici e ricostruzioni che visualizzano l\'aspetto originale della città e l\'organizzazione urbana di Sulky/Sulci.',
  },
  13: {
    title: 'Inaugurazione museo 2006',
    description: 'Apertura del museo moderno',
    extract: 'Rinnovato nel 2006 con allestimento moderno, tecnologie multimediali e percorsi didattici innovativi.',
  }
};

const MindMap = forwardRef(({ theme, showNodeDetails, showConnectionLabels, dynamicMapEnabled }, ref) => {
  // Set di icone disponibili (ridotto a 8)
  const availableIcons = ['🏛️', '📍', '📜', '🗺️', '📚', '🔧', '⭐', '🎯'];

  const [nodes, setNodes] = useState([
    { id: 1, text: 'Museo e area archeologica di Sant\'Antioco', x: 50, y: 50, color: '#e8f5e9', icon: '🏛️' },
    { id: 2, text: 'Isola di Sant\'Antioco', x: 20, y: 45, color: '#e0f7fa', icon: '🏝️' },
    { id: 3, text: 'Via Sabatino Moscati', x: 20, y: 65, color: '#e0f7fa', icon: '📍' },
    { id: 4, text: 'Ubicazione e siti', x: 35, y: 80, color: '#e0f7fa', icon: '🗺️' },
    { id: 5, text: 'Storia e cronologia', x: 80, y: 55, color: '#e8eaf6', icon: '📜' },
    { id: 6, text: 'Sulky / Sulci', x: 80, y: 30, color: '#e8eaf6', icon: '🏺' },
    { id: 7, text: 'Percorso e fruizione', x: 50, y: 70, color: '#fff3e0', icon: '🚶' },
    { id: 8, text: 'Significato e dibattiti', x: 65, y: 70, color: '#ffebee', icon: '💡' },
    { id: 9, text: 'Valore didattico', x: 76, y: 85, color: '#ffebee', icon: '📚' },
    { id: 10, text: 'Reperti e decorazioni', x: 40, y: 30, color: '#fce4ec', icon: '💎' },
    { id: 11, text: 'Strutture e siti', x: 60, y: 30, color: '#e8eaf6', icon: '🏗️' },
    { id: 12, text: 'Plastico e ricostruzioni', x: 30, y: 15, color: '#fce4ec', icon: '🎨' },
    { id: 13, text: 'Inaugurazione museo 2006', x: 70, y: 10, color: '#e8eaf6', icon: '🎉' }
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
  const [hoveredNode, setHoveredNode] = useState(null);
  const [editingConnection, setEditingConnection] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const justDraggedRef = useRef(false);

  const handleMouseDown = (e, nodeId) => {
    // Non permettere drag se dinamicMapEnabled è false
    if (!dynamicMapEnabled) return;
    
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
    // Controlla se c'è stato un drag prima di pulire
    const nodeElements = document.querySelectorAll('.mindmap-node');
    let hasMoved = false;
    nodeElements.forEach(el => {
      if (el.dragData && el.dragData.hasMoved) {
        hasMoved = true;
      }
    });
    
    // Imposta la flag se c'è stato un movimento
    if (hasMoved) {
      justDraggedRef.current = true;
      // Resetta la flag dopo un breve delay (dopo che onClick viene chiamato)
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 50);
    }
    
    // Pulisci i dati di drag da tutti i nodi
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

  const handleIconChange = (nodeId, newIcon) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, icon: newIcon } : node
    ));
  };

  const handleConnectionLabelChange = (fromId, toId, newLabel) => {
    setConnections(connections.map(conn => 
      conn.from === fromId && conn.to === toId ? { ...conn, label: newLabel } : conn
    ));
  };

  const addNode = () => {
    // Trova una posizione libera lontana dagli altri nodi
    const findFreePosition = () => {
      const minDistance = 15; // Distanza minima percentuale da altri nodi
      const maxAttempts = 50;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Genera posizione casuale in un'area visibile (tra 20% e 80%)
        const x = 20 + Math.random() * 60;
        const y = 20 + Math.random() * 60;
        
        // Controlla se è sufficientemente lontana da tutti gli altri nodi
        const isFree = nodes.every(node => {
          const distance = Math.sqrt(
            Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)
          );
          return distance >= minDistance;
        });
        
        if (isFree) {
          return { x, y };
        }
      }
      
      // Se non trova uno spazio libero, usa una posizione casuale comunque
      return { 
        x: 20 + Math.random() * 60, 
        y: 20 + Math.random() * 60 
      };
    };
    
    const position = findFreePosition();
    const newNode = {
      id: Math.max(...nodes.map(n => n.id)) + 1,
      text: 'Nuovo nodo',
      x: position.x,
      y: position.y,
      color: '#f5f5f5',
      icon: '📌'
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggedNode, isPanning, offset, pan, panStart, zoom]);

  // Forza re-render per calcolare le posizioni iniziali
  useEffect(() => {
    if (canvasRef.current) {
      // Trigger un piccolo aggiornamento per forzare il calcolo delle linee
      const timer = setTimeout(() => {
        setNodes(n => [...n]);
      }, 100);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Listener per lo zoom con la rotella
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wheelHandler = (e) => {
      e.preventDefault();
      handleWheel(e);
    };

    canvas.addEventListener('wheel', wheelHandler, { passive: false });
    return () => canvas.removeEventListener('wheel', wheelHandler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, pan]); // Dipendenze necessarie per handleWheel

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
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'box-shadow 0.2s ease',
                    zIndex: selectedNode === node.id ? 20000 : (hoveredNode === node.id ? 10000 : 1)
                  }}
                  onClick={(e) => {
                    if (!dynamicMapEnabled) return;
                    
                    // Non selezionare se c'è appena stato un drag o se si sta editando
                    if (!justDraggedRef.current && editingNode !== node.id) {
                      e.stopPropagation();
                      setSelectedNode(selectedNode === node.id ? null : node.id);
                    }
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  onDoubleClick={(e) => {
                    if (!dynamicMapEnabled) return;
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

                  {/* Icona in alto a sinistra */}
                  {node.icon && (
                    <div style={{
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
                    }}>
                      {node.icon}
                    </div>
                  )}

                  {/* Tooltip informazioni - attaccato al nodo */}
                  {showNodeDetails && hoveredNode === node.id && nodeInfoData[node.id] && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '100%',
                        transform: 'translateX(-50%)',
                        marginTop: selectedNode === node.id ? '3.5rem' : '0.5rem',
                        minWidth: '18rem',
                        maxWidth: '25rem',
                        padding: '1rem',
                        background: node.color,
                        borderRadius: '0.75rem',
                        boxShadow: '0 0.5rem 1.5rem rgba(0, 0, 0, 0.2)',
                        zIndex: 10000,
                        fontSize: '0.8rem',
                        color: '#333',
                        pointerEvents: 'none',
                        border: '2px solid ' + node.color,
                        animation: 'tooltipFadeIn 0.3s ease-out',
                        opacity: 1,
                        transition: 'margin-top 0.2s ease'
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
                        {nodeInfoData[node.id].title}
                      </div>
                      
                      {nodeInfoData[node.id].description && (
                        <div style={{ 
                          marginBottom: '0.5rem',
                          fontStyle: 'italic',
                          color: '#555',
                          fontSize: '0.85rem'
                        }}>
                          {nodeInfoData[node.id].description}
                        </div>
                      )}
                      
                      <div style={{ 
                        color: '#666',
                        lineHeight: '1.5',
                        textAlign: 'justify'
                      }}>
                        {nodeInfoData[node.id].extract}
                      </div>
                    </div>
                  )}
                  
                  {/* Pulsante delete - visibile solo con mappa dinamica */}
                  {dynamicMapEnabled && (
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
                  )}

                  {/* Color picker - visibile solo con mappa dinamica */}
                  {dynamicMapEnabled && selectedNode === node.id && (
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

                  {/* Icon picker - visibile solo con mappa dinamica, sopra il nodo */}
                  {dynamicMapEnabled && selectedNode === node.id && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '0.8rem',
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
                      {availableIcons.map(icon => (
                        <button
                          key={icon}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIconChange(node.id, icon);
                          }}
                          style={{
                            width: '2rem',
                            height: '2rem',
                            fontSize: '1.2rem',
                            background: node.icon === icon ? '#e3f2fd' : 'transparent',
                            border: node.icon === icon ? '2px solid #2196f3' : '1px solid #ddd',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.15)';
                            e.target.style.background = '#f5f5f5';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.background = node.icon === icon ? '#e3f2fd' : 'transparent';
                          }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}

              {/* Etichette connessioni come mini contenitori */}
              {showConnectionLabels && connections.map((conn, idx) => {
                if (!canvasRef.current) return null;
                const rect = canvasRef.current.getBoundingClientRect();
                const from = getNodeCenter(conn.from);
                const to = getNodeCenter(conn.to);
                const midXpx = (from.x + to.x) / 2;
                const midYpx = (from.y + to.y) / 2;
                
                // Converti in percentuale
                const midXPercent = (midXpx / rect.width) * 100;
                const midYPercent = (midYpx / rect.height) * 100;
                
                const connKey = `${conn.from}-${conn.to}`;
                
                return (
                  <div
                    key={connKey}
                    className="connection-label"
                    style={{
                      position: 'absolute',
                      left: `${midXPercent}%`,
                      top: `${midYPercent}%`,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      color: '#666',
                      boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)',
                      cursor: dynamicMapEnabled ? 'pointer' : 'default',
                      userSelect: 'none',
                      border: '1px solid #ddd',
                      whiteSpace: 'nowrap',
                      zIndex: 5
                    }}
                    onDoubleClick={(e) => {
                      if (!dynamicMapEnabled) return;
                      e.stopPropagation();
                      setEditingConnection(connKey);
                    }}
                  >
                    {editingConnection === connKey ? (
                      <input
                        autoFocus
                        value={conn.label}
                        onChange={(e) => handleConnectionLabelChange(conn.from, conn.to, e.target.value)}
                        onBlur={() => setEditingConnection(null)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            setEditingConnection(null);
                          }
                        }}
                        style={{
                          width: `${Math.max(4, conn.label.length)}ch`,
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          fontSize: '0.75rem',
                          color: '#666',
                          textAlign: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      conn.label
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Minimappa */}
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
          
          {/* Pulsante aggiungi nodo - posizione assoluta sopra il canvas */}
          {dynamicMapEnabled && (
            <button
              onClick={addNode}
              className="add-node-btn"
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '0.75rem 1.5rem',
                border: '0.125rem solid var(--primary)',
                borderRadius: '1.5rem',
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.15)',
                zIndex: 1000
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(-50%) translateY(-0.25rem) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0.5rem 1.5rem rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(-50%) translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 0.25rem 0.75rem rgba(0, 0, 0, 0.15)';
              }}
            >
              <Plus size={18} />
              Aggiungi Nodo
            </button>
          )}
          
        </div> 

      </div>
    </div>
  );
});

MindMap.displayName = 'MindMap';

export default MindMap;