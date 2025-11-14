import React from 'react';
import '../../styles/SidePanel.css';

const SidePanel = ({ 
  currentPage, 
  quizType, 
  setQuizType, 
  colorPalette, 
  setColorPalette, 
  colorPalettes, 
  timerEnabled, 
  setTimerEnabled, 
  immediateFeedbackEnabled, 
  setImmediateFeedbackEnabled, 
  flashcardMode, 
  setFlashcardMode, 
  onShuffle,
  showNodeDetails,
  setShowNodeDetails,
  showConnectionLabels,
  setShowConnectionLabels,
  dynamicMapEnabled,
  setDynamicMapEnabled,
  podcastTranscript,
  setPodcastTranscript,
  podcastVoice,
  setPodcastVoice,
  podcastMultispeaker,
  setPodcastMultispeaker,
  onExport
}) => {
  const quizTypes = [
    { id: 'single', name: 'Risposta Singola', icon: '🔘', description: 'Scegli un\'opzione corretta' },
    { id: 'multi', name: 'Risposta Multipla', icon: '☑️', description: 'Seleziona tutte le opzioni corrette' },
    { id: 'truefalse', name: 'Vero/Falso', icon: '✅', description: 'Scelta binaria semplice' },
    // { id: 'outlined', name: 'Riquadri Contornati', icon: '📦', description: 'Selezione basata su schede' }
  ];

  const flashcardModes = [
    { id: 'normal', name: 'Domanda classica', icon: '❓', description: 'Domande e risposte standard' },
    { id: 'fillblank', name: 'Riempi lo spazio', icon: '📝', description: 'Completa le frasi con la parola mancante' },
    { id: 'mix', name: 'Mix', icon: '🔄', description: 'Combinazione di modalità diverse' }
  ];

  const podcastTranscripts = [
    { id: 'simple', name: 'Attiva Transcript', icon: '📄', description: 'Genera il transcript del podcast' },
    { id: 'none', name: 'Disattiva Transcript', icon: '🚫', description: 'Nessun transcript' },
  ];

  const mindmapModes = [
    { id: 'dynamic', name: 'Mappa Dinamica', icon: '✨', description: 'Modifica nodi, colori e connessioni' },
    { id: 'static', name: 'Mappa Statica', icon: '🗺️', description: 'Visualizza la mappa senza modifiche' },
  ];

  return (
    <div className="sidepanel">
      <div className="sidepanel-content">
        {currentPage === 'quiz' && (
          <div className="sidepanel-section">
            <h3 className="section-title">Funzionalità</h3>
            <div className="quiz-types">
              {quizTypes.map((type) => (
                <div
                  key={type.id}
                  className={`quiz-type-card ${quizType === type.id ? 'active' : ''}`}
                  onClick={() => setQuizType(type.id)}
                >
                  <div className="quiz-type-header">
                    <span className="quiz-type-icon">{type.icon}</span>
                    <span className="quiz-type-name">{type.name}</span>
                  </div>
                  <p className="quiz-type-description">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'flashcard' && (
          <div className="sidepanel-section">
            <h3 className="section-title">Funzionalità</h3>
            <div className="quiz-types">
              {flashcardModes.map((mode) => (
                <div
                  key={mode.id}
                  className={`quiz-type-card ${flashcardMode === mode.id ? 'active' : ''}`}
                  onClick={() => setFlashcardMode(mode.id)}
                >
                  <div className="quiz-type-header">
                    <span className="quiz-type-icon">{mode.icon}</span>
                    <span className="quiz-type-name">{mode.name}</span>
                  </div>
                  <p className="quiz-type-description">{mode.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'quiz' ? (
          <div className="sidepanel-section">
            <h3 className="section-title">Dettagli</h3>
            <div className="details">
              <div className="detail-item">
                <div className="detail-header">
                  <span className="detail-title">Timer</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="timer-toggle"
                      checked={timerEnabled}
                      onChange={(e) => setTimerEnabled(e.target.checked)}
                    />
                    <label htmlFor="timer-toggle" className="toggle-label">
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <p className="detail-description">
                  Abilita o disabilita il timer per le domande del quiz
                </p>
              </div>
              <div className="detail-item">
                <div className="detail-header">
                  <span className="detail-title">Feedback Immediato</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="immediate-feedback-toggle"
                      checked={immediateFeedbackEnabled}
                      onChange={(e) => setImmediateFeedbackEnabled(e.target.checked)}
                    />
                    <label htmlFor="immediate-feedback-toggle" className="toggle-label">
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <p className="detail-description">
                  Mostra un feedback immediato quando si seleziona una risposta
                </p>
              </div>
            </div>
          </div>
        ) : currentPage === 'flashcard' ? (
          <div className="sidepanel-section">
            <h3 className="section-title">Dettagli</h3>
            <div className="details">
              <div className="detail-item">
                <div className="detail-header">
                  <span className="detail-title">Timer</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="timer-toggle-flashcard"
                      checked={timerEnabled}
                      onChange={(e) => setTimerEnabled(e.target.checked)}
                    />
                    <label htmlFor="timer-toggle-flashcard" className="toggle-label">
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <p className="detail-description">
                  Abilita o disabilita il timer per le flashcard
                </p>
              </div>
              <div className="detail-item">
                <div className="detail-header">
                  <span className="detail-title">Mescola Flashcard</span>
                  <button className="shuffle-button" onClick={onShuffle}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M19.47 4.47a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 1 1-1.06-1.06l.72-.72h-1.793c-.844 0-1.424 0-1.88.045c-.44.043-.706.122-.927.247c-.22.125-.426.313-.689.668c-.272.368-.572.865-1.006 1.589l-2.523 4.205c-.41.685-.747 1.245-1.068 1.679c-.335.453-.688.816-1.155 1.08s-.96.38-1.52.435c-.538.052-1.191.052-1.99.052H2a.75.75 0 0 1 0-1.5h3.603c.844 0 1.424 0 1.88-.045c.44-.043.706-.122.927-.247c.22-.125.426-.313.689-.668c.272-.368.571-.865 1.006-1.589l2.523-4.205c.41-.685.747-1.245 1.068-1.679c.335-.453.688-.816 1.155-1.08s.96-.38 1.52-.435c.538-.052 1.191-.052 1.99-.052h1.828l-.72-.72a.75.75 0 0 1 0-1.06M7.73 7.79c-.196-.038-.418-.041-1.063-.041H2a.75.75 0 0 1 0-1.5h4.74c.546 0 .922 0 1.278.07a3.75 3.75 0 0 1 2.071 1.172c.243.27.436.592.717 1.06l.037.062a.75.75 0 1 1-1.286.772c-.332-.554-.45-.742-.583-.89a2.25 2.25 0 0 0-1.243-.705m5.683 6.566a.75.75 0 0 1 1.03.257c.331.554.448.742.582.89c.327.364.763.611 1.243.705c.196.038.418.041 1.063.041h2.857l-.72-.72a.75.75 0 1 1 1.061-1.06l2 2a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 1 1-1.06-1.06l.72-.72h-2.931c-.545 0-.92 0-1.277-.07a3.75 3.75 0 0 1-2.071-1.172c-.243-.27-.436-.592-.717-1.06l-.037-.062a.75.75 0 0 1 .257-1.03" clipRule="evenodd"/></svg>
                  </button>
                </div>
                <p className="detail-description">
                  Clicca per mescolare l'ordine delle flashcard in modo casuale
                </p>
              </div>
            </div>
          </div>
        ) : null}
        
        {currentPage === 'mindmap' && (
          <>
            <div className="sidepanel-section">
              <h3 className="section-title">Funzionalità</h3>
              <div className="quiz-types">
                {mindmapModes.map((mode) => (
                  <div
                    key={mode.id}
                    className={`quiz-type-card ${(mode.id === 'dynamic' && dynamicMapEnabled) || (mode.id === 'static' && !dynamicMapEnabled) ? 'active' : ''}`}
                    onClick={() => setDynamicMapEnabled(mode.id === 'dynamic')}
                  >
                    <div className="quiz-type-header">
                      <span className="quiz-type-icon">{mode.icon}</span>
                      <span className="quiz-type-name">{mode.name}</span>
                    </div>
                    <p className="quiz-type-description">{mode.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="sidepanel-section">
              <h3 className="section-title">Dettagli</h3>
              <div className="details">
                <div className="detail-item">
                  <div className="detail-header">
                    <span className="detail-title">Visualizza maggiori informazioni nodo</span>
                    <div className="toggle-switch">
                      <input
                        type="checkbox"
                        id="node-details-toggle"
                        checked={showNodeDetails}
                        onChange={(e) => setShowNodeDetails(e.target.checked)}
                      />
                      <label htmlFor="node-details-toggle" className="toggle-label">
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="detail-description">
                    Mostra informazioni dettagliate quando passi il mouse sopra un nodo
                  </p>
                </div>
                <div className="detail-item">
                  <div className="detail-header">
                    <span className="detail-title">Mostra etichette relazioni</span>
                    <div className="toggle-switch">
                      <input
                        type="checkbox"
                        id="connection-labels-toggle"
                        checked={showConnectionLabels}
                        onChange={(e) => setShowConnectionLabels(e.target.checked)}
                      />
                      <label htmlFor="connection-labels-toggle" className="toggle-label">
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="detail-description">
                    Mostra le etichette delle connessioni tra i nodi
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {currentPage === 'podcast' && (
          <>
            <div className="sidepanel-section">
              <h3 className="section-title">Funzionalità</h3>
              <div className="quiz-types">
                {podcastTranscripts.map((transcript) => (
                  <div
                    key={transcript.id}
                    className={`quiz-type-card ${podcastTranscript === transcript.id ? 'active' : ''}`}
                    onClick={() => setPodcastTranscript(transcript.id)}
                  >
                    <div className="quiz-type-header">
                      <span className="quiz-type-icon">{transcript.icon}</span>
                      <span className="quiz-type-name">{transcript.name}</span>
                    </div>
                    <p className="quiz-type-description">{transcript.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidepanel-section">
              <h3 className="section-title">Dettagli</h3>
              <div className="details">
                <div className="detail-item">
                  <div className="detail-header">
                    <span className="detail-title">Voce</span>
                    <div className="voice-selector">
                      <button 
                        className={`voice-btn ${podcastVoice === 'uomo' ? 'active' : ''}`}
                        onClick={() => setPodcastVoice('uomo')}
                      >
                        Uomo
                      </button>
                      <button 
                        className={`voice-btn ${podcastVoice === 'donna' ? 'active' : ''}`}
                        onClick={() => setPodcastVoice('donna')}
                      >
                        Donna
                      </button>
                    </div>
                  </div>
                  <p className="detail-description">
                    Seleziona il tipo di voce per il podcast
                  </p>
                </div>
                <div className="detail-item">
                  <div className="detail-header">
                    <span className="detail-title">Multispeaker</span>
                    <div className="toggle-switch">
                      <input
                        type="checkbox"
                        id="multispeaker-toggle"
                        checked={podcastMultispeaker}
                        onChange={(e) => setPodcastMultispeaker(e.target.checked)}
                      />
                      <label htmlFor="multispeaker-toggle" className="toggle-label">
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="detail-description">
                    Abilita voci multiple per il podcast
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="sidepanel-section">
          <h3 className="section-title">Stile</h3>
          <div className="color-palettes">
            {Object.entries(colorPalettes).map(([key, palette]) => (
              <div
                key={key}
                className={`palette-card ${colorPalette === key ? 'active' : ''}`}
                onClick={() => setColorPalette(key)}
              >
                <div className="palette-preview">
                  <div className="color-sample primary" style={{ backgroundColor: palette.primary }}></div>
                  <div className="color-sample secondary" style={{ backgroundColor: palette.secondary }}></div>
                  <div className="color-sample success" style={{ backgroundColor: palette.success }}></div>
                  <div className="color-sample warning" style={{ backgroundColor: palette.warning }}></div>
                </div>
                <span className="palette-name">{palette.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sidepanel-section">
          <h3 className="section-title">Informazioni rapide</h3>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Pagina corrente</span>
              <span className="stat-value">
                {currentPage === 'quiz' ? 'Quiz' : currentPage === 'flashcard' ? 'Flashcard' : currentPage === 'mindmap' ? 'Mindmap' : 'Podcast'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Modalità</span>
              <span className="stat-value">
                {currentPage === 'quiz'
                  ? quizTypes.find(t => t.id === quizType)?.name
                  : currentPage === 'flashcard'
                  ? flashcardModes.find(m => m.id === flashcardMode)?.name
                  : currentPage === 'mindmap'
                  ? mindmapModes.find(m => (m.id === 'dynamic' && dynamicMapEnabled) || (m.id === 'static' && !dynamicMapEnabled))?.name
                  : currentPage === 'podcast'
                  ? podcastTranscripts.find(t => t.id === podcastTranscript)?.name
                  : 'N/A'
                }
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tema</span>
              <span className="stat-value">{colorPalettes[colorPalette].name}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Opzioni disponibili</span>
              <span className="stat-value">
                {currentPage === 'quiz' ? '4 Quiz' : currentPage === 'flashcard' ? '3 Modalità' : currentPage === 'mindmap' ? '2 Modalità' : '3 Transcript'}
              </span>
            </div>
          </div>
        </div>


        <div className="sidepanel-footer">
          <button className="reset-button" onClick={() => {
            if (currentPage === 'quiz') {
              setQuizType('single');
              setImmediateFeedbackEnabled(true);
            } else if (currentPage === 'flashcard') {
              setFlashcardMode('normal');
            }
            setColorPalette('default');
            setTimerEnabled(true);
          }}>
            Reset
          </button>
          <button className="export-button" onClick={onExport}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Esporta
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;