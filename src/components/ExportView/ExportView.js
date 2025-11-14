import React from 'react';
import '../../styles/ExportView.css';

const ExportView = ({ exportData, onBack }) => {
  const jsonString = JSON.stringify(exportData, null, 2);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      alert('JSON copiato negli appunti!');
    }).catch((err) => {
      console.error('Errore nella copia:', err);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `configurazione-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-view-container">
      <div className="export-view-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 10H5m5-5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Indietro
          </button>
          <h1 className="export-title">Configurazione Esportata</h1>
        </div>
        <div className="header-actions">
          <button className="action-btn copy-btn" onClick={handleCopyToClipboard}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Copia
          </button>
          <button className="action-btn download-btn" onClick={handleDownload}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Scarica
          </button>
        </div>
      </div>

      <div className="export-view-content">
        <div className="json-viewer">
          <pre className="json-content">
            <code>{jsonString}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ExportView;
