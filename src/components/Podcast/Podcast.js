import React, { useState, useRef } from 'react';
import '../../styles/Podcast.css';

// Base URL for podcast audio files
const AUDIO_BASE_URL = 'https://cdn.memoraiz.com/audio/PLAI/';

// Language mapping
const languageMap = {
  italian: 'italian',
  brazilian: 'brazilian',
  english: 'english',
  chinese: 'chinese',
};

// Helper function to build podcast audio URL
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

const Podcast = ({ visualStyle = 'playful', backgroundMusic = true, language = 'italian', voice = 'uomo', multispeaker = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const prefix = visualStyle;
  
  // Generate dynamic audio URL based on user selections
  const audioUrl = buildPodcastAudioUrl({
    language,
    voice,
    multispeaker,
    backgroundMusic,
  });

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
    <div className={`${prefix}-podcast-container`}>
      <div className={`${prefix}-podcast-wrapper`}>
        <div className={`${prefix}-podcast-header`}>
          <h1 className={`${prefix}-podcast-title`}>
            Podcast - Astronomia
          </h1>
          <p className={`${prefix}-podcast-subtitle`}>
            Esplora l'universo attraverso contenuti audio coinvolgenti
          </p>
        </div>

        <div className={`${prefix}-podcast-content`}>
          <div className={`${prefix}-podcast-cover`}>
            <div className={`${prefix}-cover-image`}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>
          </div>

          <div className={`${prefix}-podcast-info`}>
            <h2 className={`${prefix}-episode-title`}>
              Episodio 1: Il Sistema Solare
            </h2>
            <p className={`${prefix}-episode-description`}>
              Un viaggio attraverso i pianeti del nostro sistema solare, dalle loro caratteristiche uniche alle ultime scoperte scientifiche.
            </p>
            <div className={`${prefix}-episode-meta`}>
              <span>Durata: 15:30</span>
              <span>•</span>
              <span>Pubblicato: 14 Nov 2025</span>
            </div>
          </div>
        </div>

        <div className={`${prefix}-podcast-player`}>
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          >
            <source src={audioUrl} type="audio/mpeg" />
            Il tuo browser non supporta l'elemento audio.
          </audio>

          <div className={`${prefix}-player-controls`}>
            <button 
              className={`${prefix}-play-pause-btn`}
              onClick={togglePlayPause}
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

            <div className={`${prefix}-time-display`}>
              {formatTime(currentTime)}
            </div>

            <div className={`${prefix}-progress-container`}>
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                className={`${prefix}-progress-slider`}
              />
            </div>

            <div className={`${prefix}-time-display`}>
              {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podcast;
