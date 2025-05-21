import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Box, Typography, Button } from '@mui/material';

export default function ARPreview({ modelUrl }) {
  const arContainerRef = useRef(null);
  const [arSupported, setArSupported] = useState(false);

  useEffect(() => {
    // Check for WebXR support
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setArSupported(supported);
      });
    }

    // Initialize Google Model Viewer as fallback
    const loader = new Loader({
      apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'beta',
      libraries: ['modelViewer'],
    });

    loader.load().then(() => {
      if (window.google && window.google.maps && window.google.maps.modelViewer && arContainerRef.current) {
        new window.google.maps.modelViewer.ModelViewer({
          container: arContainerRef.current,
          model: {
            url: modelUrl,
          },
        });
      }
    });
  }, [modelUrl]);

  const startAR = async () => {
    if (navigator.xr) {
      try {
        const session = await navigator.xr.requestSession('immersive-ar');
        // AR session started, implement your AR experience here
      } catch (error) {
        console.error('AR session failed:', error);
      }
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        AR Preview
      </Typography>
      
      <Box
        ref={arContainerRef}
        sx={{
          width: '100%',
          height: '400px',
          border: '1px solid #ddd',
          borderRadius: 1,
          overflow: 'hidden',
          mb: 2,
        }}
      />
      
      {arSupported && (
        <Button variant="contained" onClick={startAR}>
          View in AR
        </Button>
      )}
      
      {!arSupported && (
        <Typography color="text.secondary">
          AR not supported on your device. Using 3D preview instead.
        </Typography>
      )}
    </Box>
  );
}