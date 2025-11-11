import React from 'react';
import './SidePanel.css';

const SidePanel = ({ quizType, setQuizType, colorPalette, setColorPalette, colorPalettes, timerEnabled, setTimerEnabled, immediateFeedbackEnabled, setImmediateFeedbackEnabled }) => {
  const quizTypes = [
    { id: 'single', name: 'Risposta Singola', icon: '🔘', description: 'Scegli un\'opzione corretta' },
    { id: 'multi', name: 'Risposta Multipla', icon: '☑️', description: 'Seleziona tutte le opzioni corrette' },
    { id: 'truefalse', name: 'Vero/Falso', icon: '✅', description: 'Scelta binaria semplice' },
    { id: 'outlined', name: 'Riquadri Contornati', icon: '📦', description: 'Selezione basata su schede' }
  ];

  return (
    <div className="sidepanel">
      <div className="sidepanel-content">
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
              <span className="stat-label">Modalità corrente</span>
              <span className="stat-value">{quizTypes.find(t => t.id === quizType)?.name}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tema</span>
              <span className="stat-value">{colorPalettes[colorPalette].name}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tipi di quiz</span>
              <span className="stat-value">4 Disponibili</span>
            </div>
          </div>
        </div>


        <div className="sidepanel-footer">
          <button className="reset-button" onClick={() => {
            setQuizType('single');
            setColorPalette('default');
            setTimerEnabled(true);
            setImmediateFeedbackEnabled(true);
          }}>
            Reset Impostazioni
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;