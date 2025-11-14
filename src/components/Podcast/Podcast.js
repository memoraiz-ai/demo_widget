import React, { useState, useRef } from 'react';
import '../../styles/Podcast.css';

const Podcast = ({ theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="podcast-container">
      <div className="podcast-wrapper">
        <div className="podcast-header">
          <h1 className="podcast-title" style={{ color: theme.popoverForeground }}>
            Podcast - Astronomia
          </h1>
          <p className="podcast-subtitle" style={{ color: theme.foreground }}>
            Esplora l'universo attraverso contenuti audio coinvolgenti
          </p>
        </div>

        <div className="podcast-content">
          <div className="podcast-cover">
            <div className="cover-image" style={{ 
              backgroundColor: theme.primary,
              border: `4px solid ${theme.cardBorder}`
            }}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke={theme.primaryForeground} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6v6l4 2" stroke={theme.primaryForeground} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="2" fill={theme.primaryForeground}/>
              </svg>
            </div>
          </div>

          <div className="podcast-info">
            <h2 className="episode-title" style={{ color: theme.popoverForeground }}>
              Episodio 1: Il Sistema Solare
            </h2>
            <p className="episode-description" style={{ color: theme.foreground }}>
              Un viaggio attraverso i pianeti del nostro sistema solare, dalle loro caratteristiche uniche alle ultime scoperte scientifiche.
            </p>
            <div className="episode-meta" style={{ color: theme.foreground }}>
              <span>Durata: 15:30</span>
              <span>•</span>
              <span>Pubblicato: 14 Nov 2025</span>
            </div>
          </div>
        </div>

        <div className="podcast-player" style={{ 
          backgroundColor: theme.background,
          borderColor: theme.cardBorder 
        }}>
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          >
            <source src="your-audio-file.mp3" type="audio/mpeg" />
            Il tuo browser non supporta l'elemento audio.
          </audio>

          <div className="player-controls">
            <button 
              className="play-pause-btn" 
              onClick={togglePlayPause}
              style={{ 
                backgroundColor: theme.primary,
                color: theme.primaryForeground 
              }}
            >
              {isPlaying ? (
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

            <div className="time-display" style={{ color: theme.foreground }}>
              {formatTime(currentTime)}
            </div>

            <div className="progress-container">
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                className="progress-slider"
                style={{
                  background: `linear-gradient(to right, ${theme.primary} 0%, ${theme.primary} ${duration ? (currentTime / duration) * 100 : 0}%, ${theme.muted} ${duration ? (currentTime / duration) * 100 : 0}%, ${theme.muted} 100%)`
                }}
              />
            </div>

            <div className="time-display" style={{ color: theme.foreground }}>
              {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podcast;
