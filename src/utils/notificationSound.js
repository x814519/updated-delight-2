import { createContext, useContext, useState, useEffect } from 'react';

// Create a context to manage notification sound globally
const NotificationSoundContext = createContext();

// Path to the notification sound file
const NOTIFICATION_SOUND_PATH = '/sounds/notification.mp3';

// Provider component for managing notification sounds
export const NotificationSoundProvider = ({ children }) => {
  const [audio, setAudio] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize audio on component mount
  useEffect(() => {
    const audioElement = new Audio(NOTIFICATION_SOUND_PATH);
    setAudio(audioElement);
    setInitialized(true);
    
    // Cleanup
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, []);

  // Function to play notification sound
  const playNotificationSound = () => {
    if (audio) {
      // Reset the audio to the beginning if it's already playing
      audio.pause();
      audio.currentTime = 0;
      
      // Play the notification sound
      const playPromise = audio.play();
      
      // Handle promise rejection (browsers may block autoplay)
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error playing notification sound:', error);
        });
      }
    }
  };

  return (
    <NotificationSoundContext.Provider value={{ playNotificationSound, initialized }}>
      {children}
    </NotificationSoundContext.Provider>
  );
};

// Custom hook for using notification sound functionality
export const useNotificationSound = () => {
  const context = useContext(NotificationSoundContext);
  if (!context) {
    throw new Error('useNotificationSound must be used within a NotificationSoundProvider');
  }
  return context;
}; 