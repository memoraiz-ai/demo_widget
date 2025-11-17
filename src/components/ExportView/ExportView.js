import React, { useEffect, useRef, useState } from 'react';
import '../../styles/ExportView.css';
import '../../styles/Podcast.css';
import { SingleQuiz, MultiQuiz, TrueFalseQuiz, OutlinedQuiz } from '../Quiz';
import Flashcard from '../Flashcard';
import Mindmap from '../Mindmap';

// Base URL for podcast audio files
const AUDIO_BASE_URL = 'https://cdn.memoraiz.com/audio/PLAI/';

// Language mapping
const languageMap = {
  italian: 'italian',
  brazilian: 'brazilian',
  english: 'english',
  chinese: 'chinese',
};

// Helper function to build podcast audio URL from config
function buildPodcastAudioUrl(options) {
  const langKey = languageMap[options.language] || 'english';
  let voiceType;
  
  if (options.multispeaker) {
    voiceType = 'dialogue';
  } else if (options.voice === 'uomo') {
    voiceType = 'male';
  } else if (options.voice === 'donna') {
    voiceType = 'female';
  } else {
    voiceType = 'male';
  }
  
  const bgmSuffix = options.backgroundMusic ? '_with_bgm' : '';
  return AUDIO_BASE_URL + langKey + '_' + voiceType + bgmSuffix + '.mp3';
}

const ExportView = ({ exportData, onBack }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const transcriptRefs = useRef([]);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('quiz');
  const [activeContentTab, setActiveContentTab] = useState('transcript');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const safeExportData = exportData || {};
  const jsonString = JSON.stringify(safeExportData, null, 2);

  const transcript = safeExportData?.content?.transcript || [];
  const quizConfig = safeExportData?.config?.quiz || {};
  const flashcardConfig = safeExportData?.config?.flashcard || {};
  const mindmapConfig = safeExportData?.config?.mindmap || {};
  const podcastConfig = safeExportData?.config?.podcast || {};
  const exportDate = safeExportData?.exportMetadata?.exportDate;

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(jsonString)
      .then(() => {
        // Simple feedback without blocking UI
        // eslint-disable-next-line no-alert
        alert('JSON copiato negli appunti!');
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
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

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime || 0);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const handleTranscriptClick = (segment) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = (segment.start || 0) + 0.01;
    videoRef.current.play();
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Audio player handlers
  const toggleAudioPlayPause = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleAudioSeek = (e) => {
    const seekTime = (e.target.value / 100) * audioDuration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setAudioCurrentTime(seekTime);
    }
  };

  // Pause audio when leaving audio tab
  useEffect(() => {
    if (audioRef.current && activeContentTab !== 'audio') {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
  }, [activeContentTab]);

  // Highlight and auto-scroll current transcript segment
  useEffect(() => {
    if (!transcript.length) {
      setActiveSegmentIndex(-1);
      return;
    }

    const index = transcript.findIndex((segment) => {
      const start = segment.start ?? 0;
      const end = segment.end ?? start + 2;
      return currentTime >= start && currentTime < end;
    });

    const nextIndex =
      index === -1 && currentTime >= (transcript[transcript.length - 1].end ?? 0)
        ? transcript.length - 1
        : index;

    if (nextIndex !== -1 && nextIndex !== activeSegmentIndex) {
      setActiveSegmentIndex(nextIndex);
      const el = transcriptRefs.current[nextIndex];
      if (el && typeof el.scrollIntoView === 'function') {
        // Only scroll if element is out of view
        const container = el.parentElement;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const elementRect = el.getBoundingClientRect();
          const buffer = 80;
          
          if (elementRect.top < containerRect.top + buffer || 
              elementRect.bottom > containerRect.bottom - buffer) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }
    }
  }, [currentTime, transcript, activeSegmentIndex]);

  const renderQuiz = () => {
    const type = quizConfig.type || 'single';
    const style = quizConfig.style || 'playful';
    const timerEnabled = quizConfig.timerEnabled ?? true;
    const timerDuration = quizConfig.timerDuration ?? 300;
    const immediateFeedbackEnabled = quizConfig.immediateFeedbackEnabled ?? true;
    const answersCount = quizConfig.answersCount ?? 4;
    const correctPoints = quizConfig.correctPoints ?? 1;
    const incorrectPoints = quizConfig.incorrectPoints ?? -1;

    const commonProps = {
      visualStyle: style,
      timerEnabled,
      timerDuration,
      immediateFeedbackEnabled,
      answersCount,
      correctPoints,
      incorrectPoints
    };

    const quizKey = `export-quiz-${type}-${style}-${timerEnabled}-${timerDuration}-${immediateFeedbackEnabled}-${answersCount}-${correctPoints}-${incorrectPoints}`;

    switch (type) {
      case 'single':
        return <SingleQuiz key={quizKey} {...commonProps} />;
      case 'multi':
        return <MultiQuiz key={quizKey} {...commonProps} />;
      case 'truefalse':
        return <TrueFalseQuiz key={quizKey} {...commonProps} />;
      case 'outlined':
        return <OutlinedQuiz key={quizKey} {...commonProps} />;
      default:
        return <SingleQuiz key={quizKey} {...commonProps} />;
    }
  };

  const renderFlashcard = () => {
    const style = flashcardConfig.style || 'playful';
    const mode = flashcardConfig.mode || 'normal';
    const timerEnabled = flashcardConfig.timerEnabled ?? true;
    const timerDuration = flashcardConfig.timerDuration ?? 300;

    const key = `export-flashcard-${style}-${mode}-${timerEnabled}-${timerDuration}`;

    return (
      <Flashcard
        key={key}
        visualStyle={style}
        mode={mode}
        timerEnabled={timerEnabled}
        timerDuration={timerDuration}
      />
    );
  };

  const renderMindmap = () => {
    const style = mindmapConfig.style || 'playful';
    const showNodeDetails = mindmapConfig.showNodeDetails ?? true;
    const showConnectionLabels = mindmapConfig.showConnectionLabels ?? true;
    const dynamicMapEnabled = mindmapConfig.dynamicMapEnabled ?? true;

    return (
      <Mindmap
        visualStyle={style}
        showNodeDetails={showNodeDetails}
        showConnectionLabels={showConnectionLabels}
        dynamicMapEnabled={dynamicMapEnabled}
      />
    );
  };

  return (
    <div className="export-view-container">
      <div className="export-view-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 10H5m5-5l-5 5 5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Indietro
          </button>
          <div className="export-header-text">
            <h1 className="export-title">MemorAIz – Custom widget demo</h1>
            {/* {exportDate && (
              <p className="export-subtitle">Configurazione esportata il {exportDate}</p>
            )} */}
          </div>
        </div>
      </div>

      <div className="export-view-body">
        {/* First Row: Video + Learning Tools */}
        <div className="export-first-row">
          <div className="export-video-card">
            {/* <div className="export-video-wrapper export-video-16-9"> */}
                <div className="export-video-header">
              <div>
                <h2 className="export-section-title">Educational Video Player</h2>
                <p className="export-section-subtitle">
                  Guarda il video e segui il transcript sincronizzato
                </p>
              </div>
              <div className="export-video-meta">
                <span>{formatTime(currentTime)}</span>
                <span> / </span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <div className="export-video-wrapper">
              <video
                ref={videoRef}
                className="export-video"
                src="https://cdn.memoraiz.com/video/PLAI/barbero_demo_plai.mp4"
                controls
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              >
                Il tuo browser non supporta il tag video.
              </video>
            </div>
          </div>

          <aside className="export-sidebar" aria-label="Learning tools">
            <div className="export-tools-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'quiz'}
                className={`export-tools-tab ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveTab('quiz')}
              >
                Quizzes
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'flashcard'}
                className={`export-tools-tab ${activeTab === 'flashcard' ? 'active' : ''}`}
                onClick={() => setActiveTab('flashcard')}
              >
                Flashcards
              </button>
            </div>
            <div className="export-sidebar-content export-large-content">
              {activeTab === 'quiz' ? renderQuiz() : renderFlashcard()}
            </div>
          </aside>
        </div>

        {/* Second Row: Full-width Content Tabs */}
        <div className="export-second-row">
          <div className="export-content-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeContentTab === 'transcript'}
              className={`export-content-tab ${activeContentTab === 'transcript' ? 'active' : ''}`}
              onClick={() => setActiveContentTab('transcript')}
            >
              Transcript
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeContentTab === 'audio'}
              className={`export-content-tab ${activeContentTab === 'audio' ? 'active' : ''}`}
              onClick={() => setActiveContentTab('audio')}
            >
              Audio Player
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeContentTab === 'mindmap'}
              className={`export-content-tab ${activeContentTab === 'mindmap' ? 'active' : ''}`}
              onClick={() => setActiveContentTab('mindmap')}
            >
              Mind Map
            </button>
          </div>

          <div className="export-content-area">
            {activeContentTab === 'transcript' && (
              <div className="export-transcript-card">
            <div className="export-transcript-header">
              <div>
                <h2 className="export-section-title">Transcript</h2>
                <p className="export-section-subtitle">
                  Auto-scrolling con la riproduzione del video
                </p>
              </div>
            </div>
            <div className="export-transcript-list">
              {transcript.map((segment, index) => {
                const isActive = index === activeSegmentIndex;
                return (
                  <button
                    key={`${segment.start}-${segment.end}-${index}`}
                    type="button"
                    ref={(el) => {
                      transcriptRefs.current[index] = el;
                    }}
                    className={`export-transcript-row ${isActive ? 'active' : ''}`}
                    onClick={() => handleTranscriptClick(segment)}
                  >
                    <span className="export-transcript-time">
                      {formatTime(segment.start)} - {formatTime(segment.end)}
                    </span>
                    <span className="export-transcript-text">{segment.text}</span>
                  </button>
                );
              })}
            </div>
              </div>
            )}

            {activeContentTab === 'audio' && (
              <div className="export-audio-card">
            <div className="export-audio-header">
              <div>
                <h2 className="export-section-title">Audio Player</h2>
                <p className="export-section-subtitle">
                  Ascolta la lezione in formato audio
                </p>
              </div>
            </div>
            <div className={`${podcastConfig.style || 'playful'}-podcast-player`} style={{ background: 'transparent', padding: '1rem 0' }}>
              <audio
                ref={audioRef}
                onTimeUpdate={handleAudioTimeUpdate}
                onLoadedMetadata={handleAudioLoadedMetadata}
                onEnded={() => setIsAudioPlaying(false)}
              >
                <source src={buildPodcastAudioUrl({
                  language: podcastConfig.language || 'italian',
                  voice: podcastConfig.voice || 'uomo',
                  multispeaker: podcastConfig.multispeaker ?? true,
                  backgroundMusic: podcastConfig.backgroundMusic ?? true,
                })} type="audio/mpeg" />
                Il tuo browser non supporta l'elemento audio.
              </audio>

              <div className={`${podcastConfig.style || 'playful'}-player-controls`}>
                <button 
                  className={`${podcastConfig.style || 'playful'}-play-pause-btn`}
                  onClick={toggleAudioPlayPause}
                >
                  {isAudioPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                      <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5v14l11-7z" fill="currentColor"/>
                    </svg>
                  )}
                </button>

                <div className={`${podcastConfig.style || 'playful'}-time-display`}>
                  {formatTime(audioCurrentTime)}
                </div>

                <div className={`${podcastConfig.style || 'playful'}-progress-container`}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioDuration ? (audioCurrentTime / audioDuration) * 100 : 0}
                    onChange={handleAudioSeek}
                    className={`${podcastConfig.style || 'playful'}-progress-slider`}
                  />
                </div>

                <div className={`${podcastConfig.style || 'playful'}-time-display`}>
                  {formatTime(audioDuration)}
                </div>
              </div>
            </div>
              </div>
            )}

            {activeContentTab === 'mindmap' && (
              <div className="export-mindmap-card">
            <div className="export-mindmap-header">
              <h2 className="export-section-title">Mind Map</h2>
              <p className="export-section-subtitle">Visual concept overview</p>
            </div>
            <div className="export-mindmap-body">{renderMindmap()}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportView;
