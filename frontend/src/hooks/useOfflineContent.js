import { useState, useEffect } from 'react';
import api from '../services/api';

export function useOfflineContent() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadedRegions, setDownloadedRegions] = useState([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load cached regions from IndexedDB
    const loadCachedRegions = async () => {
      try {
        const cached = await caches.match('/api/user/offline-content');
        if (cached) {
          const data = await cached.json();
          setDownloadedRegions(data.regions || []);
        }
      } catch (error) {
        console.error('Error loading cached regions:', error);
      }
    };
    
    loadCachedRegions();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const downloadRegion = async (regionId) => {
    try {
      const response = await api.get(`/api/regions/${regionId}/offline-pack`);
      
      // Cache the response
      const cache = await caches.open('heritedge-offline');
      await cache.put(`/api/regions/${regionId}`, new Response(JSON.stringify(response.data)));
      
      // Update downloaded regions list
      const newRegions = [...downloadedRegions, regionId];
      setDownloadedRegions(newRegions);
      
      // Cache the regions list
      await cache.put(
        '/api/user/offline-content',
        new Response(JSON.stringify({ regions: newRegions }))
      );
      
      return true;
    } catch (error) {
      console.error('Error downloading region:', error);
      return false;
    }
  };

  const getOfflineData = async (url) => {
    try {
      const cache = await caches.open('heritedge-offline');
      const cached = await cache.match(url);
      if (cached) {
        return await cached.json();
      }
      return null;
    } catch (error) {
      console.error('Error getting offline data:', error);
      return null;
    }
  };

  return {
    isOnline,
    downloadedRegions,
    downloadRegion,
    getOfflineData,
    hasRegion: (regionId) => downloadedRegions.includes(regionId)
  };
}