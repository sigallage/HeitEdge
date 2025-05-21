import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Slider, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Translate,
  ClosedCaption
} from '@mui/icons-material';

export default function AudioPlayer({ story }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [language, setLanguage] = useState(story.language);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'si', name: 'Sinhala' },
    { code: 'ta', name: 'Tamil' }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e, value) => {
    const audio = audioRef.current;
    const newTime = (value / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(value);
  };

  const handleVolumeChange = (e, value) => {
    setVolume(value);
    audioRef.current.volume = value / 100;
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume / 100;
    } else {
      audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // In a real app, you would fetch the audio for the selected language
  };

  return (
    <Box sx={{ 
      p: 2, 
      mb: 2, 
      border: '1px solid #ddd', 
      borderRadius: 2,
      bgcolor: 'background.paper'
    }}>
      <audio
        ref={audioRef}
        src={story.audioUrl}
        preload="metadata"
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton onClick={togglePlay} color="primary">
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        
        <Typography variant="subtitle1" sx={{ flexGrow: 1, ml: 1 }}>
          {story.title}
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
          <Select
            value={language}
            onChange={handleLanguageChange}
            startAdornment={<Translate sx={{ mr: 1 }} />}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <IconButton onClick={() => setShowTranscript(!showTranscript)}>
          <ClosedCaption color={showTranscript ? 'primary' : 'inherit'} />
        </IconButton>
      </Box>
      
      <Slider
        value={progress}
        onChange={handleProgressChange}
        sx={{ width: '100%' }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <IconButton onClick={toggleMute}>
          {isMuted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
        <Slider
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          sx={{ width: 100, ml: 1 }}
        />
      </Box>
      
      {showTranscript && (
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: 'background.default', 
          borderRadius: 1,
          maxHeight: 200,
          overflowY: 'auto'
        }}>
          <Typography variant="body2" whiteSpace="pre-wrap">
            {story.transcript}
          </Typography>
        </Box>
      )}
    </Box>
  );
}